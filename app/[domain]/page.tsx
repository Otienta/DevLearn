import { notFound } from 'next/navigation'
import type { Domain } from '@/types/content'
import { ConceptCard } from '@/components/course/ConceptCard'
import { getCoursesByDomain } from '@/lib/content'

const validDomains: Domain[] = ['devops', 'python', 'ai-ml']

const domainTitle: Record<Domain, string> = {
  devops: 'DevOps',
  python: 'Python',
  'ai-ml': 'AI/ML'
}

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params

  if (!validDomains.includes(domain as Domain)) {
    notFound()
  }

  const typedDomain = domain as Domain
  const concepts = await getCoursesByDomain(typedDomain)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Domaine</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{domainTitle[typedDomain]}</h1>

      {concepts.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {concepts.map((concept) => (
            <ConceptCard key={concept.slug} concept={concept} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
          Aucun concept n’est encore disponible pour ce domaine.
        </p>
      )}
    </div>
  )
}
