// src/store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Player, GamePhase, GameLevel } from './types'

interface GameState {
  phase: GamePhase
  players: Player[]
  currentPlayerIndex: number
  intimacy: GameLevel
  usedCards: string[]
  setPhase: (phase: GamePhase) => void
  addPlayer: (player: Player) => void
  updatePlayer: (id: string, patch: Partial<Omit<Player, 'id' | 'colorIndex'>>) => void
  removePlayer: (id: string) => void
  shufflePlayers: () => void
  setIntimacy: (level: GameLevel) => void
  nextPlayer: () => void
  markCardUsed: (cardId: string) => void
  clearUsedCards: () => void
  resetGame: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      phase: 'menu',
      players: [],
      currentPlayerIndex: 0,
      intimacy: 1,
      usedCards: [],

      setPhase: (phase) => set({ phase }),
      addPlayer: (player) => set((s) => ({ players: [...s.players, player] })),
      updatePlayer: (id, patch) => set((s) => ({
        players: s.players.map(p => p.id === id ? { ...p, ...patch } : p),
      })),
      removePlayer: (id) => set((s) => ({ players: s.players.filter(p => p.id !== id) })),
      shufflePlayers: () => set((s) => ({
        players: [...s.players].sort(() => Math.random() - 0.5),
        currentPlayerIndex: 0,
      })),
      setIntimacy: (intimacy) => set({ intimacy }),
      nextPlayer: () => set((s) => ({
        currentPlayerIndex: (s.currentPlayerIndex + 1) % Math.max(s.players.length, 1),
      })),
      markCardUsed: (cardId) => set((s) => ({
        usedCards: s.usedCards.includes(cardId) ? s.usedCards : [...s.usedCards, cardId],
      })),
      clearUsedCards: () => set({ usedCards: [] }),
      resetGame: () => set({
        phase: 'menu',
        players: [],
        currentPlayerIndex: 0,
        intimacy: 1,
        usedCards: [],
      }),
    }),
    {
      name: 'truth-or-dare-storage',
      storage: createJSONStorage(() => localStorage),
      version: 2,
    }
  )
)