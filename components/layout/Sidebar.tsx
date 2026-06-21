import Link from 'next/link'
import type { DomainConfig } from '@/types/content'

interface SidebarProps {
  domains: DomainConfig[]
  activeDomain?: string
}

export function Sidebar({ domains, activeDomain }: SidebarProps) {
  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white/90 px-4 py-6 dark:border-slate-800 dark:bg-slate-950/90 lg:sticky lg:top-0 lg:block">
      <Link href="/" className="mb-8 block">
        <span className="block text-lg font-semibold text-slate-950 dark:text-white">DevLearn</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">DevOps & AI Learning Hub</span>
      </Link>

      <nav aria-label="Domaines" className="space-y-2">
        {domains.map((domain) => {
          const isActive = domain.id === activeDomain

          return (
            <Link
              key={domain.id}
              href={`/${domain.id}`}
              className={`block rounded-lg border px-3 py-3 transition ${
                isActive
                  ? 'border-domain-devops-500 bg-domain-devops-50 text-slate-950 dark:bg-slate-900 dark:text-white'
                  : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-800 dark:hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                <span aria-hidden="true">{domain.icon}</span>
                {domain.label}
              </span>
              <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{domain.description}</span>
            </Link>
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
