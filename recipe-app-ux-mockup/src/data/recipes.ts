/** Mock recipes for UX prototype - simulates the current app content */

export interface MockRecipe {
  id: string;
  name: string;
  description: string;
  totalTime: number;
  calories: number;
  imageUrl?: string;
  cuisinTypes?: string[];
  ingredients: { text: string }[];
  directions: { instructionText: string }[];
}

export const mockRecipes: MockRecipe[] = [
  {
    id: '1',
    name: 'Pasta al pesto con albahaca',
    description: 'Clásica pasta italiana con pesto casero de albahaca, piñones y parmesano.',
    totalTime: 25,
    calories: 420,
    cuisinTypes: ['Italian'],
    ingredients: [
      { text: '400 g pasta (espagueti o linguine)' },
      { text: '2 tazas de hojas de albahaca fresca' },
      { text: '50 g piñones' },
      { text: '80 g parmesano rallado' },
      { text: '1 diente de ajo' },
      { text: '100 ml aceite de oliva' },
      { text: 'Sal y pimienta' },
    ],
    directions: [
      { instructionText: 'Tuesta los piñones en una sartén sin aceite hasta que doren.' },
      { instructionText: 'En un procesador, mezcla albahaca, piñones, ajo, parmesano y aceite hasta obtener una pasta.' },
      { instructionText: 'Cuece la pasta en agua con sal según las instrucciones del paquete.' },
      { instructionText: 'Escurre y mezcla con el pesto. Sirve con más parmesano.' },
    ],
  },
  {
    id: '2',
    name: 'Ensalada César con pollo',
    description: 'Ensalada crujiente con aderezo César cremoso y pechuga a la parrilla.',
    totalTime: 30,
    calories: 380,
    cuisinTypes: ['American'],
    ingredients: [
      { text: '1 lechuga romana' },
      { text: '2 pechugas de pollo' },
      { text: '50 g parmesano en láminas' },
      { text: 'Crutones al gusto' },
      { text: 'Anchoas (opcional)' },
      { text: 'Para el aderezo: yogur, mostaza, limón, ajo' },
    ],
    directions: [
      { instructionText: 'Corta la lechuga en trozos y lávala. Seca bien.' },
      { instructionText: 'Sella el pollo en la sartén y cocina hasta que esté dorado y hecho.' },
      { instructionText: 'Mezcla los ingredientes del aderezo hasta que quede homogéneo.' },
      { instructionText: 'Monta la ensalada con lechuga, pollo en tiras, crutones y aderezo.' },
    ],
  },
  {
    id: '3',
    name: 'Curry de garbanzos y espinacas',
    description: 'Curry vegetariano cremoso con garbanzos, espinacas y especias.',
    totalTime: 35,
    calories: 310,
    cuisinTypes: ['Indian'],
    ingredients: [
      { text: '2 latas de garbanzos escurridos' },
      { text: '200 g espinacas frescas' },
      { text: '1 cebolla' },
      { text: '2 tomates' },
      { text: 'Leche de coco 400 ml' },
      { text: 'Curry en polvo, cúrcuma, comino' },
      { text: 'Aceite, sal, jengibre' },
    ],
    directions: [
      { instructionText: 'Sofríe la cebolla y el jengibre en aceite.' },
      { instructionText: 'Añade las especias y los tomates troceados. Cocina 5 min.' },
      { instructionText: 'Agrega los garbanzos y la leche de coco. Deja cocer 15 min.' },
      { instructionText: 'Incorpora las espinacas y cocina 2 min más. Sirve con arroz.' },
    ],
  },
  {
    id: '4',
    name: 'Tacos de pescado estilo Baja',
    description: 'Tacos crujientes de pescado empanizado con col morada y crema.',
    totalTime: 40,
    calories: 450,
    cuisinTypes: ['Mexican'],
    ingredients: [
      { text: '400 g filetes de pescado blanco' },
      { text: 'Harina, cerveza (para rebozar)' },
      { text: 'Repollo morado, limón, cilantro' },
      { text: 'Crema agria o mayonesa con limón' },
      { text: 'Tortillas de maíz' },
      { text: 'Aceite para freír' },
    ],
    directions: [
      { instructionText: 'Corta el pescado en tiras. Pasa por harina y luego por la masa de cerveza.' },
      { instructionText: 'Fríe en aceite caliente hasta que esté dorado y crujiente.' },
      { instructionText: 'Prepara la col con limón y cilantro.' },
      { instructionText: 'Calienta las tortillas y monta los tacos con pescado, col y crema.' },
    ],
  },
  {
    id: '5',
    name: 'Bowl de quinoa y aguacate',
    description: 'Bowl saludable con quinoa, aguacate, huevo y verduras.',
    totalTime: 20,
    calories: 390,
    cuisinTypes: [],
    ingredients: [
      { text: '150 g quinoa cocida' },
      { text: '1 aguacate' },
      { text: '1-2 huevos' },
      { text: 'Verduras al gusto (pepino, tomate, rúcula)' },
      { text: 'Semillas y limón' },
    ],
    directions: [
      { instructionText: 'Cocina la quinoa según las instrucciones del paquete.' },
      { instructionText: 'Escalda o pocha el huevo.' },
      { instructionText: 'Monta el bowl con quinoa, aguacate en rodajas, huevo y verduras.' },
      { instructionText: 'Aliña con limón, sal y semillas.' },
    ],
  },
  {
    id: '6',
    name: 'Sopa de calabaza y jengibre',
    description: 'Sopa cremosa de calabaza con un toque de jengibre.',
    totalTime: 45,
    calories: 180,
    cuisinTypes: [],
    ingredients: [
      { text: '1 calabaza mediana' },
      { text: '1 cebolla' },
      { text: 'Jengibre fresco' },
      { text: 'Caldo vegetal' },
      { text: 'Nata o leche de coco' },
      { text: 'Sal, pimienta, nuez moscada' },
    ],
    directions: [
      { instructionText: 'Asa o cuece la calabaza hasta que esté tierna.' },
      { instructionText: 'Sofríe la cebolla y el jengibre. Añade la calabaza y el caldo.' },
      { instructionText: 'Tritura con la batidora hasta que quede cremosa.' },
      { instructionText: 'Incorpora nata o leche de coco y condimenta. Sirve caliente.' },
    ],
  },
];

export function getRecipeById(id: string): MockRecipe | undefined {
  return mockRecipes.find((r) => r.id === id);
}

export function getLatestRecipes(count = 5): MockRecipe[] {
  return mockRecipes.slice(0, count);
}
