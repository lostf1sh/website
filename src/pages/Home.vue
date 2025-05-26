<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const discordStatusColor = ref('text-catppuccin-subtle');
const spotify = ref(null);
const discordStatus = ref('offline');
const vscodeActivity = ref(null);
const ws = ref(null);
const heartbeatIntervalId = ref(null);

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

onMounted(() => {
  ws.value = new WebSocket('wss://api.lanyard.rest/socket');

  ws.value.onopen = () => {
    ws.value.send(JSON.stringify({
      op: 2,
      d: { subscribe_to_id: '470904884946796544' }
    }));
  };

  ws.value.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.op === 1) {
      ws.value.send(JSON.stringify({ op: 3 }));
      return;
    }

    if (message.t === 'INIT_STATE' || message.t === 'PRESENCE_UPDATE') {
      const data = message.d;
      
      if (data.spotify) {
        spotify.value = {
          song: data.spotify.song,
          artist: data.spotify.artist,
          track_id: data.spotify.track_id
        };
      } else {
        spotify.value = null;
      }

      if (data.discord_status) {
        discordStatus.value = data.discord_status;
        if (data.discord_status === 'online') {
          discordStatusColor.value = 'text-catppuccin-gold';
        } else {
          discordStatusColor.value = 'text-catppuccin-subtle';
        }
      }

      if (data.activities) {
        vscodeActivity.value = data.activities.find(activity => 
          activity.name === 'Visual Studio Code' || 
          activity.name === 'Code'
        );
      }
    }
  };

  ws.value.onclose = () => {
    if (heartbeatIntervalId.value) {
      clearInterval(heartbeatIntervalId.value);
    }
  };
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
  if (heartbeatIntervalId.value) {
    clearInterval(heartbeatIntervalId.value);
  }
});
</script>

