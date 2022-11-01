<template>
  <div>server-rendered-data: {{ data }}</div>
</template>

<script setup>
import { useCookieSession } from '../../../src/runtime/composables/useCookieSession'

const { data } = useCookieSession()
</script>
