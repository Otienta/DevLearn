interface ProgressBarProps {
  value: number
  label?: string
  showValue?: boolean
  className?: string
}

function clampPercentage(value: number): number {
  return Math.min(Math.max(value, 0), 100)
}

export function ProgressBar({ value, label, showValue = true, className = '' }: ProgressBarProps) {
  const percentage = clampPercentage(value)

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          {label && <span>{label}</span>}
          {showValue && <span>{percentage}%</span>}
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-domain-devops-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
