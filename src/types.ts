// src/types.ts
export type Gender = 'male' | 'female'

export type Intimacy = 1 | 2 | 3
export type GameLevel = 1 | 2 | 3 | 4

export interface Player {
  id: string
  name: string
  gender: Gender
  willingWith: Gender[]
  colorIndex: number
}

export interface Card {
  id: string
  text: string
  type: 'truth' | 'dare'
  intimacy: Intimacy
  minPlayers?: number
  targetGender?: Gender[]
  requiresPartner?: boolean
}

export type GamePhase = 'menu' | 'setup' | 'playing' | 'result'