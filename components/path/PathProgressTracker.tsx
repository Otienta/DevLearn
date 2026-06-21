import Link from 'next/link'
import type { CourseMeta } from '@/types/content'
import type { LearningPathProgress, PathStepProgress } from '@/lib/paths'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface PathProgressTrackerProps {
  progress: LearningPathProgress
  concepts: CourseMeta[]
}

const pathStatusLabel: Record<PathStepProgress['status'], string> = {
  completed: 'Terminée',
  'in-progress': 'En cours',
  blocked: 'Bloquée',
  available: 'Disponible',
  optional: 'Optionnelle'
}

function getConcept(slug: string, concepts: CourseMeta[]): CourseMeta | null {
  return concepts.find((concept) => concept.slug === slug) ?? null
}

export function PathProgressTracker({ progress, concepts }: PathProgressTrackerProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{progress.path.title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{progress.path.description}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {progress.path.totalEstimatedTime} min
          </span>
        </div>

        <ProgressBar value={progress.percentage} label={`${progress.completed}/${progress.totalRequired} étapes requises`} className="mt-5" />

        {progress.nextStep && (
          <Link
            href={`/${getConcept(progress.nextStep.slug, concepts)?.domain ?? 'devops'}/${progress.nextStep.slug}`}
            className="mt-5 inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Continuer
          </Link>
        )}
      </div>

      <ol className="space-y-3">
        {progress.steps.map((stepProgress) => {
          const concept = getConcept(stepProgress.step.slug, concepts)
          const status = stepProgress.progress?.status ?? 'todo'

          return (
            <li key={stepProgress.step.slug} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Étape {stepProgress.step.order} · {pathStatusLabel[stepProgress.status]}
                  </p>
                  <h3 className="mt-1 font-semibold text-slate-950 dark:text-white">
                    {concept ? (
                      <Link href={`/${concept.domain}/${concept.slug}`} className="hover:underline">
                        {concept.title}
                      </Link>
                    ) : (
                      stepProgress.step.slug
                    )}
                  </h3>
                  {stepProgress.step.note && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{stepProgress.step.note}</p>}
                </div>
                <StatusBadge status={status} />
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
