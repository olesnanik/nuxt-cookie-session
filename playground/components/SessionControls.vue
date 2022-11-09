<script setup lang="ts">

defineEmits(['get', 'patch', 'put', 'delete'])

const controls = ['get', 'patch', 'put', 'delete']

</script>

<template>
  <div class="session-controls">
    <button v-for="control in controls" :key="control" class="session-controls__control" @click="$emit(control)">
      {{ control }}
    </button>
  </div>
</template>

<style scoped>
.session-controls {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.session-controls__control {
  text-transform: uppercase;
  width: 80px;
  height: 25px;
  cursor: pointer;
}
</style>
