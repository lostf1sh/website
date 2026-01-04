<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isInitialLoad = ref(true);

router.isReady().then(() => {
    setTimeout(() => {
        isInitialLoad.value = false;
    }, 100);
});
</script>

<template>
    <router-view v-slot="{ Component, route }">
        <Transition :name="isInitialLoad ? '' : 'page'" mode="out-in">
            <component :is="Component" :key="route.path" />
        </Transition>
    </router-view>
</template>

<style>
body {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    margin: 0;
    overflow: hidden;
}

#app {
    transform: scale(0.9);
    transform-origin: center center;
    margin-top: -5vh;
}
</style>

<style>
.page-enter-active {
    transition: all 0.3s ease-out;
}

.page-leave-active {
    transition: all 0.25s ease-in;
}

.page-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.page-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}
</style>
