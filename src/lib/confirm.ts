// src/lib/confirm.ts
import { create } from 'zustand'

export interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  hideCancel?: boolean
  onConfirm: () => void
}

interface ConfirmState {
  options: ConfirmOptions | null
  ask: (options: ConfirmOptions) => void
  close: () => void
}

export const useConfirm = create<ConfirmState>((set) => ({
  options: null,
  ask: (options) => set({ options }),
  close: () => set({ options: null }),
}))