import type { ConceptStatus } from '@/types/content'

interface StatusBadgeProps {
  status: ConceptStatus
}

const statusConfig: Record<ConceptStatus, { label: string; className: string }> = {
  todo: {
    label: 'À faire',
    className: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
  },
  'in-progress': {
    label: 'En cours',
    className: 'bg-yellow-100 text-yellow-800 ring-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:ring-yellow-800'
  },
  mastered: {
    label: 'Maîtrisé',
    className: 'bg-green-100 text-green-800 ring-green-200 dark:bg-green-950 dark:text-green-200 dark:ring-green-800'
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${config.className}`}>
      {config.label}
    </span>
  )
}
