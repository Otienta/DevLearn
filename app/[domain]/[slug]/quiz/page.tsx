import { notFound } from 'next/navigation'
import type { Domain } from '@/types/content'
import { QuizPlayer } from '@/components/quiz/QuizPlayer'
import { getCourseBySlug, getQuizBySlug } from '@/lib/content'

export default async function QuizPage({ params }: { params: Promise<{ domain: string; slug: string }> }) {
  const { domain, slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course || course.domain !== (domain as Domain)) {
    notFound()
  }

  const quiz = await getQuizBySlug(slug)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-10">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Quiz</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{course.title}</h1>

      <div className="mt-8">
        {quiz ? (
          <QuizPlayer quiz={quiz} canMaster={course.prerequisites.length === 0} />
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
            Aucun quiz n’est encore disponible pour ce concept.
          </p>
        )}
      </div>
    </div>
  )
}
