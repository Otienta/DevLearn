interface DifficultyBadgeProps {
  points: number
}

function clampPoints(points: number): number {
  return Math.min(Math.max(Math.round(points), 1), 5)
}

export function DifficultyBadge({ points }: DifficultyBadgeProps) {
  const safePoints = clampPoints(points)

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
      Difficulté
      <span aria-label={`${safePoints} points sur 5`} className="font-semibold">
        {'●'.repeat(safePoints)}
        <span className="text-slate-300 dark:text-slate-600">{'●'.repeat(5 - safePoints)}</span>
      </span>
    </span>
  )
}
