// src/lib/animalNames.ts
export const ANIMAL_NAMES = [
  'Лис', 'Сова', 'Волк', 'Кот', 'Панда', 'Енот', 'Ёж', 'Заяц',
  'Барсук', 'Бобр', 'Выдра', 'Тигр', 'Лев', 'Мишка', 'Олень', 'Хомяк',
  'Кролик', 'Ласка', 'Лама', 'Пингвин', 'Кит', 'Дельфин', 'Лось', 'Носорог',
  'Гепард', 'Койот', 'Рысь', 'Филин', 'Бурундук', 'Сурок', 'Тушканчик', 'Манул',
]

export function randomAnimalName(used: string[]): string {
  const available = ANIMAL_NAMES.filter(n => !used.includes(n))
  const pool = available.length > 0 ? available : ANIMAL_NAMES
  return pool[Math.floor(Math.random() * pool.length)]
}