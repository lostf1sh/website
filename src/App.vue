<script setup>
import Navigation from './components/Navigation.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="pb-24">
    <router-view></router-view>
    <Navigation />
    <Footer />
  </div>
</template>
