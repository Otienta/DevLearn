import type {
  ConceptProgress,
  ConceptStatus,
  ContentIndex,
  Domain,
  ProgressStore
} from '@/types/content'

const PROGRESS_KEY = 'devlearn_progress'
const CONTENT_INDEX_KEY = 'devlearn_content_index'

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function nowIso(): string {
  return new Date().toISOString()
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseLocalStorage()) {
    return fallback
  }

  const rawValue = window.localStorage.getItem(key)
  if (!rawValue) {
    return fallback
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    return fallback
  }
}

function writeProgress(progress: ProgressStore): void {
  if (canUseLocalStorage()) {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  }
}

function createDefaultProgress(status: ConceptStatus = 'todo'): ConceptProgress {
  return {
    status,
    practicesDone: [],
    lastVisited: nowIso()
  }
}

export function getProgress(): ProgressStore {
  return readJson<ProgressStore>(PROGRESS_KEY, {})
}

export function getConceptProgress(slug: string): ConceptProgress | null {
  return getProgress()[slug] ?? null
}

export function setConceptStatus(slug: string, status: ConceptStatus): void {
  const progress = getProgress()
  const current = progress[slug] ?? createDefaultProgress(status)

  progress[slug] = {
    ...current,
    status,
    lastVisited: nowIso()
  }

  writeProgress(progress)
}

export function updateQuizScore(slug: string, score: number): void {
  const progress = getProgress()
  const current = progress[slug] ?? createDefaultProgress('in-progress')

  progress[slug] = {
    ...current,
    status: current.status === 'todo' ? 'in-progress' : current.status,
    quizScore: score,
    quizCompletedAt: nowIso(),
    lastVisited: nowIso()
  }

  writeProgress(progress)
}

export function markPracticeDone(slug: string, exerciseId: string): void {
  const progress = getProgress()
  const current = progress[slug] ?? createDefaultProgress('in-progress')
  const practicesDone = current.practicesDone.includes(exerciseId)
    ? current.practicesDone
    : [...current.practicesDone, exerciseId]

  progress[slug] = {
    ...current,
    status: current.status === 'todo' ? 'in-progress' : current.status,
    practicesDone,
    lastVisited: nowIso()
  }

  writeProgress(progress)
}

export function markPracticeUndone(slug: string, exerciseId: string): void {
  const progress = getProgress()
  const current = progress[slug]

  if (!current) {
    return
  }

  progress[slug] = {
    ...current,
    practicesDone: current.practicesDone.filter((id) => id !== exerciseId),
    lastVisited: nowIso()
  }

  writeProgress(progress)
}

export function setProgressContentIndex(index: ContentIndex): void {
  if (canUseLocalStorage()) {
    window.localStorage.setItem(CONTENT_INDEX_KEY, JSON.stringify(index))
  }
}

export function getGlobalStats(): {
  total: number
  mastered: number
  inProgress: number
  todo: number
  totalEstimatedTime: number
  timeInvested: number
} {
  const progress = getProgress()
  const index = readJson<ContentIndex | null>(CONTENT_INDEX_KEY, null)
  const concepts = index?.concepts ?? []
  const total = concepts.length
  const mastered = concepts.filter((concept) => progress[concept.slug]?.status === 'mastered').length
  const inProgress = concepts.filter((concept) => progress[concept.slug]?.status === 'in-progress').length
  const todo = Math.max(total - mastered - inProgress, 0)
  const totalEstimatedTime = concepts.reduce((sum, concept) => sum + concept.estimatedTime, 0)
  const timeInvested = concepts.reduce((sum, concept) => {
    return progress[concept.slug]?.status === 'mastered' ? sum + concept.estimatedTime : sum
  }, 0)

  return {
    total,
    mastered,
    inProgress,
    todo,
    totalEstimatedTime,
    timeInvested
  }
}

export function getDomainStats(domain: Domain): {
  total: number
  mastered: number
  percentage: number
  difficultyAvg: number
} {
  const progress = getProgress()
  const index = readJson<ContentIndex | null>(CONTENT_INDEX_KEY, null)
  const concepts = (index?.concepts ?? []).filter((concept) => concept.domain === domain)
  const total = concepts.length
  const mastered = concepts.filter((concept) => progress[concept.slug]?.status === 'mastered').length
  const difficultyTotal = concepts.reduce((sum, concept) => sum + concept.difficultyPoints, 0)

  return {
    total,
    mastered,
    percentage: total === 0 ? 0 : Math.round((mastered / total) * 100),
    difficultyAvg: total === 0 ? 0 : Number((difficultyTotal / total).toFixed(1))
  }
}

export function resetProgress(): void {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(PROGRESS_KEY)
  }
}
