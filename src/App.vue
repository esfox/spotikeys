<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from './store';

const { auth } = useStore();

onMounted(async () =>
{
  try
  {
    await auth.fetchUser();
  }
  catch(error)
  {
    // TODO: Handle error
    console.error(error);
  }
});
</script>
