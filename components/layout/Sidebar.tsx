'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { ConceptStatus, CourseMeta, DomainConfig } from '@/types/content'

interface SidebarProps {
  domains: DomainConfig[]
  concepts?: CourseMeta[]
  activeDomain?: string
}

const statusClass: Record<ConceptStatus, string> = {
  todo: 'bg-slate-400',
  'in-progress': 'bg-yellow-400',
  mastered: 'bg-green-500'
}

export function Sidebar({ domains, concepts = [], activeDomain }: SidebarProps) {
  const [openDomains, setOpenDomains] = useState<Record<string, boolean>>(() => {
    return domains.reduce<Record<string, boolean>>((state, domain) => {
      state[domain.id] = true
      return state
    }, {})
  })

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white/90 px-4 py-6 dark:border-slate-800 dark:bg-slate-950/90 lg:sticky lg:top-0 lg:block">
      <Link href="/" className="mb-8 block">
        <span className="block text-lg font-semibold text-slate-950 dark:text-white">DevLearn</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">DevOps & AI Learning Hub</span>
      </Link>

      <nav aria-label="Domaines" className="space-y-4">
        {domains.map((domain) => {
          const isActive = domain.id === activeDomain
          const isOpen = openDomains[domain.id] ?? true
          const domainConcepts = concepts.filter((concept) => concept.domain === domain.id)

          return (
            <section key={domain.id} className="border-t border-slate-200 pt-4 first:border-t-0 first:pt-0 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Link
                  href={`/${domain.id}`}
                  className={`min-w-0 flex-1 rounded-lg border px-3 py-3 transition ${
                    isActive
                      ? 'border-domain-devops-500 bg-domain-devops-50 text-slate-950 dark:bg-slate-900 dark:text-white'
                      : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-800 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2 font-medium">
                    <span aria-hidden="true">{domain.icon}</span>
                    {domain.label}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setOpenDomains((current) => ({ ...current, [domain.id]: !isOpen }))}
                  className="rounded-lg border border-slate-200 px-2 py-2 text-xs text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                  aria-expanded={isOpen}
                  aria-label={`Afficher ou masquer ${domain.label}`}
                >
                  {isOpen ? '−' : '+'}
                </button>
              </div>

              {isOpen && (
                <div className="mt-2 space-y-1 pl-3">
                  {domainConcepts.length > 0 ? (
                    domainConcepts.map((concept) => (
                      <Link
                        key={concept.slug}
                        href={`/${concept.domain}/${concept.slug}`}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                      >
                        <span className={`h-2 w-2 rounded-full ${statusClass.todo}`} aria-hidden="true" />
                        <span className="truncate">{concept.title}</span>
                      </Link>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">Aucun concept</p>
                  )}
                </div>
              )}
            </section>
          )
        })}
      </nav>

      <div className="mt-8 space-y-2 border-t border-slate-200 pt-6 dark:border-slate-800">
        <Link href="/paths" className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900">
          Parcours
        </Link>
        <Link href="/search" className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900">
          Recherche
        </Link>
      </div>
    </aside>
  )
}