<template>
  <div class="col-12 col-md-6">
    <div class="input-container">

      <q-input
        filled
        label="Ingrediente:"
        hint="Que ingreditente tienes?"
        lazy-rules
        v-model="name"
        :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
        class="q-mr-md"
      />
      <q-btn label="Agregar" color="primary" @click="sendIngredient" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Notify } from 'quasar'
import { ref } from 'vue'
export interface Ingredient {
  name: string
  quantity: number
  unit: string
}

const name = ref('')
const quantity = ref(0)
const unit = ref('')
// Opciones para el select de unidades
//const opcionesUnidades = ['grs', 'kg', 'ml', 'lt', 'pz']
// Definir errores
const error = ref({ ingrediente: false, cantidad: false, unidad: false })
const emits = defineEmits<{
  sendIngredient: [ingredient: Ingredient]
}>()

const sendIngredient = () => {
  error.value = { ingrediente: false, cantidad: false, unidad: false }
  // Validaciones
  if (!name.value) error.value.ingrediente = true

  if (error.value.ingrediente) {
    Notify.create({
      type: 'negative',
      message: 'Por favor, completa todos los campos correctamente.',
    })
    return
  }
  emits('sendIngredient', { name: name.value, quantity: quantity.value, unit: unit.value })
  name.value = ''
  quantity.value = 0
  unit.value = ''
}
</script>
<style scoped>
.input-container {
  display: flex;
  align-items: center;
  gap: 16px; /* Space between the input and button */
}

.q-mr-md {
  flex: 1; /* Make the input take up the remaining space */
}
</style>