import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faStar, faCodeBranch, faCode, faHeart, faLaptopCode, faMusic, faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faDiscord, faSpotify, faMastodon, faInstagram, faLastfm } from '@fortawesome/free-brands-svg-icons';

library.add(
  faGithub, 
  faLinkedin, 
  faDiscord, 
  faSpotify, 
  faMastodon, 
  faInstagram, 
  faLastfm,
  faStar, 
  faCodeBranch, 
  faCode,
  faHeart,
  faLaptopCode,
  faMusic,
  faCompactDisc
);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
