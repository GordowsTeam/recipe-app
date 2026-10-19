import { setupWorker } from 'msw/browser'
import { homeHandlers } from './handlers/home.handler'
import { recipeHandlers } from './handlers/recipe.handler'

export const worker = setupWorker(...homeHandlers, ...recipeHandlers)
