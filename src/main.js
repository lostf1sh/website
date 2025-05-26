import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faStar, faCodeBranch, faCode, faHouse, faTools } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faDiscord, faSpotify, faMastodon, faInstagram } from '@fortawesome/free-brands-svg-icons';

library.add(
  faGithub, 
  faLinkedin, 
  faDiscord, 
  faSpotify, 
  faMastodon, 
  faInstagram, 
  faStar, 
  faCodeBranch, 
  faCode,
  faHouse,
  faTools
);

const app = createApp(App);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
