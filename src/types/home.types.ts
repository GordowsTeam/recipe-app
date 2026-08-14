export type MealStatus = 'empty' | 'planned' | 'rescue'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
export type AlertType = 'warning' | 'info'
export type MemberColor = 'info' | 'warning' | 'success'

export interface MealMember {
  initial: string
  name: string
  steps: number
  color: MemberColor
}

export interface MealSlot {
  id: string
  type: MealType
  status: MealStatus
  recipe?: {
    name: string
    readyAt?: string
    readyLabel?: string
  }
  members?: MealMember[]
  rescueMessage?: string
}

export interface AlertItem {
  id: string
  type: AlertType
  title: string
  subtitle: string
  progress?: number // 0–100, solo para info (descongelado)
}

export interface HouseMember {
  id: string
  name: string
  initial: string
  role: 'owner' | 'member' | 'guest'
  isCurrentUser: boolean
  task?: string
  taskStatus?: 'active' | 'pending' | 'done'
  color: MemberColor
}

export interface HomeUser {
  name: string
  initial: string
  plan: 'free' | 'pro' | 'family'
}

export interface HomeData {
  user: HomeUser
  date: string
  alerts: AlertItem[]
  meals: MealSlot[]
  houseMembers: HouseMember[]
}
