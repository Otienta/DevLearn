import { notFound } from 'next/navigation'
import { PathProgressTracker } from '@/components/path/PathProgressTracker'
import { getAllCourseMeta, getLearningPathById } from '@/lib/content'
import { getPathProgress } from '@/lib/paths'

export default async function LearningPathPage({ params }: { params: Promise<{ pathId: string }> }) {
  const { pathId } = await params
  const [learningPath, concepts] = await Promise.all([getLearningPathById(pathId), getAllCourseMeta()])

  if (!learningPath) {
    notFound()
  }

  const pathProgress = getPathProgress(learningPath, {})

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Parcours</p>
      <div className="mt-6">
        <PathProgressTracker progress={pathProgress} concepts={concepts} />
      </div>
    </div>
  )
}
