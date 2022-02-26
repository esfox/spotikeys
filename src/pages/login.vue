<template>
  <div class="grid place-items-center h-full">
    <button
      v-if="isCallback"
      class="bg-spotify hover:bg-spotify-dark text-black text-2xl font-bold rounded-full p-4 pr-6 m-12"
      @click="login"
    >
      <i class="fa-brands fa-spotify fa-xl mr-2"></i>
      Login with Spotify
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Spotify } from '../libraries/spotify';

const isCallback = ref(false);
onMounted(async () =>
{
  const params = new URLSearchParams(location.search);
  if(!params.get('code') || !params.get('state'))
    return isCallback.value = true;

  try
  {
    await Spotify.Auth.fetchAccessToken();
  }
  catch(error)
  {
    console.error(error);
  }
});

const login = async () =>
{
  try
  {
    await Spotify.Auth.login();
  }
  catch(error)
  {
    console.error(error);
  }
};
</script>
