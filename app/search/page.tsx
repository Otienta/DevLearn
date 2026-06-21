import { ConceptCard } from '@/components/course/ConceptCard'
import { getAllCourseMeta } from '@/lib/content'
import { searchConcepts } from '@/lib/search'

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q ?? ''
  const concepts = await getAllCourseMeta()
  const results = searchConcepts(query, concepts)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Recherche</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Explorer les concepts</h1>

      <form className="mt-6 flex gap-3">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Rechercher par titre, description ou tag"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-950 outline-none focus:border-domain-devops-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
        />
        <button type="submit" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
          Rechercher
        </button>
      </form>

      {query ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{results.length} résultat(s)</h2>
          {results.length > 0 ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {results.map((result) => (
                <ConceptCard key={result.concept.slug} concept={result.concept} />
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
              Aucun concept ne correspond à cette recherche.
            </p>
          )}
        </section>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
          Saisis un mot-clé pour chercher dans les titres, descriptions et tags.
        </p>
      )}
    </div>
  )
}
