<script setup lang="ts">
import { ref, PropType } from 'vue'
import { useVModel } from '@vueuse/core'

export type Fields = Record<string, string>

const props = defineProps({
  fields: {
    type: Object as PropType<Fields>,
    required: true
  }
})

const fieldsLocal = useVModel(props, 'fields')
const updateFieldById = (id: keyof Fields, val: string) => {
  fieldsLocal.value = { ...fieldsLocal.value, [id]: val }
}
const removeFieldById = (id: keyof Fields) => {
  const _fields = { ...fieldsLocal.value }
  delete _fields[id]
  fieldsLocal.value = _fields
}

const newFieldId = ref('')
const addNewField = () => {
  if (newFieldId.value && !fieldsLocal.value[newFieldId.value]) {
    fieldsLocal.value = { ...fieldsLocal.value, [newFieldId.value]: '' }
    newFieldId.value = ''
  }
}
</script>

<template>
  <div class="session-fields">
    <div class="session-fields__heading">
      Current fields
    </div>
    <div v-for="[id, val] in Object.entries(fieldsLocal)" :key="id" class="session-fields__field">
      <label :for="id" class="session-fields__field__label">{{ id }}: </label>
      <input :id="id" :value="val" type="text" class="session-fields__field__input" @input="updateFieldById(id, $event.target.value)">
      <button class="session-fields__control" @click="removeFieldById(id)">
        remove
      </button>
    </div>
    <div class="session-fields__heading session-fields__heading--controls">
      Controls
    </div>
    <div class="session-fields__field">
      <label for="new-field" class="session-fields__field__label">add field: </label>
      <input id="new-field" v-model="newFieldId" type="text" class="session-fields__field__input">
      <button class="session-fields__control" @click="addNewField">
        add
      </button>
    </div>
  </div>
</template>

<style scoped>
.session-fields__heading {
  font-weight: bold;
}

.session-fields__heading--controls {
  margin-top: 15px;
}

.session-fields__field {
  height: 30px;
  line-height: 30px;
}

.session-fields__field__label {
  width: 200px;
  display: inline-block;
}

.session-fields__control {
  cursor: pointer;
  margin-left: 4px;
}
</style>
