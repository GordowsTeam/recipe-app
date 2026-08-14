import { setupWorker } from 'msw/browser'
import { homeHandlers } from './handlers/home.handler'

export const worker = setupWorker(...homeHandlers)
