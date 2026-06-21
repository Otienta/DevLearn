'use client'

import { useState } from 'react'

interface FlashcardProps {
  front: string
  back: string
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setIsFlipped((current) => !current)}
      className="min-h-36 w-full rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-domain-devops-500 dark:border-slate-800 dark:bg-slate-950"
      aria-pressed={isFlipped}
    >
      <span className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {isFlipped ? 'Réponse' : 'Question'}
      </span>
      <span className="block text-base leading-7 text-slate-900 dark:text-slate-100">
        {isFlipped ? back : front}
      </span>
    </button>
  )
}
