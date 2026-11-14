export type QuizMode = 'personality' | 'diagnostic' | 'survival'
export interface Axis { id: string; label: string }
export interface Option { id: string; label: string; effects: Record<string, number> }
export interface Question {
  id: string
  scene?: string
  prompt: string
  episode?: number
  options: Option[]
}
export interface Outcome {
  title: string
  subtitle: string
  story: string
  shareLine: string
  strengths: string[]
  advice: string[]
}
export interface Quiz {
  id: string
  mode: QuizMode
  title: string
  tagline: string
  description: string
  theme: { accent: string; paper: string }
  axes: Axis[]
  survival?: { dangerLimit: number; maxEpisode: number; minInfluence?: number }
  questions: Question[]
  outcomes: Record<string, Outcome>
}
export type Answers = Record<string, string>
export interface Assessment {
  outcomeId: string
  episode?: number
  scores: Record<string, number>
}
