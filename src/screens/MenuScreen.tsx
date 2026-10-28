// src/screens/MenuScreen.tsx
import { motion } from 'motion/react'
import { useGameStore } from '../store'
import { haptic } from '../lib/haptics'
import { playSound } from '../lib/sound'

const SOCIALS = [
  {
    label: 'Telegram',
    href: 'https://t.me/luvnonsence',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    label: 'Поддержать',
    href: 'https://www.donationalerts.com/r/luvnonsence',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
] as const

export default function MenuScreen() {
  const setPhase = useGameStore(s => s.setPhase)

  return (
    <div className="flex flex-col gap-6 pt-4">
      {/* верхняя мета-строка */}
      <motion.div
        className="flex justify-between items-center px-1 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="liquid-glass px-3 py-1 text-white/70 font-medium">18+</span>
        <span className="text-white/30">v1.0</span>
      </motion.div>

      {/* заголовок */}
      <motion.div
        className="text-center flex flex-col gap-3 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-white/40 text-xs tracking-[0.3em] uppercase">
          Вечеринка
        </div>
        <h1 className="text-5xl font-black leading-[0.95] tracking-tight">
          Правда
          <br />
          <span className="bg-gradient-to-r from-fuchsia-300 via-pink-300 to-rose-300 bg-clip-text text-transparent">
            или Действие
          </span>
        </h1>
        <p className="text-white/50 text-sm max-w-[260px] mx-auto">
          Один телефон. Много откровений.
        </p>
      </motion.div>

      {/* две карточки-превью */}
      <motion.div
        className="grid grid-cols-2 gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="liquid-glass p-4 text-center flex flex-col gap-1">
          <span className="text-2xl mb-1">💭</span>
          <span className="text-sm font-semibold">Правда</span>
          <span className="text-xs text-white/40">Отвечай честно</span>
        </div>
        <div className="liquid-glass p-4 text-center flex flex-col gap-1">
          <span className="text-2xl mb-1">🔥</span>
          <span className="text-sm font-semibold">Действие</span>
          <span className="text-xs text-white/40">Не тормози</span>
        </div>
      </motion.div>

      {/* главный CTA */}
      <motion.button
        onClick={() => {
          haptic(12)
          playSound('success')
          setPhase('setup')
        }}
        className="liquid-glass px-6 py-5 text-xl font-bold hover:scale-[1.02] active:scale-95 transition shadow-[0_0_60px_-12px_rgba(217,70,239,0.7)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileTap={{ scale: 0.97 }}
      >
        Играть →
      </motion.button>

      {/* соц-кнопки */}
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.5 }}
      >
        {SOCIALS.map(s => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound('click')}
            className="flex-1 liquid-glass px-4 py-3 text-sm font-medium hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2"
          >
            {s.icon}
            {s.label}
          </a>
        ))}
      </motion.div>

      <motion.p
        className="text-center text-white/30 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        Минимум 2 игрока · Без регистрации
      </motion.p>
    </div>
  )
}