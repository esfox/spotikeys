<template>
  <div class="w-full bg-background-light text-white rounded-xl p-6">
    <input v-model="query" ref="input" type="text" class="w-full bg-background-lighter rounded-xl p-4"
      placeholder="Search or enter a command..." autofocus />
    <ul v-if="!!query && shownCommands.length > 0" class="mt-4">
      <li v-for="{ label, run } of shownCommands" class="bg-background-lighter p-3 my-3 rounded-md" role="button"
        @click="runCommand(run)">
        {{ label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { QuickCommands } from '../libraries/QuickCommands';

const input = ref<HTMLInputElement>();
const query = ref('');

const shownCommands = computed(() => QuickCommands.commands.filter(({ name, label }) =>
  name.toLowerCase().includes(query.value) || label.toLowerCase().includes(query.value)
));

const runCommand = (command: () => void) =>
{
  query.value = '';
  command();
};

QuickCommands.events.onFocus(() =>
{
  if(!input.value)
    return;

  input.value.focus();
})
</script>
