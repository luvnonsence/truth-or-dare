// src/lib/colors.ts
export const AVATAR_CLASSES = [
  'avatar-grad-0',
  'avatar-grad-1',
  'avatar-grad-2',
  'avatar-grad-3',
  'avatar-grad-4',
  'avatar-grad-5',
  'avatar-grad-6',
  'avatar-grad-7',
] as const

export const getAvatarClass = (index: number): string =>
  AVATAR_CLASSES[index % AVATAR_CLASSES.length]