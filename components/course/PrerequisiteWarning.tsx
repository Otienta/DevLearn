import Link from 'next/link'
import type { CourseMeta } from '@/types/content'

interface PrerequisiteWarningProps {
  missingPrerequisites: CourseMeta[]
}

export function PrerequisiteWarning({ missingPrerequisites }: PrerequisiteWarningProps) {
  if (missingPrerequisites.length === 0) {
    return null
  }

  return (
    <section className="rounded-lg border border-orange-300 bg-orange-50 p-4 text-orange-900 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-100">
      <h2 className="text-sm font-semibold">Prérequis non maîtrisés</h2>
      <p className="mt-1 text-sm">
        Tu peux lire ce cours, mais tu devras maîtriser ces concepts avant de le marquer comme acquis.
      </p>
      <ul className="mt-3 space-y-2">
        {missingPrerequisites.map((prerequisite) => (
          <li key={prerequisite.slug}>
            <Link href={`/${prerequisite.domain}/${prerequisite.slug}`} className="text-sm font-medium underline underline-offset-4">
              {prerequisite.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
