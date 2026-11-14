import { describe, expect, it } from 'vitest'
import { assess, nextQuestionIndex } from './engine'
import { quizzes } from './data'
import type { Answers, Quiz } from './types'

const pick = (quiz: Quiz, i: number): Answers =>
  Object.fromEntries(quiz.questions.map(q => [q.id, q.options[i]?.id ?? q.options[0].id]))

describe('quiz scoring engine', () => {
  it('returns null while questions remain unanswered', () => {
    expect(assess(quizzes[0], {})).toBeNull()
  })
  it('returns deterministic outcomes for personality choices', () => {
    const quiz = quizzes.find(q => q.mode === 'personality')!
    expect(assess(quiz, pick(quiz, 0))).toEqual(assess(quiz, pick(quiz, 0)))
  })
  it('can reach at least two different diagnostic outcomes', () => {
    const quiz = quizzes.find(q => q.mode === 'diagnostic')!
    const outcomes = new Set(quiz.axes.map(axis => {
      const choices: Answers = Object.fromEntries(quiz.questions.map(q => [q.id, q.options.find(o => (o.effects[axis.id] ?? 0) > 0)?.id ?? q.options[0].id]))
      return assess(quiz, choices)?.outcomeId
    }))
    expect(outcomes.size).toBeGreaterThanOrEqual(2)
  })
  it('survival can finish with careful choices and end early with risky choices', () => {
    const quiz = quizzes.find(q => q.mode === 'survival')!
    const safe: Answers = Object.fromEntries(quiz.questions.map((q, i) => [q.id, q.options.find(o => o.id === (i < 4 ? 'b' : 'c'))!.id]))
    const risky: Answers = Object.fromEntries(quiz.questions.map(q => [q.id, q.options.find(o => o.effects.danger === 2)?.id ?? q.options[0].id]))
    expect(assess(quiz, safe)?.outcomeId).toBe('final')
    expect(assess(quiz, risky)?.outcomeId).toBe('early')
    expect(nextQuestionIndex(quiz, risky)).toBe(quiz.questions.length)
    const passive: Answers = Object.fromEntries(quiz.questions.map(q => [q.id, q.options.find(o => o.id === 'c')!.id]))
    expect(assess(quiz, passive)?.outcomeId).toBe('middle')
  })
  it('the last question must be answered before profile completion', () => {
    const quiz = quizzes[0]
    const answers = pick(quiz, 0)
    delete answers[quiz.questions.at(-1)!.id]
    expect(assess(quiz, answers)).toBeNull()
  })
})
