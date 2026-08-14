import { useQuery } from '@tanstack/vue-query'
import { fetchHomeData } from 'src/services/home.service'

export function useHomeData() {
  return useQuery({
    queryKey: ['home'],
    queryFn: fetchHomeData,
    staleTime: 1000 * 60 * 2, // 2 minutos
  })
}
