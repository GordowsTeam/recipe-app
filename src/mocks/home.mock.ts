interface AlertItem {
  id: string
  type: 'warning' | 'info'
  title: string
  subtitle: string
  progress?: number
}

interface MealMember {
  initial: string
  name: string
  steps: number
  color: 'info' | 'warning' | 'success'
}

interface MealItem {
  id: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
  status: 'empty' | 'planned' | 'rescue'
  recipe?: { name: string; readyAt?: string; readyLabel?: string }
  members?: MealMember[]
  rescueMessage?: string
}

interface HouseMemberItem {
  id: string
  name: string
  initial: string
  role: 'owner' | 'member' | 'guest'
  isCurrentUser: boolean
  task: string
  taskStatus: string
  color: string
}

export const mockUser = {
  name: 'Sofía',
  initial: 'S',
  plan: 'free'
}

export const mockAlerts: AlertItem[] = [
  {
    id: '1',
    type: 'warning',
    title: 'La jícama lleva 10 días',
    subtitle: 'Revísala antes de planear la cena'
  },
  {
    id: '2',
    type: 'info',
    title: 'Pollo descongelando · 62%',
    subtitle: 'Listo aprox. 2:00 pm',
    progress: 62
  }
]

export const mockMeals: MealItem[] = [
  {
    id: 'breakfast',
    type: 'breakfast',
    status: 'empty'
  },
  {
    id: 'lunch',
    type: 'lunch',
    status: 'planned',
    recipe: {
      name: 'Enchiladas poblanas',
      readyAt: '2:00 pm',
      readyLabel: 'Lista a las 2pm'
    },
    members: [
      { initial: 'S', name: 'Sofía', steps: 2, color: 'info' },
      { initial: 'A', name: 'Adrián', steps: 1, color: 'warning' }
    ]
  },
  {
    id: 'dinner',
    type: 'dinner',
    status: 'rescue',
    rescueMessage: 'La jícama podría usarse hoy'
  }
]

export const mockHouseMembers: HouseMemberItem[] = [
  {
    id: '1',
    name: 'Sofía',
    initial: 'S',
    role: 'owner',
    isCurrentUser: true,
    task: 'Cocinar pollo · 8am',
    taskStatus: 'active',
    color: 'info'
  },
  {
    id: '2',
    name: 'Adrián',
    initial: 'A',
    role: 'member',
    isCurrentUser: false,
    task: 'Tatemar chiles · 8am',
    taskStatus: 'pending',
    color: 'warning'
  }
]
