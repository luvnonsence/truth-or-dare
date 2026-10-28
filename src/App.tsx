// src/App.tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from './store'
import { isOnboardingDone } from './lib/onboarding'
import Background from './components/Background'
import ConfirmDialog from './components/ConfirmDialog'
import SplashScreen from './components/SplashScreen'
import Onboarding from './components/Onboarding'
import MenuScreen from './screens/MenuScreen'
import SetupScreen from './screens/SetupScreen'
import GameScreen from './screens/GameScreen'

export default function App() {
  const phase = useGameStore(s => s.phase)
  const players = useGameStore(s => s.players)
  const setPhase = useGameStore(s => s.setPhase)

  const [splashDone, setSplashDone] = useState(false)
  const [onboardingDone, setOnboardingDone] = useState(isOnboardingDone)

  useEffect(() => {
    if (phase === 'playing' && players.length < 2) setPhase('setup')
    if (!['menu', 'setup', 'playing'].includes(phase)) setPhase('menu')
  }, [phase, players.length, setPhase])

  return (
    <>
      <Background />

      <div className="min-h-screen flex items-start justify-center p-4 pt-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {phase === 'menu' && <MenuScreen />}
              {phase === 'setup' && <SetupScreen />}
              {phase === 'playing' && <GameScreen />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ConfirmDialog />

      <AnimatePresence>
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {splashDone && !onboardingDone && (
          <Onboarding onDone={() => setOnboardingDone(true)} />
        )}
      </AnimatePresence>
    </>
  )
}