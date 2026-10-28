// src/lib/uid.ts
export function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID()
    } catch {
      /* fallthrough */
    }
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}