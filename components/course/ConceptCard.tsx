import Link from 'next/link'
import type { ConceptStatus, CourseMeta } from '@/types/content'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface ConceptCardProps {
  concept: CourseMeta
  status?: ConceptStatus
  progress?: number
  isLocked?: boolean
}

const domainLabel: Record<CourseMeta['domain'], string> = {
  devops: 'DevOps',
  python: 'Python',
  'ai-ml': 'AI/ML'
}

const difficultyClass: Record<number, string> = {
  1: 'text-green-500',
  2: 'text-green-500',
  3: 'text-yellow-500',
  4: 'text-orange-500',
  5: 'text-red-500'
}

function clampDifficulty(points: number): number {
  return Math.min(Math.max(Math.round(points), 1), 5)
}

export function ConceptCard({ concept, status = 'todo', progress = 0, isLocked = false }: ConceptCardProps) {
  const difficulty = clampDifficulty(concept.difficultyPoints)

  return (
    <Link
      href={`/${concept.domain}/${concept.slug}`}
      className={`group block rounded-lg border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-950 ${
        isLocked
          ? 'border-orange-300 dark:border-orange-700'
          : 'border-slate-200 hover:border-domain-devops-500 dark:border-slate-800'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{domainLabel[concept.domain]}</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950 group-hover:text-domain-devops-700 dark:text-white dark:group-hover:text-domain-devops-100">
            {isLocked && <span aria-hidden="true" className="mr-2 text-orange-500">🔒</span>}
            {concept.title}
          </h3>
        </div>
        <StatusBadge status={status} />
      </div>

      <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{concept.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
          <span aria-hidden="true">◷</span>
          {concept.estimatedTime} min
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
          <span>Difficulté</span>
          <span className={difficultyClass[difficulty]} aria-label={`${difficulty} points sur 5`}>
            {'●'.repeat(difficulty)}
            <span className="text-slate-300 dark:text-slate-600">{'●'.repeat(5 - difficulty)}</span>
          </span>
        </span>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
          {concept.level}
        </span>
      </div>

      {isLocked && (
        <p className="mt-4 rounded-md bg-orange-50 px-3 py-2 text-sm text-orange-800 dark:bg-orange-950 dark:text-orange-200">
          Prérequis à terminer avant maîtrise.
        </p>
      )}

      <ProgressBar value={progress} label="Progression" className="mt-5" />
    </Link>
  )
}