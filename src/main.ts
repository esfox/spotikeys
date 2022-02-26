// vite-env.d.ts
/// <reference types="vite-plugin-pages/client" />

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import routes from '~pages';
import App from './App.vue';

import 'virtual:windi.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/main.scss';

const router = createRouter({ history: createWebHistory(), routes });

createApp(App)
  .use(router)
  .mount('#app');
