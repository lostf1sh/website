---
title: setting up vue router
date: 2024-01-22
tags: [vue, tutorial, webdev]
excerpt: quick guide on integrating vue router into an existing vue 3 project.
---

# setting up vue router

recently added routing to my personal site. here's what i learned.

## installation

```bash
npm install vue-router@4
```

## basic setup

create a router file in `src/router/index.js`:

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'

const routes = [
  { path: '/', component: Home }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
```

## mount in main.js

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

simple but powerful. now you can add as many routes as you need.

-- moli