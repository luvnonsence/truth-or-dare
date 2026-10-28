// src/components/Background.tsx
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '../store'
import type { GameLevel } from '../types'

type ThemeKey = 'neutral' | GameLevel

interface Palette {
  base: string
  b1: string
  b2: string
  b3: string
  b4: string
}

const PALETTES: Record<ThemeKey, Palette> = {
  neutral: {
    base: 'radial-gradient(ellipse at 50% -20%, #3b1d5c 0%, #1a0f3d 55%, #0a0414 100%)',
    b1: 'radial-gradient(circle, rgba(168,85,247,0.7) 0%, rgba(168,85,247,0.3) 35%, rgba(168,85,247,0) 70%)',
    b2: 'radial-gradient(circle, rgba(244,63,94,0.65) 0%, rgba(244,63,94,0.25) 35%, rgba(244,63,94,0) 70%)',
    b3: 'radial-gradient(circle, rgba(99,102,241,0.55) 0%, rgba(99,102,241,0.2) 40%, rgba(99,102,241,0) 70%)',
    b4: 'radial-gradient(circle, rgba(251,113,133,0.5) 0%, rgba(251,113,133,0) 70%)',
  },
  1: {
    base: 'radial-gradient(ellipse at 50% -20%, #064e3b 0%, #022c22 55%, #01120b 100%)',
    b1: 'radial-gradient(circle, rgba(16,185,129,0.7) 0%, rgba(16,185,129,0.3) 35%, rgba(16,185,129,0) 70%)',
    b2: 'radial-gradient(circle, rgba(20,184,166,0.65) 0%, rgba(20,184,166,0.25) 35%, rgba(20,184,166,0) 70%)',
    b3: 'radial-gradient(circle, rgba(34,197,94,0.55) 0%, rgba(34,197,94,0.2) 40%, rgba(34,197,94,0) 70%)',
    b4: 'radial-gradient(circle, rgba(74,222,128,0.5) 0%, rgba(74,222,128,0) 70%)',
  },
  2: {
    base: 'radial-gradient(ellipse at 50% -20%, #451a03 0%, #2c1002 55%, #100501 100%)',
    b1: 'radial-gradient(circle, rgba(245,158,11,0.7) 0%, rgba(245,158,11,0.3) 35%, rgba(245,158,11,0) 70%)',
    b2: 'radial-gradient(circle, rgba(251,146,60,0.65) 0%, rgba(251,146,60,0.25) 35%, rgba(251,146,60,0) 70%)',
    b3: 'radial-gradient(circle, rgba(234,88,12,0.55) 0%, rgba(234,88,12,0.2) 40%, rgba(234,88,12,0) 70%)',
    b4: 'radial-gradient(circle, rgba(250,204,21,0.5) 0%, rgba(250,204,21,0) 70%)',
  },
  3: {
    base: 'radial-gradient(ellipse at 50% -20%, #4c0519 0%, #2d0310 55%, #100108 100%)',
    b1: 'radial-gradient(circle, rgba(244,63,94,0.7) 0%, rgba(244,63,94,0.3) 35%, rgba(244,63,94,0) 70%)',
    b2: 'radial-gradient(circle, rgba(236,72,153,0.65) 0%, rgba(236,72,153,0.25) 35%, rgba(236,72,153,0) 70%)',
    b3: 'radial-gradient(circle, rgba(239,68,68,0.55) 0%, rgba(239,68,68,0.2) 40%, rgba(239,68,68,0) 70%)',
    b4: 'radial-gradient(circle, rgba(251,113,133,0.5) 0%, rgba(251,113,133,0) 70%)',
  },
  4: {
    base: 'radial-gradient(ellipse at 50% -20%, #4a044e 0%, #2e0433 55%, #100117 100%)',
    b1: 'radial-gradient(circle, rgba(217,70,239,0.75) 0%, rgba(217,70,239,0.3) 35%, rgba(217,70,239,0) 70%)',
    b2: 'radial-gradient(circle, rgba(168,85,247,0.7) 0%, rgba(168,85,247,0.28) 35%, rgba(168,85,247,0) 70%)',
    b3: 'radial-gradient(circle, rgba(147,51,234,0.6) 0%, rgba(147,51,234,0.22) 40%, rgba(147,51,234,0) 70%)',
    b4: 'radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(139,92,246,0) 70%)',
  },
}

export default function Background() {
  const phase = useGameStore(s => s.phase)
  const intimacy = useGameStore(s => s.intimacy)
  const themeKey: ThemeKey = phase === 'menu' ? 'neutral' : intimacy
  const p = PALETTES[themeKey]

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <AnimatePresence>
        <motion.div
          key={themeKey}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0" style={{ background: p.base }} />

          <motion.div
            className="absolute -top-[30%] -left-[30%] w-[100vw] h-[100vw] max-w-[900px] max-h-[900px] rounded-full"
            style={{ background: p.b1 }}
            animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-[30%] -right-[30%] w-[100vw] h-[100vw] max-w-[900px] max-h-[900px] rounded-full"
            style={{ background: p.b2 }}
            animate={{ scale: [1.1, 1, 1.1], x: [0, -40, 0], y: [0, 30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div
            className="absolute top-1/3 left-1/4 w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] rounded-full"
            style={{ background: p.b3 }}
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />
          <motion.div
            className="absolute top-[55%] -left-[15%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full"
            style={{ background: p.b4 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}