export type Domain = 'devops' | 'python' | 'ai-ml'
export type Level = 'débutant' | 'intermédiaire' | 'avancé'
export type ConceptStatus = 'todo' | 'in-progress' | 'mastered'

// ─── Quiz ─────────────────────────────────────────────────
export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export interface QuizFile {
  slug: string
  questions: QuizQuestion[]
}

// ─── Pratique ─────────────────────────────────────────────
export interface PracticeExercise {
  id: string
  titre: string
  objectif: string
  prerequis?: string[]
  commande?: string
  code?: string
  langage?: string
  etapes: string[]
  resultat_attendu: string
  erreurs_frequentes?: string[]
}

export interface PracticeFile {
  slug: string
  exercises: PracticeExercise[]
}

// ─── Cours (frontmatter MDX) ──────────────────────────────
export interface CourseMeta {
  title: string
  domain: Domain
  slug: string
  level: Level
  tags: string[]
  description: string
  prerequisites: string[]
  estimatedTime: number
  difficultyPoints: number
  ressources: {
    titre: string
    url: string
    type?: 'doc' | 'video' | 'article'
  }[]
}

export interface Course extends CourseMeta {
  content: string
}

// ─── Parcours d'apprentissage ─────────────────────────────
export interface LearningPathStep {
  slug: string
  order: number
  optional?: boolean
  note?: string
}

export interface LearningPath {
  id: string
  title: string
  description: string
  domain: Domain | 'mixed'
  targetLevel: Level
  totalEstimatedTime: number
  steps: LearningPathStep[]
}

// ─── Index global (généré au build) ───────────────────────
export interface ContentIndex {
  concepts: CourseMeta[]
  paths: Omit<LearningPath, 'steps'>[]
  generatedAt: string
}

// ─── Progression localStorage ─────────────────────────────
export interface ConceptProgress {
  status: ConceptStatus
  quizScore?: number
  quizCompletedAt?: string
  practicesDone: string[]
  lastVisited: string
}

export type ProgressStore = Record<string, ConceptProgress>

// ─── Config domaine ───────────────────────────────────────
export interface DomainConfig {
  id: Domain
  label: string
  description: string
  colorClass: string
  icon: string
}
