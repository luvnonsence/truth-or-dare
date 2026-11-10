// src/store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Player, GamePhase, GameLevel, Card } from './types'

interface GameState {
  phase: GamePhase
  players: Player[]
  currentPlayerIndex: number
  intimacy: GameLevel
  usedCards: string[]
  recentCards: string[]
  currentCard: Card | null
  setPhase: (phase: GamePhase) => void
  addPlayer: (player: Player) => void
  updatePlayer: (id: string, patch: Partial<Omit<Player, 'id' | 'colorIndex'>>) => void
  removePlayer: (id: string) => void
  shufflePlayers: () => void
  setIntimacy: (level: GameLevel) => void
  nextPlayer: () => void
  markCardUsed: (cardId: string) => void
  setCurrentCard: (card: Card | null) => void
  clearUsedCards: () => void
  resetHistory: () => void
  resetGame: () => void
}

const RECENT_LIMIT = 350

// Some mobile browsers/private modes can deny localStorage. The game should
// still start; persistence simply becomes unavailable in that environment.
const safeStorage = {
  getItem: (name: string): string | null => {
    try { return localStorage.getItem(name) } catch { return null }
  },
  setItem: (name: string, value: string): void => {
    try { localStorage.setItem(name, value) } catch { /* storage unavailable */ }
  },
  removeItem: (name: string): void => {
    try { localStorage.removeItem(name) } catch { /* storage unavailable */ }
  },
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      phase: 'menu',
      players: [],
      currentPlayerIndex: 0,
      intimacy: 1,
      usedCards: [],
      recentCards: [],
      currentCard: null,

      setPhase: (phase) => set({ phase }),
      addPlayer: (player) => set((s) => ({ players: [...s.players, player] })),
      updatePlayer: (id, patch) => set((s) => ({
        players: s.players.map(p => p.id === id ? { ...p, ...patch } : p),
      })),
      removePlayer: (id) => set((s) => {
        const removedIndex = s.players.findIndex((player) => player.id === id)
        if (removedIndex === -1) return s

        const players = s.players.filter((player) => player.id !== id)
        const currentPlayerIndex = players.length === 0
          ? 0
          : removedIndex < s.currentPlayerIndex
            ? s.currentPlayerIndex - 1
            : Math.min(s.currentPlayerIndex, players.length - 1)

        return { players, currentPlayerIndex }
      }),
      shufflePlayers: () => set((s) => ({
        players: [...s.players].sort(() => Math.random() - 0.5),
        currentPlayerIndex: 0,
      })),
      setIntimacy: (intimacy) => set({ intimacy }),
      nextPlayer: () => set((s) => ({
        currentPlayerIndex: (s.currentPlayerIndex + 1) % Math.max(s.players.length, 1),
      })),
      setCurrentCard: (currentCard) => set({ currentCard }),
      markCardUsed: (cardId) => set((s) => ({
        usedCards: s.usedCards.includes(cardId) ? s.usedCards : [...s.usedCards, cardId],
        recentCards: [...s.recentCards.filter(id => id !== cardId), cardId].slice(-RECENT_LIMIT),
      })),
      clearUsedCards: () => set({ usedCards: [] }),
      resetHistory: () => set({ usedCards: [], recentCards: [] }),
      resetGame: () => set({
        phase: 'menu',
        players: [],
        currentPlayerIndex: 0,
        intimacy: 1,
        usedCards: [],
        recentCards: [],
        currentCard: null,
      }),
    }),
    {
      name: 'truth-or-dare-storage',
      storage: createJSONStorage(() => safeStorage),
      version: 6,
      migrate: (persistedState) => {
        const state = persistedState as Partial<GameState>
        const players = Array.isArray(state.players) ? state.players : []
        const savedIndex = Number.isInteger(state.currentPlayerIndex)
          ? state.currentPlayerIndex as number
          : 0

        return {
          ...state,
          players,
          currentPlayerIndex: players.length > 0
            ? Math.min(Math.max(savedIndex, 0), players.length - 1)
            : 0,
          // История использованных карточек несовместима с обновлённым контентом.
          // Состав игроков и настройки при этом сохраняем.
          usedCards: [],
          recentCards: [],
          currentCard: null,
        } as GameState
      },
    }
  )
)