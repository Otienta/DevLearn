'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface HeaderProps {
  title?: string
}

export function Header({ title = 'DevLearn' }: HeaderProps) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div>
          <Link href="/" className="text-sm font-semibold text-slate-950 dark:text-white lg:hidden">
            DevLearn
          </Link>
          <h1 className="hidden text-base font-semibold text-slate-950 dark:text-white lg:block">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Recherche
          </Link>
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