<template>
  <div class="sm:pt-20 max-w-screen-lg mx-auto p-5 relative">
    <!-- Decorative elements -->
    <div class="z-0 absolute -mt-10 right-0 text-[10rem] opacity-10 select-none animate-float">🔥</div>
    <div class="z-0 absolute top-1/2 left-0 text-[8rem] opacity-10 select-none animate-float-delayed">⚡</div>
    
    <!-- Header Section -->
    <div class="relative mb-16">
      <div class="font-sans font-black text-6xl text-catppuccin-mauve animate-fade-in mb-8">
        f1sh.pics
      </div>
      <!-- Bio section with personal description -->
      <div class="bg-[#181825]/[.3] border-[#585b70] border-[0.5px] rounded-lg p-8 animate-fade-in" style="animation-delay: 0.1s;">
        <p class="text-catppuccin-text text-lg leading-relaxed">
          A developer who loves building things and solving problems. 
          When I'm not coding, I enjoy playing table tennis and experimenting in the kitchen.
        </p>
      </div>

      <div class="mt-6 animate-slide-up" style="animation-delay: 0.2s;">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="lanyard-card flex items-center gap-3 p-3 rounded-lg text-sm bg-catppuccin-surface/30 border-catppuccin-overlay border-[0.5px] hover:bg-catppuccin-surface hover:border-catppuccin-text transition-all duration-300">
            <font-awesome-icon :icon="['fab', 'spotify']" class="text-2xl text-catppuccin-green w-6 h-6" />
            <div class="text-sm font-sans">
              <div v-if="spotify" class="text-catppuccin-text">
                Listening to 
                <a :href="`https://open.spotify.com/track/${spotify.track_id}`" target="_blank" class="underline hover:text-catppuccin-green">
                  {{ spotify.song }} - {{ spotify.artist }}
                </a>.
              </div>
              <div v-else class="text-catppuccin-subtle">
                Not listening to anything.
              </div>
            </div>
          </div>

          <div class="lanyard-card flex items-center gap-3 p-3 rounded-lg text-sm bg-catppuccin-surface/30 border-catppuccin-overlay border-[0.5px] hover:bg-catppuccin-surface hover:border-catppuccin-text transition-all duration-300">
            <font-awesome-icon :icon="['fab', 'discord']" class="text-2xl w-6 h-6" :class="discordStatusColor" />
            <div class="text-sm font-sans">
              <div :class="discordStatusColor">
                {{ discordStatus.charAt(0).toUpperCase() + discordStatus.slice(1) }} on Discord.
              </div>
            </div>
          </div>

          <div v-if="vscodeActivity" class="lanyard-card flex items-center gap-3 p-3 rounded-lg text-sm bg-catppuccin-surface/30 border-catppuccin-overlay border-[0.5px] hover:bg-catppuccin-surface hover:border-catppuccin-text transition-all duration-300">
            <font-awesome-icon :icon="['fas', 'code']" class="text-2xl w-6 h-6 text-catppuccin-blue" /> 
            <div class="text-sm text-catppuccin-text font-sans">
              <div v-if="typeof vscodeStatus === 'string' && vscodeStatus === 'idling'">
                Currently idling.
              </div>
              <div v-else-if="vscodeStatus && vscodeStatus.details">
                <strong>{{ vscodeStatus.details }}</strong>
                <span v-if="vscodeStatus.state"> in {{ vscodeStatus.state }}</span>.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-6 mt-8 animate-fade-in" style="animation-delay: 0.3s;">
        <a 
          href="https://github.com/lostf1sh/" 
          target="_blank" 
          class="group flex items-center gap-3 p-3 rounded-lg bg-[#181825]/[.3] border-[#585b70] border-[0.5px] hover:bg-[#313244] transition-all duration-300"
        >
          <font-awesome-icon :icon="['fab', 'github']" class="text-2xl text-catppuccin-subtle group-hover:text-catppuccin-mauve transition-colors duration-300" />
          <span class="text-catppuccin-text group-hover:text-catppuccin-mauve transition-colors duration-300">
            GitHub
          </span>
        </a>
        <a 
          href="https://www.instagram.com/lxstf1sh" 
          target="_blank" 
          class="group flex items-center gap-3 p-3 rounded-lg bg-[#181825]/[.3] border-[#585b70] border-[0.5px] hover:bg-[#313244] transition-all duration-300"
        >
          <font-awesome-icon :icon="['fab', 'instagram']" class="text-2xl text-catppuccin-subtle group-hover:text-catppuccin-pink transition-colors duration-300" />
          <span class="text-catppuccin-text group-hover:text-catppuccin-pink transition-colors duration-300">
            Instagram
          </span>
        </a>
        <a 
          href="https://discord.com/user/470904884946796544" 
          target="_blank" 
          class="group flex items-center gap-3 p-3 rounded-lg bg-[#181825]/[.3] border-[#585b70] border-[0.5px] hover:bg-[#313244] transition-all duration-300"
        >
          <font-awesome-icon :icon="['fab', 'discord']" class="text-2xl text-catppuccin-subtle group-hover:text-catppuccin-blue transition-colors duration-300" />
          <span class="text-catppuccin-text group-hover:text-catppuccin-blue transition-colors duration-300">
            Discord
          </span>
        </a>
      </div>
    </div>

    <!-- Uses Section -->
    <div class="relative mb-16">
      <div class="mb-6">
        <h2 class="text-3xl font-black text-catppuccin-mauve mb-4 animate-fade-in">tech stack</h2>
        <p class="text-catppuccin-text mb-6 max-w-2xl animate-fade-in" style="animation-delay: 0.1s;">
          Here's what I use to build and create. A carefully curated set of tools and technologies that help me bring ideas to life.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in" style="animation-delay: 0.2s;">
        <!-- Development Tools -->
        <div class="bg-[#181825]/[.3] border-[#585b70] border-[0.5px] rounded-lg p-6 hover:bg-[#313244] transition-all duration-300">
          <h3 class="text-xl font-bold text-catppuccin-blue mb-4 flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'code']" />
            Development Tools
          </h3>
          <img src="https://skillicons.dev/icons?i=linux,git,vscode,github,gitlab,gcp,firebase" class="select-none mb-2" />
        </div>

        <!-- Technologies -->
        <div class="bg-[#181825]/[.3] border-[#585b70] border-[0.5px] rounded-lg p-6 hover:bg-[#313244] transition-all duration-300">
          <h3 class="text-xl font-bold text-catppuccin-green mb-4 flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'laptop-code']" />
            Technologies
          </h3>
          <img src="https://skillicons.dev/icons?i=python,tailwind,javascript,typescript,vue,react,svelte" class="select-none" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 6s ease-in-out infinite;
  animation-delay: 3s;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style> 