export interface RecipeImage {
    url: string
    main: boolean
  }
  
  export interface RecipeIngredient {
    text: string
    quantity: number
    measure: string
    weight: number
    food: string
    foodCategory: number
    foodCategoryId: string
    image: string
  }
  
  export interface RecipeDirection {
    step: string
    image: string
    instructionText: string
  }
  
  export interface Recipe {
    name: string
    images: RecipeImage[]
    ingredients: RecipeIngredient[]
    missingIngredients: string[]
    calories: number
    totalTime: number
    cuisinTypes: string[]
    mealTypes: string[]
    directions: RecipeDirection[]
  }