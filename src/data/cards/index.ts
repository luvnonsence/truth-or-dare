// src/data/cards/index.ts
import type { Card } from '../../types'
import { truthEasy, truthMedium, truthHard } from './truth'
import { dareEasy, dareMedium, dareHard } from './dare'

export const cards: Card[] = [
  ...truthEasy,
  ...truthMedium,
  ...truthHard,
  ...dareEasy,
  ...dareMedium,
  ...dareHard,
]

export { truthEasy, truthMedium, truthHard, dareEasy, dareMedium, dareHard }