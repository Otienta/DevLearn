import type { ReactNode } from 'react'
import type { CourseMeta } from '@/types/content'
import { DifficultyBadge } from '@/components/ui/DifficultyBadge'
import { TimeBadge } from '@/components/ui/TimeBadge'

interface CourseLayoutProps {
  course: CourseMeta
  actions?: ReactNode
  children: ReactNode
}

export function CourseLayout({ course, actions, children }: CourseLayoutProps) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-10">
      <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
            {course.level}
          </span>
          <TimeBadge minutes={course.estimatedTime} />
          <DifficultyBadge points={course.difficultyPoints} />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{course.title}</h1>
        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{course.description}</p>

        {course.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {course.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-50 px-2.5 py-1 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {actions && <div className="mt-6">{actions}</div>}
      </header>

      <div className="prose prose-slate max-w-none dark:prose-invert">{children}</div>
    </article>
  )
}
