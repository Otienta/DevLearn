'use client'

import { useEffect, useState } from 'react'
import type { PracticeExercise, PracticeFile } from '@/types/content'
import { getConceptProgress, markPracticeDone, markPracticeUndone } from '@/lib/progress'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface PracticeBoxProps {
  practice: PracticeFile
}

function ExerciseCard({
  exercise,
  isDone,
  onToggle
}: {
  exercise: PracticeExercise
  isDone: boolean
  onToggle: (exerciseId: string, nextValue: boolean) => void
}) {
  const [copied, setCopied] = useState(false)
  const copyableText = exercise.commande ?? exercise.code

  async function copyText(): Promise<void> {
    if (!copyableText) {
      return
    }

    await navigator.clipboard.writeText(copyableText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{exercise.titre}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{exercise.objectif}</p>
        </div>
        <label className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          <input
            type="checkbox"
            checked={isDone}
            onChange={(event) => onToggle(exercise.id, event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-domain-devops-600"
          />
          Fait
        </label>
      </div>

      {exercise.prerequis && exercise.prerequis.length > 0 && (
        <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Prérequis</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            {exercise.prerequis.map((prerequisite) => (
              <li key={prerequisite}>{prerequisite}</li>
            ))}
          </ul>
        </div>
      )}

      <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
        {exercise.etapes.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-domain-devops-100 text-xs font-semibold text-domain-devops-700 ring-1 ring-domain-devops-500/30 dark:bg-slate-900 dark:text-domain-devops-100">
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>

      {copyableText && (
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
            <span className="text-xs text-slate-400">{exercise.langage ?? 'texte'}</span>
            <button type="button" onClick={copyText} className="rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-slate-800 hover:text-white">
              {copied ? 'Copié' : 'Copier'}
            </button>
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-100">
            <code>{copyableText}</code>
          </pre>
        </div>
      )}

      <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-900 dark:bg-green-950 dark:text-green-100">
        Résultat attendu : {exercise.resultat_attendu}
      </p>

      {exercise.erreurs_frequentes && exercise.erreurs_frequentes.length > 0 && (
        <details className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          <summary className="cursor-pointer font-medium text-slate-900 dark:text-slate-100">Erreurs fréquentes</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {exercise.erreurs_frequentes.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </details>
      )}
    </article>
  )
}

export function PracticeBox({ practice }: PracticeBoxProps) {
  const [doneIds, setDoneIds] = useState<string[]>([])

  useEffect(() => {
    setDoneIds(getConceptProgress(practice.slug)?.practicesDone ?? [])
  }, [practice.slug])

  function toggleExercise(exerciseId: string, nextValue: boolean): void {
    if (nextValue) {
      markPracticeDone(practice.slug, exerciseId)
      setDoneIds((current) => (current.includes(exerciseId) ? current : [...current, exerciseId]))
      return
    }

    markPracticeUndone(practice.slug, exerciseId)
    setDoneIds((current) => current.filter((id) => id !== exerciseId))
  }

  const percentage = practice.exercises.length === 0 ? 0 : Math.round((doneIds.length / practice.exercises.length) * 100)

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <ProgressBar value={percentage} label={`${doneIds.length}/${practice.exercises.length} exercices complétés`} />
      </div>

      {practice.exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          isDone={doneIds.includes(exercise.id)}
          onToggle={toggleExercise}
        />
      ))}
    </section>
  )
}