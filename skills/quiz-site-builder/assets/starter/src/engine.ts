import type { Answers, Assessment, Quiz } from './types'

/** Evaluate a contiguous answered prefix. Return null while questions remain. */
export function assess(quiz: Quiz, answers: Answers): Assessment | null {
  const scores: Record<string, number> = Object.fromEntries(quiz.axes.map(a => [a.id, 0]))
  let danger = 0
  let influence = 0
  for (const question of quiz.questions) {
    const answerId = answers[question.id]
    const option = question.options.find(o => o.id === answerId)
    if (!option) return null
    if (quiz.mode === 'survival') {
      if (!quiz.survival) throw new Error('Survival config is missing')
      danger += option.effects.danger ?? 0
      influence += option.effects.influence ?? 0
      // Stopping at a checkpoint is deterministic and never deferred.
      if (danger >= quiz.survival.dangerLimit) {
        const episode = question.episode ?? 1
        return {
          outcomeId: episode < quiz.survival.maxEpisode / 2 ? 'early' : 'middle',
          episode,
          scores: { danger, influence },
        }
      }
    } else {
      for (const axis of quiz.axes) scores[axis.id] += option.effects[axis.id] ?? 0
    }
  }
  if (quiz.mode === 'survival') {
    return {
      outcomeId: influence >= (quiz.survival?.minInfluence ?? 0) ? 'final' : 'middle',
      episode: quiz.survival?.maxEpisode,
      scores: { danger, influence },
    }
  }
  // Declared axis order is the documented, stable tiebreaker.
  const winner = quiz.axes.reduce((best, axis) => scores[axis.id] > scores[best.id] ? axis : best).id
  return { outcomeId: winner, scores }
}

/** First incomplete checkpoint; if fatal, return total questions (render result). */
export function nextQuestionIndex(quiz: Quiz, answers: Answers): number {
  if (assess(quiz, answers)) return quiz.questions.length
  return quiz.questions.findIndex(q => !q.options.some(o => o.id === answers[q.id]))
}

export function answeredPrefix(quiz: Quiz, answers: Answers): number {
  return quiz.questions.findIndex(q => !q.options.some(o => o.id === answers[q.id])) === -1
    ? quiz.questions.length
    : quiz.questions.findIndex(q => !q.options.some(o => o.id === answers[q.id]))
}
