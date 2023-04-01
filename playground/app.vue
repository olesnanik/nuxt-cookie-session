<script setup lang="ts">
import { ref } from 'vue'
import { useState } from '#app'
import { useCookieSession } from '#imports'

const { data, patchData, putData, deleteSession, getData } = useCookieSession()
data.value = useState('appCookieSession', () => data).value

const fields = ref({ ...(data.value ?? {}) })

const fetchSessionAndUpdateFields = async () => {
  fields.value = await getData()
}
const patchSessionByFields = () => patchData(fields.value)
const putSessionByFields = () => putData(fields.value)
</script>

<template>
  <main class="app">
    <section class="app__section">
      <SessionFields v-model:fields="fields" />
      <SessionControls
        class="app__controls"
        @get="fetchSessionAndUpdateFields"
        @patch="patchSessionByFields"
        @put="putSessionByFields"
        @delete="deleteSession"
      />
    </section>
    <section class="app__section app__section--preview">
      <SessionPreview :data="data" />
    </section>
  </main>
</template>

<style scoped>
.app {
  display: flex;
  padding: 30px;
  box-sizing: border-box;
}

.app__section {
  min-width: calc(50% - 30px);
  height: calc(100vh - 90px);
  padding: 15px;
}

.app__section--preview {
  border: 1px solid black;
}

.app__controls {
  margin-top: 15px;
}
</style>

<style>
body { margin: 0; }
</style>
