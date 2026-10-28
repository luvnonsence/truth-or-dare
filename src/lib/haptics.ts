// src/lib/haptics.ts
export function haptic(pattern: number | number[] = 10) {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(pattern)
  } catch {
    /* ignore */
  }
}