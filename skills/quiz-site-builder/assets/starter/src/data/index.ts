import personality from './personality.json'
import survival from './survival.json'
import diagnostic from './diagnostic.json'
import type { Quiz } from '../types'

export const quizzes = [personality, survival, diagnostic] as Quiz[]
