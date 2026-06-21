'use client'

import { useEffect, useState } from 'react'

export interface TocItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  items: TocItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    if (items.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting)
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    for (const item of items) {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    }

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) {
    return null
  }

  return (
    <nav aria-label="Table des matières" className="hidden xl:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Sur cette page</p>
      <ol className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${Math.max(item.level - 2, 0) * 12}px` }}>
            <a
              href={`#${item.id}`}
              className={`block border-l pl-3 transition ${
                activeId === item.id
                  ? 'border-domain-devops-500 text-slate-950 dark:text-white'
                  : 'border-slate-200 text-slate-500 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
