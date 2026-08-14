import type { HomeData } from 'src/types/home.types'

export async function fetchHomeData(): Promise<HomeData> {
  const response = await fetch('/api/home')
  if (!response.ok) throw new Error('Error cargando home')
  return response.json() as Promise<HomeData>
}
