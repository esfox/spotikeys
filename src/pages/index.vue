<template>
  <button class="bg-primary hover:bg-primary-dark px-4 py-2 m-12" @click="test">Play/Pause</button>
</template>

<script setup lang="ts">
import { Spotify } from '../libraries/spotify';

const test = async () =>
{
  try
  {
    await Spotify.Api.togglePlayback();
  }
  catch(error)
  {
    console.error(error);
  }
};
</script>
