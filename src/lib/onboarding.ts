// src/lib/onboarding.ts
const KEY = 'tod-onboarding-done'

export const isOnboardingDone = (): boolean => {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return true
  }
}

export const markOnboardingDone = () => {
  try {
    localStorage.setItem(KEY, '1')
  } catch {
    /* ignore */
  }
}