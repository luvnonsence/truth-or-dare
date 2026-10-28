// src/screens/SetupScreen.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '../store'
import { haptic } from '../lib/haptics'
import { playSound } from '../lib/sound'
import { uid } from '../lib/uid'
import { getAvatarGradient } from '../lib/colors'
import { randomAnimalName } from '../lib/animalNames'
import { useConfirm } from '../lib/confirm'
import type { Gender, GameLevel, Player } from '../types'

const GENDERS: { value: Gender; label: string; emoji: string; gradient: string }[] = [
  { value: 'male', label: 'Парень', emoji: '♂', gradient: 'from-sky-400 to-blue-500' },
  { value: 'female', label: 'Девушка', emoji: '♀', gradient: 'from-pink-400 to-rose-500' },
]

type WillingnessKey = 'male' | 'female' | 'all'

const WILLING_OPTIONS: { value: WillingnessKey; label: string; gradient: string }[] = [
  { value: 'male', label: 'Парень', gradient: 'from-sky-400 to-blue-500' },
  { value: 'female', label: 'Девушка', gradient: 'from-pink-400 to-rose-500' },
  { value: 'all', label: 'Все', gradient: 'from-purple-400 to-fuchsia-500' },
]

const LEVELS: {
  value: GameLevel
  label: string
  emoji: string
  accent: string
  desc: string
}[] = [
  {
    value: 1,
    label: 'Посиделки',
    emoji: '🍻',
    accent: 'from-emerald-400/30',
    desc: 'Смешные истории и безобидные задания. Без пошлости и неловкости — для любой компании.',
  },
  {
    value: 2,
    label: 'Откровенно',
    emoji: '🔥',
    accent: 'from-amber-400/30',
    desc: 'Личные вопросы и смелые задания на грани. Уже интересно, но без жёсткого 18+.',
  },
  {
    value: 3,
    label: 'Партнёры',
    emoji: '💋',
    accent: 'from-rose-500/30',
    desc: 'Откровенные темы для близких людей. 18+, интимные вопросы и задания.',
  },
  {
    value: 4,
    label: 'Ещё горячее',
    emoji: '🌶️',
    accent: 'from-fuchsia-500/30',
    desc: 'Максимально жаркий контент. Только hard-карты 18+, без разбавления.',
  },
]

const MAX_PLAYERS = 8

const willingToArray = (k: WillingnessKey): Gender[] =>
  k === 'all' ? ['male', 'female'] : [k]

const arrayToWillingness = (w: Gender[]): WillingnessKey =>
  w.length === 2 ? 'all' : w[0]

const willingLabel = (p: Player): string => {
  if (p.willingWith.length === 2) return 'со всеми'
  if (p.willingWith[0] === 'male') return 'с парнем'
  if (p.willingWith[0] === 'female') return 'с девушкой'
  return 'ни с кем'
}

