// src/lib/sound.ts
type SoundName = 'flip' | 'click' | 'success'

interface SoundConfig {
  freq: number
  freqEnd: number
  duration: number
  volume: number
  type: OscillatorType
}

const CONFIGS: Record<SoundName, SoundConfig> = {
  flip:    { freq: 600, freqEnd: 300, duration: 0.12, volume: 0.15, type: 'triangle' },
  click:   { freq: 900, freqEnd: 700, duration: 0.06, volume: 0.1,  type: 'square' },
  success: { freq: 520, freqEnd: 1040, duration: 0.25, volume: 0.18, type: 'sine' },
}

export function playSound(name: SoundName) {
  if (typeof window === 'undefined') return
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return

  try {
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const cfg = CONFIGS[name]

    osc.type = cfg.type
    osc.frequency.setValueAtTime(cfg.freq, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(cfg.freqEnd, ctx.currentTime + cfg.duration)

    gain.gain.setValueAtTime(cfg.volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + cfg.duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + cfg.duration)

    osc.onended = () => {
      ctx.close().catch(() => { /* ignore */ })
    }
  } catch {
    /* audio недоступен — молча пропускаем */
  }
}