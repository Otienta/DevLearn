import type { CourseMeta } from '@/types/content'

export interface SearchResult {
  concept: CourseMeta
  score: number
  matches: string[]
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function uniqueValues(values: string[]): string[] {
  return Array.from(new Set(values))
}

export function searchConcepts(query: string, concepts: CourseMeta[]): SearchResult[] {
  const normalizedQuery = normalizeText(query.trim())

  if (!normalizedQuery) {
    return []
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean)

  return concepts
    .map((concept) => {
      const title = normalizeText(concept.title)
      const description = normalizeText(concept.description)
      const tags = concept.tags.map(normalizeText)
      const level = normalizeText(concept.level)
      const domain = normalizeText(concept.domain)
      let score = 0
      const matches: string[] = []

      for (const term of terms) {
        if (title.includes(term)) {
          score += 5
          matches.push('title')
        }

        if (tags.some((tag) => tag.includes(term))) {
          score += 4
          matches.push('tags')
        }

        if (description.includes(term)) {
          score += 2
          matches.push('description')
        }

        if (level.includes(term) || domain.includes(term)) {
          score += 1
          matches.push('metadata')
        }
      }

      return {
        concept,
        score,
        matches: uniqueValues(matches)
      }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.concept.title.localeCompare(b.concept.title))
}
