<template>
  <form action="POST" class="user-form" @submit.prevent="onSubmit">
    <input v-model="firstname" type="text" class="user-form__firstname">
    <input v-model="age" type="number" class="user-form__age">
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
const { data, updateData } = useCookieSession()
const userData = computed(() => data.value.user)
const firstname = ref(userData.value?.firstname ?? '')
const age = ref(userData.value?.age ?? 0)

const onSubmit = () => updateData({ user: { firstname: firstname.value, age: age.value } })
</script>
