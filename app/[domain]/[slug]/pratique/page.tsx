import { notFound } from 'next/navigation'
import type { Domain } from '@/types/content'
import { PracticeBox } from '@/components/practice/PracticeBox'
import { getCourseBySlug, getPracticeBySlug } from '@/lib/content'

export default async function PracticePage({ params }: { params: Promise<{ domain: string; slug: string }> }) {
  const { domain, slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course || course.domain !== (domain as Domain)) {
    notFound()
  }

  const practice = await getPracticeBySlug(slug)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-10">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Pratique</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{course.title}</h1>

      <div className="mt-8">
        {practice ? (
          <PracticeBox practice={practice} />
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
            Aucun exercice pratique n’est encore disponible pour ce concept.
          </p>
        )}
      </div>
    </div>
  )
}
