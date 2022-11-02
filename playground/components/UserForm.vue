<script setup>
import { useState } from '#app'
import { useCookieSession } from '../../src/runtime/composables/useCookieSession'

const { data, patchData } = useCookieSession()
const username = useState('username', () => data.value?.username ?? '')

const onSubmit = () => patchData({ username: username.value })
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input v-model="username" type="text" />
    <button type="submit">SAVE</button>
  </form>
</template>
