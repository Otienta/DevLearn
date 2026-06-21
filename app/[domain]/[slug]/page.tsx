import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Domain } from '@/types/content'
import { CodeBlock } from '@/components/course/CodeBlock'
import { CourseLayout } from '@/components/course/CourseLayout'
import { PrerequisiteWarning } from '@/components/course/PrerequisiteWarning'
import { getAllCourseMeta, getCourseBySlug } from '@/lib/content'
import { getMissingPrerequisites } from '@/lib/prerequisites'

function renderPlainMdx(content: string) {
  return content.split('\n\n').map((block) => {
    const trimmed = block.trim()

    if (!trimmed) {
      return null
    }

    if (trimmed.startsWith('```')) {
      const lines = trimmed.split('\n')
      const language = lines[0].replace('```', '').trim() || 'text'
      const code = lines.slice(1, -1).join('\n')

      return <CodeBlock key={trimmed} code={code} language={language} />
    }

    if (trimmed.startsWith('# ')) {
      return <h1 key={trimmed}>{trimmed.replace(/^# /, '')}</h1>
    }

    if (trimmed.startsWith('## ')) {
      return <h2 key={trimmed}>{trimmed.replace(/^## /, '')}</h2>
    }

    if (trimmed.startsWith('### ')) {
      return <h3 key={trimmed}>{trimmed.replace(/^### /, '')}</h3>
    }

    return <p key={trimmed}>{trimmed}</p>
  })
}

export default async function CoursePage({ params }: { params: Promise<{ domain: string; slug: string }> }) {
  const { domain, slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course || course.domain !== (domain as Domain)) {
    notFound()
  }

  const allMeta = await getAllCourseMeta()
  const missingPrerequisites = getMissingPrerequisites(slug, allMeta, {})

  return (
    <CourseLayout
      course={course}
      actions={
        <div className="flex flex-wrap gap-3">
          <Link href={`/${course.domain}/${course.slug}/quiz`} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
            Ouvrir le quiz
          </Link>
          <Link href={`/${course.domain}/${course.slug}/pratique`} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900">
            Voir la pratique
          </Link>
        </div>
      }
    >
      <PrerequisiteWarning missingPrerequisites={missingPrerequisites} />
      {renderPlainMdx(course.content)}
    </CourseLayout>
  )
}
