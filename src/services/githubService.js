const GITHUB_USERNAME = "lostf1sh";

export const getContributionData = async () => {
  const weeks = 53;
  const today = new Date();
  const contributionMap = new Map();

  // Initialize all days in the range with 0 contributions
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    contributionMap.set(dateStr, 0);
  }

  try {
    // Fetch public events (last 90 days, up to 300 events)
    const responses = await Promise.all([
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100&page=1`,
      ),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100&page=2`,
      ),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100&page=3`,
      ),
    ]);

    const allEvents = [];
    for (const res of responses) {
      if (res.ok) {
        const events = await res.json();
        allEvents.push(...events);
      }
    }

    // Count events per day
    for (const event of allEvents) {
      const dateStr = event.created_at.split("T")[0];
      if (contributionMap.has(dateStr)) {
        contributionMap.set(dateStr, contributionMap.get(dateStr) + 1);
      }
    }
  } catch {
    // Return empty data on error
  }

  // Convert to array format for the grid
  const contributions = [];
  const sortedDates = Array.from(contributionMap.keys()).sort();

  for (const date of sortedDates) {
    contributions.push({
      date,
      count: contributionMap.get(date),
    });
  }

  return contributions;
};

export const getContributionLevel = (count) => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 8) return 3;
  return 4;
};
