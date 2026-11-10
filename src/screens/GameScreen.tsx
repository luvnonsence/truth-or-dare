import { useState } from 'react'
// src/screens/GameScreen.tsx
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '../store'
import { useConfirm } from '../lib/confirm'
import { cards } from '../data/cards'
import { haptic } from '../lib/haptics'
import { playSound } from '../lib/sound'
import { getAvatarClass } from '../lib/colors'
import { hasCompatibleCardTarget } from '../lib/cardEligibility'
import type { Card, Intimacy, GameLevel } from '../types'

const isCardInLevel = (cardLevel: Intimacy, selectedLevel: GameLevel): boolean => {
  if (selectedLevel === 1) return cardLevel === 1
  if (selectedLevel === 2) return cardLevel <= 2
  if (selectedLevel === 3) return cardLevel >= 2
  return cardLevel === 3
}

export default function GameScreen() {
  const players = useGameStore(s => s.players)
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex)
  const intimacy = useGameStore(s => s.intimacy)
  const nextPlayer = useGameStore(s => s.nextPlayer)
  const setPhase = useGameStore(s => s.setPhase)
  const resetHistory = useGameStore(s => s.resetHistory)
  const usedCards = useGameStore(s => s.usedCards)
  const recentCards = useGameStore(s => s.recentCards)
  const markCardUsed = useGameStore(s => s.markCardUsed)
  const clearUsedCards = useGameStore(s => s.clearUsedCards)
  const currentCard = useGameStore(s => s.currentCard)
  const setCurrentCard = useGameStore(s => s.setCurrentCard)
  const ask = useConfirm(s => s.ask)

  const [drawError, setDrawError] = useState<string | null>(null)

  const currentPlayer = players.length >= 2
    ? players[currentPlayerIndex % players.length]
    : null

  if (!currentPlayer) return null

  const drawCard = (type?: 'truth' | 'dare') => {
    setDrawError(null)
    const chosenType = type ?? (Math.random() < 0.5 ? 'truth' : 'dare')
    const recentSet = new Set(recentCards)

    const baseFilter = (c: Card) =>
      c.type === chosenType &&
      isCardInLevel(c.intimacy, intimacy) &&
      (c.minPlayers == null || players.length >= c.minPlayers) &&
      (!c.targetGender || c.targetGender.includes(currentPlayer.gender)) &&
      !usedCards.includes(c.id) &&
      !recentSet.has(c.id)

    const eligible = cards.filter(
      c => baseFilter(c) && hasCompatibleCardTarget(c, players, currentPlayerIndex)
    )

    let pool = eligible.length > 0
      ? eligible
      : cards.filter(c => baseFilter(c) && !c.requiresPartner)

    if (pool.length === 0) {
      clearUsedCards()
      const refilter = (c: Card) =>
        c.type === chosenType &&
        isCardInLevel(c.intimacy, intimacy) &&
        (c.minPlayers == null || players.length >= c.minPlayers) &&
        (!c.targetGender || c.targetGender.includes(currentPlayer.gender)) &&
        !recentSet.has(c.id)
      pool = cards.filter(c => refilter(c) && hasCompatibleCardTarget(c, players, currentPlayerIndex))

      if (pool.length === 0) {
        pool = cards.filter(c =>
          c.type === chosenType &&
          isCardInLevel(c.intimacy, intimacy) &&
          (c.minPlayers == null || players.length >= c.minPlayers) &&
          (!c.targetGender || c.targetGender.includes(currentPlayer.gender)) &&
          hasCompatibleCardTarget(c, players, currentPlayerIndex)
        )
      }
      if (pool.length === 0) {
        setDrawError('Не удалось подобрать задание для этого игрока с текущими настройками. Попробуй другой тип задания или измени состав игроков и уровень игры.')
        return
      }
    }

    const card = pool[Math.floor(Math.random() * pool.length)]
    haptic(15)
    playSound('flip')
    setCurrentCard(card)
    markCardUsed(card.id)
  }

  const handleDone = () => {
    haptic(10)
    playSound('success')
    setCurrentCard(null)
    nextPlayer()
  }

  const handleExit = () => {
    ask({
      title: 'Выйти из игры?',
      message: 'Текущая партия сбросится. Игроки останутся.',
      confirmLabel: 'Выйти',
      cancelLabel: 'Остаться',
      variant: 'danger',
      onConfirm: () => {
        haptic(10)
        resetHistory()
        setCurrentCard(null)
        setPhase('menu')
      },
    })
  }

  const cardKey = `${currentPlayer.id}-${currentCard?.id ?? 'choice'}`

  return (
    <div className="flex flex-col gap-4 pt-[max(1rem,env(safe-area-inset-top))] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex-1">
      {/* верхняя панель */}
      <div className="flex items-center justify-between px-1 gap-2">
        <button
          onClick={handleExit}
          className="focus-ring tap-target inline-flex items-center text-white/60 hover:text-white text-sm transition shrink-0"
        >
          ← Выход
        </button>
        <div className="flex gap-1.5">
          {players.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentPlayerIndex % players.length
                  ? 'w-7 bg-white/80'
                  : 'w-1.5 bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cardKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col gap-4 flex-1 will-change-transform"
        >
          {/* баннер игрока */}
          <div className="liquid-glass px-4 py-3 flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full ${getAvatarClass(currentPlayer.colorIndex)} flex items-center justify-center font-bold text-lg shrink-0`}>
              {(currentPlayer.name[0] ?? '?').toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs text-white/50">Ход</div>
              <div className="font-bold truncate text-lg">{currentPlayer.name}</div>
            </div>
          </div>

          {/* карта или выбор */}
          <div className="flex-1 flex flex-col justify-center">
            {currentCard ? (
              <motion.div
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="liquid-glass p-6 sm:p-8 text-center flex flex-col gap-6 relative overflow-hidden min-h-[min(58vh,460px)] justify-center will-change-transform"
              >
                <div
                  className={`absolute inset-0 pointer-events-none ${
                    currentCard.type === 'truth'
                      ? 'bg-gradient-to-br from-fuchsia-500/20 to-transparent'
                      : 'bg-gradient-to-br from-rose-500/20 to-transparent'
                  }`}
                />
                <div className="relative flex flex-col gap-6">
                  <div
                    className={`text-xs uppercase tracking-[0.2em] font-semibold ${
                      currentCard.type === 'truth' ? 'text-fuchsia-300' : 'text-rose-300'
                    }`}
                  >
                    {currentCard.type === 'truth' ? '💭 Правда' : '🔥 Действие'}
                  </div>
                  <div className="text-[clamp(1.2rem,4.8vw,1.65rem)] leading-relaxed font-semibold tracking-[-0.02em] text-balance">
                    {currentCard.text}
                  </div>
                  <p className="text-xs leading-relaxed text-white/45">
                    Только по взаимному согласию. Любой участник может отказаться от действия.
                  </p>
                  <motion.button
                    onClick={handleDone}
                    className="liquid-glass focus-ring tap-target px-6 py-4 font-semibold surface-hover"
                    whileTap={{ scale: 0.97 }}
                  >
                    Выполнено →
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-3">
                {drawError && (
                  <div
                    className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm leading-relaxed text-amber-100/90"
                    role="status"
                    aria-live="polite"
                  >
                    {drawError}
                  </div>
                )}
                <motion.button
                  onClick={() => drawCard('truth')}
                  className="relative liquid-glass focus-ring tap-target overflow-hidden p-6 text-left surface-hover"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/30 via-purple-500/10 to-transparent pointer-events-none" />
                  <div className="relative flex items-center gap-4">
                    <span className="text-3xl">💭</span>
                    <div>
                      <div className="text-xl font-bold">Правда</div>
                      <div className="text-xs text-white/50">Честный ответ</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => drawCard('dare')}
                  className="relative liquid-glass focus-ring tap-target overflow-hidden p-6 text-left surface-hover"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 via-orange-500/10 to-transparent pointer-events-none" />
                  <div className="relative flex items-center gap-4">
                    <span className="text-3xl">🔥</span>
                    <div>
                      <div className="text-xl font-bold">Действие</div>
                      <div className="text-xs text-white/50">Не тормози</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => drawCard()}
                  className="focus-ring tap-target border border-white/15 px-6 py-4 rounded-2xl text-center font-medium text-white/75 hover:text-white hover:bg-white/5 surface-hover"
                  whileTap={{ scale: 0.97 }}
                >
                  🎲 Случайно
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}