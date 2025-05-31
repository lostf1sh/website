<script setup>
import { ref, onMounted } from 'vue';

const repos = ref([]);
const latestCommit = ref(null);

const truncateMessage = (message, limit = 150) => {
  if (!message) return '';
  const cleanMessage = message.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleanMessage.length <= limit) return cleanMessage;
  return cleanMessage.substring(0, limit) + '...';
};

onMounted(async () => {
  await fetch('https://api.github.com/users/lostf1sh/repos')
    .then(response => response.json())
    .then(data => {
      repos.value = data.sort((a, b) => b.stargazers_count - a.stargazers_count);
    })
    .catch(() => {
      return;
    });

  await fetch('https://api.github.com/repos/lostf1sh/website/commits')
    .then(response => response.json())
    .then(data => {
      if (data && data[0]) {
        latestCommit.value = {
          repo: 'lostf1sh/website',
          message: data[0].commit.message,
          url: data[0].html_url,
          date: new Date(data[0].commit.author.date).toLocaleDateString()
        };
      }
    })
    .catch(() => {
      return;
    });
})
</script>

<template>
  <div class="max-w-screen-lg mx-auto px-4 py-2 md:p-5 relative">
    <div class="z-0 absolute mt-10 text-[6rem] md:text-[10rem] opacity-10 select-none hidden sm:block">🏓</div>
    <div class="relative mb-6 md:mb-10 mt-4 md:mt-8">
      <div class="mb-2 font-black text-xl md:text-2xl">projects/</div>
      
      <div v-if="latestCommit" class="mb-4 md:mb-6 p-3 md:p-4 bg-[#181825]/[.3] border-[#585b70] border-[0.5px] rounded-lg">
        <div class="text-sm text-catppuccin-gray mb-2">Latest Commit</div>
        <a :href="latestCommit.url" target="_blank" class="block hover:bg-[#313244] p-2 rounded transition-all duration-300">
          <div class="flex items-center gap-2 mb-1">
            <font-awesome-icon :icon="['fas', 'code']" class="text-blue-500" />
            <span class="font-bold">{{ latestCommit.repo }}</span>
            <span class="text-sm text-catppuccin-gray">{{ latestCommit.date }}</span>
          </div>
          <div class="text-sm text-catppuccin-text whitespace-pre-wrap">{{ truncateMessage(latestCommit.message) }}</div>
        </a>
      </div>

      <div class="grid sm:grid-cols-2 gap-2">
        <div v-if="!repos.length">projects could not be retrieved.</div>
        <a v-for="repo in repos" :href="repo.html_url" target="_blank"
          class="project-card flex flex-col justify-between px-3 md:px-5 py-3 bg-[#181825]/[.3] border-[#585b70] border-[0.5px] rounded-lg text-xs md:text-sm">
          <div class="flex items-center gap-1 text-catppuccin-gray">
            <img :src="repo.owner.avatar_url" class="rounded-full w-4">
            {{ repo.owner.login }}
          </div>
          <div :class="['font-bold', 'text-lg', repo.archived ? 'line-through' : '']">{{ repo.name }}</div>
          <div>{{ repo.description }}</div>
          <div class="flex mt-2 gap-5">
            <div>
              <font-awesome-icon :icon="['fas', 'star']" />
              {{ repo.stargazers_count }}
            </div>
            <div>
              <font-awesome-icon :icon="['fas', 'code-branch']" />
              {{ repo.forks_count }}
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  transition: all 0.3s ease;
}
.project-card:hover {
  background-color: #313244;
  border-color: #cdd6f4;
}
</style>