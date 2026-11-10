// src/components/ConfirmDialog.tsx
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useConfirm } from '../lib/confirm'
import { haptic } from '../lib/haptics'
import { playSound } from '../lib/sound'

export default function ConfirmDialog() {
  const options = useConfirm(s => s.options)
  const close = useConfirm(s => s.close)
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!options) return

    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    confirmRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !options.hideCancel) {
        event.preventDefault()
        close()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
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
  }, [options, close])

  return (
    <AnimatePresence>
      {options && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby={options.message ? 'confirm-dialog-description' : undefined}
            className="relative liquid-glass p-6 max-w-sm w-full flex flex-col gap-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 id="confirm-dialog-title" className="text-xl font-bold">{options.title}</h3>
            {options.message && (
              <p id="confirm-dialog-description" className="text-white/60 text-sm leading-relaxed">{options.message}</p>
            )}
            <div className="flex gap-2 mt-2">
              {!options.hideCancel && (
                <button
                  onClick={() => { haptic(5); close() }}
                  className="flex-1 border border-white/15 rounded-xl px-4 py-3 font-medium text-white/70 hover:bg-white/5 transition"
                >
                  {options.cancelLabel ?? 'Отмена'}
                </button>
              )}
              <button
                ref={confirmRef}
                onClick={() => {
                  haptic(10)
                  playSound('click')
                  options.onConfirm()
                  close()
                }}
                className={`flex-1 rounded-xl px-4 py-3 font-semibold transition active:scale-[0.98] ${
                  options.variant === 'danger'
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-white/90 text-black hover:bg-white'
                }`}
              >
                {options.confirmLabel ?? 'ОК'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}