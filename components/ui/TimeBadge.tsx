interface TimeBadgeProps {
  minutes: number
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return remainingMinutes === 0 ? `${hours} h` : `${hours} h ${remainingMinutes} min`
}

export function TimeBadge({ minutes }: TimeBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
      {formatDuration(minutes)}
    </span>
  )
}
