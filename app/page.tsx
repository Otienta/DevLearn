import Link from 'next/link'
import type { CourseMeta, Domain, DomainConfig } from '@/types/content'
import { ConceptCard } from '@/components/course/ConceptCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { getAllCourseMeta, getAllLearningPaths } from '@/lib/content'
import { isUnlocked } from '@/lib/prerequisites'

const domainConfigs: DomainConfig[] = [
  {
    id: 'devops',
    label: 'DevOps',
    description: 'Linux, Git, Docker, CI/CD et serveurs web',
    colorClass: 'text-domain-devops-600',
    icon: '▣'
  },
  {
    id: 'python',
    label: 'Python',
    description: 'Bases du langage, outils et API modernes',
    colorClass: 'text-domain-python-600',
    icon: 'Py'
  },
  {
    id: 'ai-ml',
    label: 'AI/ML',
    description: 'LLM, RAG, agents IA et prompting',
    colorClass: 'text-domain-ai-600',
    icon: 'AI'
  }
]

function getDomainConcepts(concepts: CourseMeta[], domain: Domain): CourseMeta[] {
  return concepts.filter((concept) => concept.domain === domain)
}

export default async function DashboardPage() {
  const [concepts, paths] = await Promise.all([getAllCourseMeta(), getAllLearningPaths()])
  const emptyProgress = {}
  const unlockedConcepts = concepts
    .filter((concept) => isUnlocked(concept.slug, concepts, emptyProgress))
    .sort((a, b) => a.difficultyPoints - b.difficultyPoints || a.title.localeCompare(b.title))
    .slice(0, 3)
  const totalEstimatedTime = concepts.reduce((sum, concept) => sum + concept.estimatedTime, 0)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Dashboard</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">DevLearn</h1>
            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
              Un hub personnel pour apprendre DevOps, Python et AI/ML avec des cours courts, des quiz et des exercices pratiques.
            </p>
          </div>
          <div className="min-w-64 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
            <ProgressBar value={0} label={`0 concepts maîtrisés sur ${concepts.length}`} />
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">0 concepts maîtrisés sur {concepts.length} · 0/{totalEstimatedTime} min de contenu investi</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {domainConfigs.map((domain) => {
          const domainConcepts = getDomainConcepts(concepts, domain.id)

          return (
            <div key={domain.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Domaine</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">{domain.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{domain.description}</p>
                </div>
                <span className={`rounded-lg bg-slate-100 px-2.5 py-2 text-sm font-semibold dark:bg-slate-900 ${domain.colorClass}`}>{domain.icon}</span>
              </div>
              <ProgressBar value={0} label={`${domainConcepts.length} concepts`} className="mt-5" />
              <Link href={`/${domain.id}`} className="mt-5 inline-flex rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900">
                Explorer
              </Link>
            </div>
          )
        })}
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Par où commencer</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Concepts accessibles</h2>
          </div>
          <span className="text-sm text-slate-500">{paths.length} parcours</span>
        </div>
        {unlockedConcepts.length > 0 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {unlockedConcepts.map((concept) => (
              <ConceptCard key={concept.slug} concept={concept} />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
            Aucun concept accessible pour le moment.
          </p>
        )}
      </section>

      <section className="mt-10 rounded-lg border border-dashed border-slate-300 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Continuer</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Dernières visites</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Les derniers concepts visités apparaîtront ici quand la progression localStorage sera branchée sur un composant client du dashboard.
        </p>
      </section>
    </div>
  )
}