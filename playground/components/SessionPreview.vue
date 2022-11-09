<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  data: {
    type: Object as PropType<Record<string, string>>,
    required: true
  }
})

</script>

<template>
  <section class="session-preview">
    <div class="session-preview__data">
      {{ data }}
    </div>
  </section>
</template>
