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
  const unlockedConcepts = concepts.filter((concept) => isUnlocked(concept.slug, concepts, emptyProgress)).slice(0, 4)
  const totalEstimatedTime = concepts.reduce((sum, concept) => sum + concept.estimatedTime, 0)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <section className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">DevLearn</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Suis ta progression DevOps, Python et AI/ML depuis un espace personnel sobre et orienté pratique.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {domainConfigs.map((domain) => {
          const domainConcepts = getDomainConcepts(concepts, domain.id)

          return (
            <Link
              key={domain.id}
              href={`/${domain.id}`}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-domain-devops-500 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-950 dark:text-white">{domain.label}</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{domain.description}</p>
                </div>
                <span className={domain.colorClass}>{domain.icon}</span>
              </div>
              <ProgressBar value={0} label={`${domainConcepts.length} concepts`} className="mt-5" />
            </Link>
          )
        })}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm text-slate-500">Concepts maîtrisés</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">0/{concepts.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm text-slate-500">Temps investi estimé</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">0/{totalEstimatedTime} min</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm text-slate-500">Parcours disponibles</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{paths.length}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Concepts débloqués</h2>
        {unlockedConcepts.length > 0 ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {unlockedConcepts.map((concept) => (
              <ConceptCard key={concept.slug} concept={concept} />
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-lg border border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
            Aucun contenu n’est encore disponible. Le Bloc 4 ajoutera les cours, quiz, pratiques et parcours.
          </p>
        )}
      </section>
    </div>
  )
}
