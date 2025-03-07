<template>
  <q-page padding>
    <!-- Toggle para mostrar/ocultar el formulario -->
    <q-btn
      @click="mostrarFormulario = !mostrarFormulario"
      color="primary"
      class="q-mb-md"
      icon="add"
      :label="mostrarFormulario ? 'Ocultar Formulario' : 'Agregar Ingrediente'"
    />

    <q-slide-transition>
      <q-card v-show="mostrarFormulario" class="q-pa-md">
        <q-card-section>
          <q-input v-model="ingrediente" label="Ingrediente" filled :error="!!error.ingrediente" />
          <q-input
            v-model.number="cantidad"
            type="number"
            label="Cantidad"
            filled
            :error="!!error.cantidad"
            class="q-mt-md"
          />
          <q-select
            v-model="unidad"
            :options="opcionesUnidades"
            label="Unidad"
            filled
            :error="!!error.unidad"
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Agregar" color="primary" @click="agregarIngrediente" />
        </q-card-actions>
      </q-card>
    </q-slide-transition>

    <!-- Tabla de ingredientes -->
    <q-table
      class="q-mt-md"
      :rows="listaIngredientes"
      :columns="columnas"
      row-key="ingrediente"
      dense
    >
      <template v-slot:body-cell-acciones="props">
        <q-td>
          <q-btn
            flat
            dense
            icon="delete"
            color="red"
            @click="eliminarIngrediente(props.row.ingrediente)"
          >
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Botón para obtener recetas -->
    <q-btn label="Obtener Recetas" color="secondary" class="q-mt-md" @click="obtenerRecetaFalsa" />

    <!-- Mostrar JSON de la API -->
    <q-card v-if="apiResponse" class="q-mt-md">
      <q-card-section>
        <q-markdown>{{ apiResponse }}</q-markdown>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Notify } from 'quasar'

// Estados reactivos
const ingrediente = ref('')
const cantidad = ref<number | null>(null)
const unidad = ref('')
const listaIngredientes = ref<{ ingrediente: string; cantidad: number; unidad: string }[]>([])
const mostrarFormulario = ref(true)
const apiResponse = ref<string | null>(null)

// Opciones para el select de unidades
const opcionesUnidades = ['grs', 'kg', 'ml', 'lt', 'pz']

// Definir errores
const error = ref({ ingrediente: false, cantidad: false, unidad: false })

// Definir columnas de la tabla
const columnas: {
  name: string
  label: string
  align?: 'left' | 'center' | 'right'
  field: string
}[] = [
  { name: 'ingrediente', label: 'Ingrediente', align: 'left', field: 'ingrediente' },
  { name: 'cantidad', label: 'Cantidad', align: 'center', field: 'cantidad' },
  { name: 'unidad', label: 'Unidad', align: 'center', field: 'unidad' },
  { name: 'acciones', label: 'Acciones', align: 'center', field: 'acciones' },
]

// Función para agregar ingredientes
const agregarIngrediente = () => {
  error.value = { ingrediente: false, cantidad: false, unidad: false }

  if (!ingrediente.value) error.value.ingrediente = true
  if (!cantidad.value || cantidad.value <= 0) error.value.cantidad = true
  if (!unidad.value) error.value.unidad = true

  if (error.value.ingrediente || error.value.cantidad || error.value.unidad) {
    Notify.create({
      type: 'negative',
      message: 'Por favor, completa todos los campos correctamente.',
    })
    return
  }

  listaIngredientes.value.push({
    ingrediente: ingrediente.value,
    cantidad: cantidad.value ?? 0,
    unidad: unidad.value,
  })

  ingrediente.value = ''
  cantidad.value = 0
  unidad.value = ''
}

// Función para eliminar ingredientes
const eliminarIngrediente = (nombre: string) => {
  listaIngredientes.value = listaIngredientes.value.filter((item) => item.ingrediente !== nombre)
  Notify.create({ type: 'info', message: 'Ingrediente eliminado' })
}

// Función para obtener datos ficticios de la API
const obtenerRecetaFalsa = () => {
  apiResponse.value = JSON.stringify(
    {
      'hits/recipes': [
        {
          recipe: {
            recipeName: 'Pollo al Horno',
            images: [{ url: 'https://www.example.com/image.jpg', main: true }],
            ingredients: [
              {
                text: '1 ½ cubos de caldo de pollo',
                quantity: 1.5,
                measure: 'unidad',
                food: 'caldo de pollo',
                weight: 1800.0,
                foodCategory: 'Aves',
                foodId: 'food_bmyxrshbfao9s1amjrvhoauob6mo',
                image: 'https://www.edamam.com/food-img/d33/d338229d774a743f7858f6764e095878.jpg',
              },
              {
                text: '2 pechugas de pollo, alrededor de 400g',
                quantity: 2.0,
                measure: 'unidad',
                food: 'pechugas de pollo',
                weight: 544.0,
                foodCategory: 'Aves',
                foodId: 'food_bdrxu94aj3x2djbpur8dhagfhkcn',
                image: 'https://www.edamam.com/food-img/da5/da510379d3650787338ca16fb69f4c94.jpg',
              },
            ],
            missingIngredients: ['Sal', 'Pimienta'],
            calories: 4522.8,
            totalTime: 60,
            cuisineType: ['Americana'],
            mealType: ['Almuerzo/Cena'],
            directions: [
              { step: 1, image: '', instructionText: 'Precalentar el horno a 180°C.' },
              { step: 2, image: '', instructionText: 'Colocar el pollo en una bandeja y sazonar.' },
            ],
          },
        },
      ],
    },
    null,
    2,
  )
}
</script>

<style scoped>
.q-table {
  max-width: 600px;
}
</style>
