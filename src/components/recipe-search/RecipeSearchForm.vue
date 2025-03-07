<template>
  <div class="col-12 col-md-6">
    <q-input
      filled
      label="Ingrediente:"
      hint="Que ingreditente tienes?"
      lazy-rules
      v-model="name"
      :rules="[(val) => (val && val.length > 0) || 'Escribe algo']"
    />

    <q-input
      filled
      label="Cantidad:"
      hint="Cantidad disponible"
      lazy-rules
      v-model="quantity"
      :rules="[
        (val) =>
          (val && val.length > 0 && val > 0) || 'Pon una cantidad valida (Valores positivos)',
      ]"
    />

    <q-select v-model="unit" :options="opcionesUnidades" label="Unidad" filled class="q-mt-md" />
    <q-card-actions align="right">
      <q-btn label="Agregar" color="primary" @click="sendIngredient" />
    </q-card-actions>
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
const opcionesUnidades = ['grs', 'kg', 'ml', 'lt', 'pz']
// Definir errores
const error = ref({ ingrediente: false, cantidad: false, unidad: false })
const emits = defineEmits<{
  sendIngredient: [ingredient: Ingredient]
}>()

const sendIngredient = () => {
  error.value = { ingrediente: false, cantidad: false, unidad: false }
  // Validaciones
  if (!name.value) error.value.ingrediente = true
  if (!quantity.value || quantity.value <= 0) error.value.cantidad = true
  if (!unit.value) error.value.unidad = true

  if (error.value.ingrediente || error.value.cantidad || error.value.unidad) {
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
