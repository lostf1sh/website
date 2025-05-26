<script setup>
import { getRecentTracks } from '@/services/lastfmService';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCompactDisc, faMusic } from '@fortawesome/free-solid-svg-icons';
import { faLastfm } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCompactDisc, faMusic, faLastfm);

const allTracks = ref([]);
const loading = ref(true);
const error = ref(null);
const updateCounter = ref(0);
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

const fetchData = async () => {
  try {
    loading.value = true;
    const newTracks = await getRecentTracks();
    allTracks.value = newTracks;
    imageErrors.value = {};
    updateCounter.value++;
    error.value = null;
  } catch (err) {
    error.value = "Failed to load tracks. Please try again later.";
    console.error('Error fetching tracks:', err);
  } finally {
    loading.value = false;
  }
};

const goToTrack = (url) => {
  window.open(url, '_blank');
};

onMounted(() => {
  fetchData();
  updateInterval = setInterval(fetchData, 30000);
});

onBeforeUnmount(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>

<template>
  <div class="sm:pt-20 max-w-screen-lg mx-auto p-5 relative">
    <div class="relative mb-10">
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4 text-catppuccin-milk">songs/</h2>
        
        <!-- Now Playing Section -->
        <div class="mb-8 p-4 bg-[#181825]/[.3] border-[#585b70] border-[0.5px] rounded-lg animate-fade-in">
          <div class="text-sm text-catppuccin-gray mb-2">Now Playing</div>
          <div v-if="currentTrack" class="flex items-center gap-4">
            <div class="w-24 h-24 rounded-lg overflow-hidden bg-[#313244] flex items-center justify-center">
              <img 
                :src="currentTrack.image[3]['#text']" 
                alt="track image" 
                class="w-full h-full object-cover"
                @error="handleImageError(currentTrack.name)"
                :class="{ 'hidden': imageErrors[currentTrack.name] }"
              />
              <font-awesome-icon 
                v-if="imageErrors[currentTrack.name]"
                :icon="['fas', 'compact-disc']" 
                class="text-4xl text-catppuccin-subtle animate-spin-slow" 
              />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-catppuccin-milk mb-1">{{ currentTrack.name }}</h3>
              <p class="text-catppuccin-gray mb-2">{{ currentTrack.artist['#text'] }}</p>
              <a :href="currentTrack.url" target="_blank" class="text-catppuccin-blue hover:text-catppuccin-mauve transition-colors duration-300">
                <font-awesome-icon :icon="['fab', 'lastfm']" class="mr-1" />
                View on Last.fm
              </a>
            </div>
          </div>
          <div v-else class="flex items-center gap-4">
            <div class="w-24 h-24 rounded-lg bg-[#313244] flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'music']" class="text-4xl text-catppuccin-subtle" />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-catppuccin-milk mb-1">Not Playing</h3>
              <p class="text-catppuccin-gray">No track is currently playing</p>
            </div>
          </div>
        </div>

        <!-- Recent Tracks Section -->
        <div v-if="loading" class="text-catppuccin-gray text-center">Loading...</div>
        <div v-else-if="error" class="text-catppuccin-red text-center">{{ error }}</div>
        <div v-else class="space-y-4">
          <div
            v-for="track in consolidatedTracks"
            :key="`${track.name}-${track.artist['#text']}-${track.date}`"
            class="flex items-center gap-4 p-3 bg-[#181825]/[.3] border-[#585b70] border-[0.5px] rounded-lg hover:bg-[#313244] transition-all duration-300 cursor-pointer"
            @click="goToTrack(track.url)"
          >
            <div class="w-16 h-16 rounded-md overflow-hidden bg-[#313244] flex items-center justify-center">
              <img 
                :src="track.image[2]['#text']" 
                alt="track image" 
                class="w-full h-full object-cover"
                @error="handleImageError(track.name)"
                :class="{ 'hidden': imageErrors[track.name] }"
              />
              <font-awesome-icon 
                v-if="imageErrors[track.name]"
                :icon="['fas', 'compact-disc']" 
                class="text-2xl text-catppuccin-subtle animate-spin-slow" 
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-catppuccin-milk truncate" :title="track.name">
                {{ track.name }}
                <span v-if="track.playcount > 1" class="text-catppuccin-green text-sm ml-2">{{ track.playcount }}x</span>
              </p>
              <p class="text-catppuccin-gray truncate" :title="track.artist['#text']">{{ track.artist['#text'] }}</p>
            </div>
            <div class="text-sm text-catppuccin-subtle">
              {{ formatDate(track.date) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-spin-slow {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 