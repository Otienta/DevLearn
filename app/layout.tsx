import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import type { DomainConfig } from '@/types/content'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { getAllCourseMeta } from '@/lib/content'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevLearn',
  description: 'DevOps & AI Learning Hub'
}

const domains: DomainConfig[] = [
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const concepts = await getAllCourseMeta()

  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-100">
        <div className="min-h-screen lg:flex">
          <Sidebar domains={domains} concepts={concepts} />
          <div className="min-w-0 flex-1">
            <Header />
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}