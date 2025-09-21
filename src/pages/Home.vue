<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { lanyardData } from '@/services/lanyardService';
import { getRecentTracks } from '@/services/lastfmService';


const discordStatusColor = computed(() => lanyardData.discordStatusColor);
const spotify = computed(() => lanyardData.spotify);
const discordStatus = computed(() => lanyardData.discordStatus);
const discordUser = computed(() => lanyardData.discordUser);
const vscodeActivity = computed(() => lanyardData.vscodeActivity);
const isLoading = computed(() => lanyardData.isLoading);

const vscodeStatus = computed(() => {
  if (!vscodeActivity.value) return null;

  if (vscodeActivity.value.details && vscodeActivity.value.details.toLowerCase().includes('idling')) {
    return 'idling';
  }
  return {
    name: vscodeActivity.value.name,
    details: vscodeActivity.value.details,
    state: vscodeActivity.value.state
  };
});

const profilePhotoUrl = computed(() => {
  if (!isLoading.value && discordUser.value?.avatar) {
    const { id, avatar } = discordUser.value;
    const extension = avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${id}/${avatar}.${extension}`;
  }
  return null;
});


const repos = ref([]);

const allTracks = ref([]);
const songsLoading = ref(true);
const songsError = ref(null);
const imageErrors = ref({});
let updateInterval = null;



const handleImageError = (trackName) => {
  imageErrors.value[trackName] = true;
};

const currentTrack = computed(() => {
  return allTracks.value.find(track => track['@attr']?.nowplaying);
});

const consolidatedTracks = computed(() => {
  const tracks = allTracks.value.filter(track => !track['@attr']?.nowplaying);
  const consolidated = [];
  let currentTrack = null;
  let count = 1;

  tracks.forEach((track, index) => {
    const key = `${track.name}-${track.artist['#text']}`;

    if (currentTrack === key) {
      count++;
    } else {
      if (currentTrack) {
        const prevTrack = tracks[index - 1];
        consolidated.push({
          ...prevTrack,
          playcount: count,
          date: prevTrack.date?.['#text']
        });
      }
      currentTrack = key;
      count = 1;
    }

    if (index === tracks.length - 1) {
      consolidated.push({
        ...track,
        playcount: count,
        date: track.date?.['#text']
      });
    }
  });

  return consolidated.slice(0, 10);
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};



const getLanguageIcon = (language) => {
  const devIcons = {
    'QML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/qt/qt-original.svg',
    'CMake': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cmake/cmake-original.svg',
    'Makefile': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cmake/cmake-original.svg',
    'Objective-C': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/objectivec/objectivec-plain.svg',
    'Vim script': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vim/vim-original.svg'
  };

  // Check if we have a devicon first
  if (devIcons[language]) {
    return devIcons[language];
  }
  const languageMap = {
    'JavaScript': 'js',
    'TypeScript': 'ts',
    'Python': 'py',
    'Java': 'java',
    'C++': 'cpp',
    'C#': 'cs',
    'C': 'c',
    'Go': 'go',
    'Rust': 'rust',
    'PHP': 'php',
    'Ruby': 'ruby',
    'Swift': 'swift',
    'Kotlin': 'kotlin',
    'Dart': 'dart',
    'HTML': 'html',
    'CSS': 'css',
    'Vue': 'vue',
    'React': 'react',
    'Svelte': 'svelte',
    'Angular': 'angular',
    'Shell': 'bash',
    'PowerShell': 'powershell',
    'Dockerfile': 'docker'
  };

  const mappedLanguage = languageMap[language] || language.toLowerCase();
  return `https://skillicons.dev/icons?i=${mappedLanguage}`;
};

const fetchSongs = async () => {
  try {
    songsLoading.value = true;
    const newTracks = await getRecentTracks();
    allTracks.value = newTracks;
    imageErrors.value = {};
    songsError.value = null;
  } catch (err) {
    songsError.value = "Failed to load tracks. Please try again later.";
    console.error('Error fetching tracks:', err);
  } finally {
    songsLoading.value = false;
  }
};

const fetchProjects = async () => {
  try {
    const reposResponse = await fetch('https://api.github.com/users/lostf1sh/repos');
    const reposData = await reposResponse.json();
    repos.value = reposData.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

onMounted(() => {
  fetchProjects();
  fetchSongs();
  updateInterval = setInterval(fetchSongs, 30000);
});

onBeforeUnmount(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>

<template>
  <div class="w-full max-w-screen-lg mx-auto px-3 sm:px-4 py-4 md:p-6 relative min-h-screen overflow-x-hidden">
    <!-- Decorative elements -->
    <div class="z-0 absolute -mt-10 right-0 text-[6rem] md:text-[10rem] opacity-10 select-none hidden sm:block">🔥</div>
    <div class="z-0 absolute top-1/2 left-0 text-[5rem] md:text-[8rem] opacity-10 select-none hidden sm:block">⚡</div>
    <div class="z-0 absolute top-1/4 right-1/4 text-[4rem] md:text-[6rem] opacity-5 select-none hidden lg:block">✨</div>

    <!-- Header Section -->
    <div class="relative mb-6 md:mb-8 mt-6 md:mt-10">
      <!-- Hero Section -->
      <div class="mb-10">
        <!-- Title with Profile -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-catppuccin-surface flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-catppuccin-mauve/30 shadow-lg">
              <img v-if="profilePhotoUrl"
                :src="profilePhotoUrl"
                alt="Profile Avatar" class="w-full h-full object-cover" />
              <font-awesome-icon v-else :icon="['fas', 'user']" class="text-2xl md:text-3xl text-catppuccin-blue" />
            </div>
            <div class="flex-1">
              <p class="text-base sm:text-lg md:text-xl text-catppuccin-text font-medium mb-1">
                <span class="text-catppuccin-blue">duhan</span> <span class="text-catppuccin-subtle">(<span
                    class="text-catppuccin-green">aka moli</span>)</span>
              </p>
              <h1 class="font-sans text-2xl sm:text-3xl md:text-4xl font-black text-catppuccin-text">
                <span class="text-catppuccin-mauve">f1sh</span><span class="text-catppuccin-subtle">.dev</span>
              </h1>
            </div>
          </div>

          <!-- Social Links -->
          <div class="flex items-center justify-center sm:justify-end gap-3 sm:gap-4">
            <a href="https://github.com/lostf1sh" target="_blank"
              class="w-12 h-12 glass rounded-xl text-catppuccin-subtle hover:text-catppuccin-mauve transition-colors flex items-center justify-center">
              <font-awesome-icon :icon="['fab', 'github']" class="text-xl" />
            </a>
            <a href="https://www.instagram.com/lxstf1sh" target="_blank"
              class="w-12 h-12 glass rounded-xl text-catppuccin-subtle hover:text-catppuccin-pink transition-colors flex items-center justify-center">
              <font-awesome-icon :icon="['fab', 'instagram']" class="text-xl" />
            </a>
            <a href="https://discord.com/user/470904884946796544" target="_blank"
              class="w-12 h-12 glass rounded-xl text-catppuccin-subtle hover:text-catppuccin-blue transition-colors flex items-center justify-center">
              <font-awesome-icon :icon="['fab', 'discord']" class="text-xl" />
            </a>
            <a href="https://open.spotify.com/user/31q6jft6qtkzisve7zu2o2mytyry?si=1c9f27a30d25435b" target="_blank"
              class="w-12 h-12 glass rounded-xl text-catppuccin-subtle hover:text-catppuccin-green transition-colors flex items-center justify-center">
              <font-awesome-icon :icon="['fab', 'spotify']" class="text-xl" />
            </a>
          </div>
        </div>

        <!-- Bio & Status Grid -->
        <div class="grid lg:grid-cols-3 gap-4 sm:gap-6">
          <!-- Bio Card -->
          <div class="lg:col-span-2 glass rounded-2xl p-6 hover-glow transition-shadow">
            <p class="text-base md:text-lg text-catppuccin-gray leading-relaxed mb-4">
              <span class="text-catppuccin-yellow font-semibold">Junior developer</span> with a passion for 
              <span class="text-catppuccin-pink font-semibold">building things nobody asked for</span>. 
              When I'm not coding, you can find me playing table tennis or experimenting with new recipes in the kitchen.
            </p>

            <!-- Status Indicators -->
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-sm">
                <font-awesome-icon :icon="['fab', 'discord']" class="text-catppuccin-blue" />
                <span v-if="!isLoading && discordUser" class="text-catppuccin-text">
                  <span class="font-medium text-catppuccin-text">{{ discordUser.username }}</span>
                  <span :class="discordStatusColor" class="ml-1">({{ discordStatus }})</span>
                </span>
                <span v-else class="text-catppuccin-subtle">Discord loading...</span>
              </div>

              <div class="flex items-center gap-3 text-sm">
                <font-awesome-icon :icon="['fab', 'spotify']"
                  :class="spotify ? 'text-catppuccin-green' : 'text-catppuccin-subtle'" />
                <span v-if="!isLoading && spotify" class="text-catppuccin-text">
                  <span class="text-catppuccin-green font-medium">{{ spotify.song }}</span>
                  <span class="text-catppuccin-gray"> by {{ spotify.artist }}</span>
                </span>
                <span v-else-if="!isLoading" class="text-catppuccin-subtle">
                  not listening to music
                </span>
                <span v-else class="text-catppuccin-subtle">Spotify loading...</span>
              </div>

              <div v-if="!isLoading && vscodeActivity && vscodeStatus && vscodeStatus.details"
                class="flex items-center gap-3 text-sm">
                <font-awesome-icon :icon="['fas', 'code']" class="text-catppuccin-blue" />
                <span class="text-catppuccin-text">
                  coding <span class="text-catppuccin-blue font-medium">{{ vscodeStatus.details }}</span>
                  <span v-if="vscodeStatus.state" class="text-catppuccin-gray"> in {{ vscodeStatus.state }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Tech Stack Card -->
          <div class="glass rounded-2xl p-6 hover-glow transition-shadow">
            <h3 class="text-lg font-bold text-catppuccin-mauve mb-4">uses/</h3>
            <div class="grid grid-cols-4 gap-2">
              <img src="https://skillicons.dev/icons?i=linux"
                class="w-8 h-8 hover:scale-110 transition-transform" />
              <img src="https://skillicons.dev/icons?i=git"
                class="w-8 h-8 hover:scale-110 transition-transform" />
              <img src="https://skillicons.dev/icons?i=vscode"
                class="w-8 h-8 hover:scale-110 transition-transform" />
              <img src="https://skillicons.dev/icons?i=github"
                class="w-8 h-8 hover:scale-110 transition-transform" />
              <img src="https://skillicons.dev/icons?i=python"
                class="w-8 h-8 hover:scale-110 transition-transform" />
              <img src="https://skillicons.dev/icons?i=javascript"
                class="w-8 h-8 hover:scale-110 transition-transform" />
              <img src="https://skillicons.dev/icons?i=typescript"
                class="w-8 h-8 hover:scale-110 transition-transform" />
              <img src="https://skillicons.dev/icons?i=vue"
                class="w-8 h-8 hover:scale-110 transition-transform" />
              <img src="https://skillicons.dev/icons?i=react"
                class="w-8 h-8 hover:scale-110 transition-transform" />
              <img src="https://skillicons.dev/icons?i=svelte"
                class="w-8 h-8 hover:scale-110 transition-transform" />
              <img src="https://skillicons.dev/icons?i=nextjs"
                class="w-8 h-8 hover:scale-110 transition-transform" />
              <img src="https://skillicons.dev/icons?i=tailwind"
                class="w-8 h-8 hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Projects & Songs Side by Side -->
    <div class="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-12">
      <!-- Projects Section -->
      <div class="relative">
        <h2 class="text-lg md:text-xl font-black text-catppuccin-mauve mb-3 animate-fade-in">projects/</h2>

        <div class="space-y-2">
          <div v-if="!repos.length" class="text-center text-catppuccin-subtle py-8">
            <font-awesome-icon :icon="['fas', 'code']" class="text-2xl mb-2 opacity-50" />
            <p class="text-xs">Projects could not be retrieved.</p>
          </div>
          <a v-for="repo in repos.slice(0, 6)" :key="repo.id" :href="repo.html_url" target="_blank"
            class="flex items-center gap-3 p-3 glass rounded-lg hover-glow transition-shadow cursor-pointer group">
            <div
              class="w-8 h-8 rounded-md bg-catppuccin-surface flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img v-if="repo.language" 
                :src="getLanguageIcon(repo.language)"
                :alt="repo.language"
                class="w-full h-full object-cover transition-transform group-hover:scale-110"
                @error="$event.target.src = repo.owner.avatar_url">
              <img v-else :src="repo.owner.avatar_url"
                class="w-full h-full object-cover transition-transform group-hover:scale-110">
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-catppuccin-text truncate text-sm group-hover:text-catppuccin-mauve transition-colors"
                :title="repo.name">
                {{ repo.name }}
              </p>
              <p class="text-catppuccin-gray truncate text-xs" :title="repo.description">
                {{ repo.description || 'No description' }}
              </p>
            </div>
            <div class="flex items-center gap-2 text-xs flex-shrink-0">
              <div class="flex items-center gap-1 text-catppuccin-yellow">
                <font-awesome-icon :icon="['fas', 'star']" />
                {{ repo.stargazers_count }}
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- Songs Section -->
      <div class="relative">
        <h2 class="text-lg md:text-xl font-black text-catppuccin-mauve mb-3 animate-fade-in">songs/</h2>

        <div class="space-y-2">
          <!-- Loading State - Show skeleton cards -->
          <template v-if="songsLoading">
            <div v-for="i in 6" :key="`loading-${i}`" class="flex items-center gap-3 p-3 glass rounded-lg animate-pulse">
              <div class="w-8 h-8 rounded-md bg-catppuccin-surface flex items-center justify-center flex-shrink-0">
                <font-awesome-icon :icon="['fas', 'music']" class="text-sm text-catppuccin-subtle opacity-50" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="h-4 bg-catppuccin-surface rounded mb-1 w-3/4"></div>
                <div class="h-3 bg-catppuccin-surface rounded w-1/2"></div>
              </div>
              <div class="w-12 h-3 bg-catppuccin-surface rounded"></div>
            </div>
          </template>
          
          <!-- Error State -->
          <div v-else-if="songsError" class="text-center text-catppuccin-red py-8">
            <font-awesome-icon :icon="['fas', 'music']" class="text-2xl mb-2 opacity-50" />
            <p class="text-xs">{{ songsError }}</p>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="!consolidatedTracks.length && !currentTrack" class="text-center text-catppuccin-subtle py-8">
            <font-awesome-icon :icon="['fas', 'music']" class="text-2xl mb-2 opacity-50" />
            <p class="text-xs">No recent tracks found.</p>
          </div>

          <!-- Loaded Content -->
          <template v-else>
            <!-- Now Playing Track (if exists) -->
            <a v-if="currentTrack" :href="currentTrack.url" target="_blank"
              class="flex items-center gap-3 p-3 glass rounded-lg hover-glow transition-all duration-200 cursor-pointer transform hover:scale-105 group border border-catppuccin-green/30">
              <div
                class="w-8 h-8 rounded-md overflow-hidden bg-catppuccin-surface flex items-center justify-center flex-shrink-0">
                <img :src="currentTrack.image[1]['#text']" alt="track image"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  @error="handleImageError(currentTrack.name)" :class="{ 'hidden': imageErrors[currentTrack.name] }" />
                <font-awesome-icon v-if="imageErrors[currentTrack.name]" :icon="['fas', 'compact-disc']"
                  class="text-sm text-catppuccin-subtle animate-spin-slow" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-catppuccin-text truncate text-sm group-hover:text-catppuccin-green transition-colors duration-200"
                  :title="currentTrack.name">
                  {{ currentTrack.name }}
                </p>
                <p class="text-catppuccin-gray truncate text-xs" :title="currentTrack.artist['#text']">{{
                  currentTrack.artist['#text'] }}</p>
              </div>
              <div class="flex items-center gap-1 text-catppuccin-green text-xs flex-shrink-0">
                <div class="w-1.5 h-1.5 rounded-full bg-catppuccin-green animate-pulse"></div>
                Now
              </div>
            </a>

            <!-- Recent Tracks -->
            <a v-for="track in consolidatedTracks.slice(0, currentTrack ? 5 : 6)"
              :key="`${track.name}-${track.artist['#text']}-${track.date}`" :href="track.url" target="_blank"
              class="flex items-center gap-3 p-3 glass rounded-lg hover-glow transition-shadow cursor-pointer group">
              <div
                class="w-8 h-8 rounded-md overflow-hidden bg-catppuccin-surface flex items-center justify-center flex-shrink-0">
                <img :src="track.image[1]['#text']" alt="track image"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  @error="handleImageError(track.name)" :class="{ 'hidden': imageErrors[track.name] }" />
                <font-awesome-icon v-if="imageErrors[track.name]" :icon="['fas', 'compact-disc']"
                  class="text-sm text-catppuccin-subtle animate-spin-slow" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-catppuccin-text truncate text-sm group-hover:text-catppuccin-mauve transition-colors" :title="track.name">
                  {{ track.name }}
                  <span v-if="track.playcount > 1" class="text-catppuccin-green text-xs ml-1">{{ track.playcount
                  }}x</span>
                </p>
                <p class="text-catppuccin-gray truncate text-xs" :title="track.artist['#text']">{{ track.artist['#text']
                }}</p>
              </div>
              <div class="text-xs text-catppuccin-subtle flex-shrink-0">
                {{ formatDate(track.date) }}
              </div>
            </a>
          </template>
        </div>
      </div>
    </div>



  </div>
</template>
