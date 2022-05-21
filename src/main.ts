// vite-env.d.ts
/// <reference types="vite-plugin-pages/client" />

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';

import routes from '~pages';
import App from './App.vue';

import { Spotify } from './libraries/spotify';
import { Hotkeys } from './libraries/hotkeys';

import 'virtual:windi.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/main.scss';

/* Setup router */
const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach(async (to) =>
{
  let isLoggedIn = false;
  try
  {
    isLoggedIn = await Spotify.Auth.isLoggedIn();
  }
  catch(error)
  {
    console.error(error);
  }

  if(to.path === '/login' && isLoggedIn)
    return { path: '/' };

  // console.log(to.path !== '/login' && !isLoggedIn);
  if(to.path !== '/login' && !isLoggedIn)
    return { path: '/login' };
});

/* Setup Vue app */
createApp(App)
  .use(router)
  .use(createPinia())
  .mount('#app');

/* Setup keyboard shortcuts */
Hotkeys.setup();
