import { http, HttpResponse } from 'msw'
import type { HomeData } from 'src/types/home.types'

// Fuente de verdad de los datos simulados del home.
// MainLayout.vue reutiliza `mockHomeData.user` como placeholder del usuario
// hasta que exista sesión/casa real (ver docs/Numa_Features_Context.md).
export const mockHomeData: HomeData = {
  user: { name: 'Alberto', initial: 'S', plan: 'free' },
  date: 'Martes 8 de enero',
  alerts: [
    {
      id: '1',
      type: 'warning',
      title: 'La jícama lleva 14 días',
      subtitle: 'Revísala antes de planear la cena',
    },
    {
      id: '2',
      type: 'info',
      title: 'Pollo descongelando · 62%',
      subtitle: 'Listo aprox. 2:00 pm',
      progress: 62,
    },
  ],
  meals: [
    { id: 'breakfast', type: 'breakfast', status: 'empty' },
    {
      id: 'lunch',
      type: 'lunch',
      status: 'planned',
      recipe: {
        name: 'Enchiladas poblanas',
        readyAt: '2:00 pm',
        readyLabel: 'Lista a las 2pm',
      },
      members: [
        { initial: 'S', name: 'Sofía', steps: 2, color: 'info' },
        { initial: 'A', name: 'Adrián', steps: 1, color: 'warning' },
      ],
    },
    {
      id: 'dinner',
      type: 'dinner',
      status: 'rescue',
      rescueMessage: 'La jícama podría usarse hoy',
    },
  ],
  houseMembers: [
    {
      id: '1',
      name: 'Sofía',
      initial: 'S',
      role: 'owner',
      isCurrentUser: true,
      task: 'Cocinar pollo · 8am',
      taskStatus: 'active',
      color: 'info',
    },
    {
      id: '2',
      name: 'Adrián',
      initial: 'A',
      role: 'member',
      isCurrentUser: false,
      task: 'Tatemar chiles · 8am',
      taskStatus: 'pending',
      color: 'warning',
    },
  ],
}

export const homeHandlers = [http.get('/api/home', () => HttpResponse.json(mockHomeData))]