export default function SetupScreen() {
  const players = useGameStore(s => s.players)
  const addPlayer = useGameStore(s => s.addPlayer)
  const updatePlayer = useGameStore(s => s.updatePlayer)
  const removePlayer = useGameStore(s => s.removePlayer)
  const shufflePlayers = useGameStore(s => s.shufflePlayers)
  const intimacy = useGameStore(s => s.intimacy)
  const setIntimacy = useGameStore(s => s.setIntimacy)
  const setPhase = useGameStore(s => s.setPhase)
  const ask = useConfirm(s => s.ask)

  const [name, setName] = useState('')
  const [gender, setGender] = useState<Gender>('male')
  const [willingness, setWillingness] = useState<WillingnessKey>('all')
  const [editingId, setEditingId] = useState<string | null>(null)

  const isEditing = editingId !== null
  const isFull = players.length >= MAX_PLAYERS
  const currentLevel = LEVELS.find(l => l.value === intimacy)!

  const resetForm = () => {
    setName('')
    setGender('male')
    setWillingness('all')
    setEditingId(null)
  }

  const handleSave = () => {
    if (isEditing) {
      updatePlayer(editingId!, {
        name: name.trim() || randomAnimalName(players.filter(p => p.id !== editingId).map(p => p.name)),
        gender,
        willingWith: willingToArray(willingness),
      })
      haptic(12)
      playSound('success')
      resetForm()
      return
    }

    if (isFull) return

    const finalName = name.trim() || randomAnimalName(players.map(p => p.name))
    haptic(12)
    playSound('click')
    addPlayer({
      id: uid(),
      name: finalName,
      gender,
      willingWith: willingToArray(willingness),
      colorIndex: players.length,
    })
    resetForm()
  }

  const startEdit = (p: Player) => {
    haptic(8)
    setEditingId(p.id)
    setName(p.name)
    setGender(p.gender)
    setWillingness(arrayToWillingness(p.willingWith))
  }

  const handleRemove = (p: Player) => {
    haptic(8)
    removePlayer(p.id)
    if (editingId === p.id) resetForm()
  }

  const handleRandomFirst = () => {
    if (players.length < 2) return
    haptic(12)
    playSound('click')
    shufflePlayers()
    const first = useGameStore.getState().players[0]
    ask({
      title: 'Кто первый?',
      message: `Первым ходит ${first.name}!`,
      confirmLabel: 'Погнали',
      hideCancel: true,
      onConfirm: () => {},
    })
  }

  const canStart = players.length >= 2
  const missing = 2 - players.length

  return (
    <div className="flex flex-col gap-5 pt-2 pb-8">
      {/* верхняя панель */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => { haptic(8); setPhase('menu') }}
          className="text-white/50 hover:text-white text-sm transition"
        >
          ← Назад
        </button>
        <div className="text-white/40 text-xs tracking-widest uppercase">Игроки</div>
        <div className={`text-sm font-mono ${isFull ? 'text-rose-400' : 'text-white/50'}`}>
          {players.length}/{MAX_PLAYERS}
        </div>
      </div>

      {/* заголовок */}
      <motion.div
        className="text-center flex flex-col gap-1 py-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold">Кто играет?</h1>
        <p className="text-white/50 text-sm">Добавь минимум двоих</p>
      </motion.div>

      {/* форма добавления / редактирования */}
      <motion.div
        className="liquid-glass p-4 flex flex-col gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {isEditing && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-300">✏️ Редактирование</span>
            <button
              onClick={() => { haptic(5); resetForm() }}
              className="text-white/40 hover:text-white transition"
            >
              Отмена
            </button>
          </div>
        )}

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          placeholder="Имя (можно оставить пустым — дадим зверушку)"
          maxLength={20}
          disabled={isFull && !isEditing}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/30 transition disabled:opacity-40"
        />

        <div>
          <div className="text-xs text-white/40 mb-2 px-1">Пол</div>
          <div className="grid grid-cols-2 gap-2">
            {GENDERS.map(g => (
              <button
                key={g.value}
                onClick={() => { haptic(5); setGender(g.value) }}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  gender === g.value
                    ? `bg-gradient-to-br ${g.gradient} text-white shadow-lg`
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <span className="mr-1 opacity-80">{g.emoji}</span>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-white/40 mb-2 px-1">Готов(а) контактировать с</div>
          <div className="grid grid-cols-3 gap-2">
            {WILLING_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { haptic(5); setWillingness(opt.value) }}
                className={`rounded-xl px-2 py-2.5 text-sm font-medium transition ${
                  willingness === opt.value
                    ? `bg-gradient-to-br ${opt.gradient} text-white shadow-lg`
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          disabled={isFull && !isEditing}
          className={`mt-1 font-semibold rounded-xl px-4 py-3 transition disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] ${
            isEditing
              ? 'bg-amber-400 text-black hover:bg-amber-300'
              : 'bg-white/90 text-black hover:bg-white'
          }`}
          whileTap={(!isFull || isEditing) ? { scale: 0.97 } : undefined}
        >
          {isEditing
            ? '💾 Сохранить'
            : isFull
            ? `Максимум ${MAX_PLAYERS} игроков`
            : '+ Добавить'}
        </motion.button>
      </motion.div>

      {/* список игроков */}
      <AnimatePresence>
        {players.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2"
          >
            {players.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                onClick={() => startEdit(p)}
                className={`liquid-glass px-3 py-2.5 flex items-center gap-3 cursor-pointer transition ${
                  editingId === p.id ? 'ring-2 ring-amber-400/60' : 'hover:bg-white/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(p.colorIndex)} flex items-center justify-center font-bold shrink-0`}>
                  {(p.name[0] ?? '?').toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{p.name}</div>
                  <div className="text-xs text-white/40 truncate">
                    {GENDERS.find(x => x.value === p.gender)?.label}
                    {' · '}
                    {willingLabel(p)}
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleRemove(p) }}
                  className="text-white/30 hover:text-rose-400 px-2 text-xl transition shrink-0"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* рандомайзер */}
      {players.length >= 2 && (
        <motion.button
          onClick={handleRandomFirst}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="liquid-glass px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 active:scale-95 transition"
        >
          🎲 Кто первый?
        </motion.button>
      )}

      {/* уровень */}
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-xs text-white/40 px-1 uppercase tracking-widest">Уровень</div>
        <div className="grid grid-cols-2 gap-2">
          {LEVELS.map(l => (
            <button
              key={l.value}
              onClick={() => { haptic(8); playSound('click'); setIntimacy(l.value) }}
              className={`relative overflow-hidden rounded-2xl p-3 text-center transition border ${
                intimacy === l.value
                  ? 'bg-white/15 border-white/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {intimacy === l.value && (
                <div className={`absolute inset-0 bg-gradient-to-br ${l.accent} to-transparent pointer-events-none`} />
              )}
              <div className="relative flex flex-col gap-0.5">
                <span className="text-2xl">{l.emoji}</span>
                <div className="font-semibold text-sm">{l.label}</div>
              </div>
            </button>
          ))}
        </div>

        {/* описание выбранного уровня */}
        <AnimatePresence mode="wait">
          <motion.div
            key={intimacy}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-white/50 leading-relaxed px-2 py-2 border-l-2 border-white/20"
          >
            {currentLevel.desc}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* CTA */}
      <motion.button
        onClick={() => { if (canStart) { haptic(15); playSound('success'); setPhase('playing') } }}
        disabled={!canStart}
        className="liquid-glass px-6 py-5 text-lg font-bold hover:scale-[1.02] active:scale-95 transition shadow-[0_0_60px_-12px_rgba(217,70,239,0.5)] disabled:opacity-40 disabled:shadow-none"
        whileTap={canStart ? { scale: 0.97 } : undefined}
      >
        {canStart
          ? 'Начать игру →'
          : missing === 1
          ? 'Нужен ещё 1 игрок'
          : `Нужно ещё ${missing} игрока`}
      </motion.button>
    </div>
  )
}