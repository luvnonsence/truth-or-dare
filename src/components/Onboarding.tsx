// src/components/Onboarding.tsx
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { haptic } from '../lib/haptics'
import { markOnboardingDone } from '../lib/onboarding'

const SLIDES = [
  {
    emoji: '🎚️',
    title: 'Выбери уровень',
    text: 'От лёгких вопросов до жарких заданий. Можешь менять в любой момент.',
  },
  {
    emoji: '👥',
    title: 'Добавь игроков',
    text: 'Минимум двое. Укажи имя, пол и с кем готов взаимодействовать — карточки подберутся под вас.',
  },
  {
    emoji: '🎴',
    title: 'Тяни карту',
    text: 'Правда или действие? Или нажми «Случайно» — приложение решит за тебя.',
  },
]

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const isLast = step === SLIDES.length - 1

  const finish = () => {
    markOnboardingDone()
    onDone()
  }

  const next = () => {
    haptic(8)
    if (isLast) finish()
    else setStep(s => s + 1)
  }

  const slide = SLIDES[step]

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const firstButton = dialogRef.current?.querySelector<HTMLElement>('button')
    firstButton?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-[#0a0414]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-description"
    >
      <div ref={dialogRef} className="w-full max-w-sm flex flex-col gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="liquid-glass p-8 text-center flex flex-col gap-4"
          >
            <span className="text-6xl">{slide.emoji}</span>
            <h2 id="onboarding-title" className="text-2xl font-bold" aria-live="polite">{slide.title}</h2>
            <p id="onboarding-description" className="text-white/60 text-sm leading-relaxed">{slide.text}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-1.5 justify-center" aria-label={`Шаг ${step + 1} из ${SLIDES.length}`}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>

        <motion.button
          onClick={next}
          className="liquid-glass px-6 py-4 text-lg font-bold hover:scale-[1.01] active:scale-95 transition"
          whileTap={{ scale: 0.97 }}
        >
          {isLast ? 'Поехали!' : 'Далее →'}
        </motion.button>

        {!isLast && (
          <button
            onClick={() => { haptic(5); finish() }}
            className="text-white/40 hover:text-white/60 text-sm transition -mt-2"
          >
            Пропустить
          </button>
        )}
      </div>
    </div>
  )
}