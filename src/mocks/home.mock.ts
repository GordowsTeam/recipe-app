export type MemberColor = 'info' | 'warning' | 'success'

export interface MockUser {
  name: string
  initial: string
  plan: 'free' | 'pro' | 'family'
}

export interface MockAlert {
  id: string
  type: 'warning' | 'info'
  title: string
  subtitle: string
  progress?: number
}

export interface MockMealMember {
  initial: string
  name: string
  steps: number
  color: MemberColor
}

export interface MockMeal {
  id: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
  status: 'empty' | 'planned' | 'rescue'
  recipe?: {
    name: string
    readyAt?: string
    readyLabel?: string
  }
  members?: MockMealMember[]
  rescueMessage?: string
}

export interface MockHouseMember {
  id: string
  name: string
  initial: string
  role: 'owner' | 'member' | 'guest'
  isCurrentUser: boolean
  task?: string
  taskStatus?: 'active' | 'pending' | 'done'
  color: MemberColor
}

export const mockUser: MockUser = {
  name: 'Sofía',
  initial: 'S',
  plan: 'free',
}

export const mockAlerts: MockAlert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'La jícama lleva 10 días',
    subtitle: 'Revísala antes de planear la cena',
  },
  {
    id: '2',
    type: 'info',
    title: 'Pollo descongelando · 62%',
    subtitle: 'Listo aprox. 2:00 pm',
    progress: 62,
  },
]

export const mockMeals: MockMeal[] = [
  {
    id: 'breakfast',
    type: 'breakfast',
    status: 'empty',
  },
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
]

export const mockHouseMembers: MockHouseMember[] = [
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
]
