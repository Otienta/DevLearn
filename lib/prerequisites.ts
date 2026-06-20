import type { CourseMeta, ProgressStore } from '@/types/content'

function getCourseMeta(slug: string, allMeta: CourseMeta[]): CourseMeta | null {
  return allMeta.find((meta) => meta.slug === slug) ?? null
}

export function isUnlocked(slug: string, allMeta: CourseMeta[], progress: ProgressStore): boolean {
  const meta = getCourseMeta(slug, allMeta)

  if (!meta) {
    return false
  }

  return meta.prerequisites.every((prerequisiteSlug) => {
    return progress[prerequisiteSlug]?.status === 'mastered'
  })
}

export function getMissingPrerequisites(
  slug: string,
  allMeta: CourseMeta[],
  progress: ProgressStore
): CourseMeta[] {
  const meta = getCourseMeta(slug, allMeta)

  if (!meta) {
    return []
  }

  return meta.prerequisites
    .filter((prerequisiteSlug) => progress[prerequisiteSlug]?.status !== 'mastered')
    .map((prerequisiteSlug) => getCourseMeta(prerequisiteSlug, allMeta))
    .filter((prerequisite): prerequisite is CourseMeta => prerequisite !== null)
}

export function buildDependencyGraph(allMeta: CourseMeta[]): Record<string, string[]> {
  return allMeta.reduce<Record<string, string[]>>((graph, meta) => {
    graph[meta.slug] = [...meta.prerequisites]
    return graph
  }, {})
}
