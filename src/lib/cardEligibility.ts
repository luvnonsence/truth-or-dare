import type { Card, Player } from '../types'

const canInteract = (actor: Player, target: Player): boolean =>
  actor.willingWith.includes(target.gender) &&
  target.willingWith.includes(actor.gender)

/**
 * Checks the actual target described by a partner card, not merely the
 * existence of any compatible player in the room.
 */
export const hasCompatibleCardTarget = (
  card: Card,
  players: Player[],
  currentPlayerIndex: number,
): boolean => {
  if (!card.requiresPartner) return true

  if (players.length < 2) return false
  const actorIndex = ((currentPlayerIndex % players.length) + players.length) % players.length
  const actor = players[actorIndex]
  if (!actor) return false

  const others = players.filter(player => player.id !== actor.id)
  const text = card.text.toLocaleLowerCase('ru')

  const isOppositeGenderGroup =
    /всех игроков противоположного пола|каждого игрока противоположного пола|всем игрокам противоположного пола/.test(text)

  const isAllPlayers =
    /всех игроков|всем игрокам|каждому игроку|каждого игрока|каждому из игроков|каждого из игроков|каждому из них|каждого из них|всех присутствующих|всем присутствующим|каждому из присутствующих|каждого из присутствующих|каждому по очереди|каждому в комнате|каждому(?: по \d+ секунд)?|каждый из них|о каждом|в каждом из них/.test(text)

  if (isAllPlayers) {
    const targets = isOppositeGenderGroup
      ? others.filter(player => player.gender !== actor.gender)
      : others
    return targets.length > 0 && targets.every(target => canInteract(actor, target))
  }

  const needsThreePlayers =
    /тр[её]м игрокам|тр[её]х игроков|тремя игроками/.test(text)

  if (needsThreePlayers) {
    return others.filter(target => canInteract(actor, target)).length >= 3
  }

  const needsTwoPlayers =
    /двум игрокам|двух игроков|двумя игроками|с двумя игроками/.test(text)

  if (needsTwoPlayers) {
    return others.filter(target => canInteract(actor, target)).length >= 2
  }

  // Position-based prompts must check that exact seat. Player order is the
  // seating order shown in setup; "напротив" uses the opposite half of the circle.
  const offsets: number[] = []
  if (/слева/.test(text)) offsets.push(-1)
  if (/справа/.test(text)) offsets.push(1)
  if (/напротив/.test(text)) offsets.push(Math.floor(players.length / 2))

  if (offsets.length > 0) {
    const targets = [...new Set(offsets.map(offset =>
      players[(actorIndex + offset + players.length) % players.length],
    ))].filter(target => target && target.id !== actor.id)

    return targets.length > 0 && targets.every(target => canInteract(actor, target))
  }

  // "По выбору группы" and other open-choice prompts may use any mutually
  // compatible participant.
  return others.some(target => canInteract(actor, target))
}
