// vite-env.d.ts
/// <reference types="vite-plugin-pages/client" />

import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import routes from '~pages';
import App from './App.vue';

import 'virtual:windi.css';
import './styles/main.scss';

const router = createRouter({ history: createWebHashHistory(), routes });

createApp(App)
  .use(router)
  .mount('#app');
