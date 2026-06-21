'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useState } from 'react'

interface HeaderProps {
  title?: string
}

function formatSegment(segment: string): string {
  const labels: Record<string, string> = {
    devops: 'DevOps',
    python: 'Python',
    'ai-ml': 'AI/ML',
    quiz: 'Quiz',
    pratique: 'Pratique',
    paths: 'Parcours',
    search: 'Recherche'
  }

  return labels[segment] ?? segment.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

export function Header({ title = 'DevLearn' }: HeaderProps) {
  const [isDark, setIsDark] = useState(true)
  const [query, setQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const crumbs = [{ label: 'Accueil', href: '/' }]

    segments.forEach((segment, index) => {
      crumbs.push({
        label: formatSegment(segment),
        href: `/${segments.slice(0, index + 1).join('/')}`
      })
    })

    return crumbs
  }, [pathname])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  function submitSearch(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const trimmedQuery = query.trim()
    router.push(trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : '/search')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 xl:w-72">
          <Link href="/" className="text-sm font-semibold text-slate-950 dark:text-white lg:hidden">
            {title}
          </Link>
          <nav aria-label="Fil d'Ariane" className="hidden truncate text-sm text-slate-500 dark:text-slate-400 lg:block">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.href}>
                {index > 0 && <span className="mx-2 text-slate-300 dark:text-slate-700">&gt;</span>}
                <Link href={crumb.href} className="hover:text-slate-950 dark:hover:text-white">
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        <form onSubmit={submitSearch} className="mx-auto flex w-full max-w-xl items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un concept"
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-950 outline-none focus:border-domain-devops-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
          <button type="submit" className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
            Chercher
          </button>
        </form>

        <div className="flex justify-end xl:w-72">
          <button
            type="button"
            onClick={() => setIsDark((current) => !current)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
            aria-label="Changer le thème"
          >
            {isDark ? 'Clair' : 'Sombre'}
          </button>
        </div>
      </div>
    </header>
  )
}