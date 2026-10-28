// src/components/Onboarding.tsx
import { useState } from 'react'
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
    text: 'Минимум двое. Укажи имя, пол и с кем готов контактировать — карточки подберутся под вас.',
  },
  {
    emoji: '🎴',
    title: 'Тяни карту',
    text: 'Правда или действие? Или нажми «Случайно» — приложение решит за тебя.',
  },
]

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
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

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-[#0a0414]">
      <div className="w-full max-w-sm flex flex-col gap-6">
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
            <h2 className="text-2xl font-bold">{slide.title}</h2>
            <p className="text-white/60 text-sm leading-relaxed">{slide.text}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-1.5 justify-center">
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