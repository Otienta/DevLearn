interface QuizResultProps {
  score: number
  total: number
  canMaster: boolean
  onRestart: () => void
}

export function QuizResult({ score, total, canMaster, onRestart }: QuizResultProps) {
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100)
  const passed = percentage >= 80

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Résultat</p>
      <h2 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
        {score}/{total} · {percentage}%
      </h2>

      <p className="mt-4 text-slate-600 dark:text-slate-300">
        {passed && canMaster
          ? 'Bravo, le quiz est validé et le concept peut être marqué comme maîtrisé.'
          : passed
            ? 'Score validé, mais certains prérequis doivent encore être maîtrisés.'
            : 'Continue à pratiquer puis retente le quiz quand tu es prêt.'}
      </p>

      <button
        type="button"
        onClick={onRestart}
        className="mt-6 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      >
        Recommencer
      </button>
    </section>
  )
}
