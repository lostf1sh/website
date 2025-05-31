<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isActive = (path) => computed(() => route.path === path)
</script>

<template>


  <!-- Desktop Navigation (hidden on small screens, visible on medium and larger) -->
  <nav class="hidden md:block fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-catppuccin-mauve rounded-full shadow-xl z-50 hover:shadow-2xl transition-all duration-300">
    <div class="px-4">
      <div class="flex justify-around h-16">
        <RouterLink 
          to="/" 
          :class="[
            'flex flex-col items-center justify-center px-4 py-2 text-catppuccin-base transition-all duration-300 group relative',
            isActive('/').value ? 'scale-110' : 'hover:scale-110'
          ]"
        >
          <font-awesome-icon icon="fa-solid fa-house" class="text-xl transform transition-transform duration-300 group-hover:rotate-12" />
          <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-catppuccin-base text-catppuccin-mauve px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100">
            Home
          </span>
        </RouterLink>
        
        <RouterLink 
          to="/projects" 
          :class="[
            'flex flex-col items-center justify-center px-4 py-2 text-catppuccin-base transition-all duration-300 group relative',
            isActive('/projects').value ? 'scale-110' : 'hover:scale-110'
          ]"
        >
          <font-awesome-icon icon="fa-solid fa-code" class="text-xl transform transition-transform duration-300 group-hover:rotate-12" />
          <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-catppuccin-base text-catppuccin-mauve px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100">
            Projects
          </span>
        </RouterLink>
        
        <RouterLink 
          to="/songs" 
          :class="[
            'flex flex-col items-center justify-center px-4 py-2 text-catppuccin-base transition-all duration-300 group relative',
            isActive('/songs').value ? 'scale-110' : 'hover:scale-110'
          ]"
        >
          <font-awesome-icon icon="fa-brands fa-spotify" class="text-xl transform transition-transform duration-300 group-hover:rotate-12" />
          <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-catppuccin-base text-catppuccin-mauve px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100">
            Songs
          </span>
        </RouterLink>
      </div>
    </div>
  </nav>

  <!-- Mobile Bottom Navigation Bar (visible on small screens) -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-catppuccin-base border-t border-catppuccin-surface z-40">
    <div class="flex justify-around h-16">
      <RouterLink 
        to="/" 
        :class="[
          'flex flex-col items-center justify-center w-full transition-all duration-300',
          isActive('/').value ? 'text-catppuccin-mauve' : 'text-catppuccin-subtle hover:text-catppuccin-text'
        ]"
      >
        <font-awesome-icon icon="fa-solid fa-house" class="text-xl mb-1" />
        <span class="text-xs">Home</span>
      </RouterLink>
      
      <RouterLink 
        to="/projects" 
        :class="[
          'flex flex-col items-center justify-center w-full transition-all duration-300',
          isActive('/projects').value ? 'text-catppuccin-mauve' : 'text-catppuccin-subtle hover:text-catppuccin-text'
        ]"
      >
        <font-awesome-icon icon="fa-solid fa-code" class="text-xl mb-1" />
        <span class="text-xs">Projects</span>
      </RouterLink>
      
      <RouterLink 
        to="/songs" 
        :class="[
          'flex flex-col items-center justify-center w-full transition-all duration-300',
          isActive('/songs').value ? 'text-catppuccin-mauve' : 'text-catppuccin-subtle hover:text-catppuccin-text'
        ]"
      >
        <font-awesome-icon icon="fa-brands fa-spotify" class="text-xl mb-1" />
        <span class="text-xs">Songs</span>
      </RouterLink>
    </div>
  </nav>
</template>