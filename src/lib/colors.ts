// src/lib/colors.ts
export const AVATAR_GRADIENTS = [
  'from-fuchsia-400 to-rose-400',
  'from-sky-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-violet-400 to-purple-500',
  'from-pink-400 to-red-400',
  'from-cyan-400 to-sky-500',
  'from-lime-400 to-green-500',
] as const

export const getAvatarGradient = (index: number): string =>
  AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]