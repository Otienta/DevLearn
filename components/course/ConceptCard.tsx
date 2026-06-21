import Link from 'next/link'
import type { ConceptStatus, CourseMeta } from '@/types/content'
import { DifficultyBadge } from '@/components/ui/DifficultyBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { TimeBadge } from '@/components/ui/TimeBadge'

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

export function ConceptCard({ concept, status = 'todo', progress = 0, isLocked = false }: ConceptCardProps) {
  return (
    <Link
      href={`/${concept.domain}/${concept.slug}`}
      className={`block rounded-lg border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-950 ${
        isLocked
          ? 'border-orange-300 dark:border-orange-700'
          : 'border-slate-200 hover:border-domain-devops-500 dark:border-slate-800'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{domainLabel[concept.domain]}</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{concept.title}</h3>
        </div>
        <StatusBadge status={status} />
      </div>

      <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{concept.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <TimeBadge minutes={concept.estimatedTime} />
        <DifficultyBadge points={concept.difficultyPoints} />
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
