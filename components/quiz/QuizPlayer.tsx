'use client'

import { useState } from 'react'
import type { QuizFile } from '@/types/content'
import { setConceptStatus, updateQuizScore } from '@/lib/progress'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { QuizResult } from '@/components/quiz/QuizResult'

interface QuizPlayerProps {
  quiz: QuizFile
  canMaster: boolean
}

export function QuizPlayer({ quiz, canMaster }: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion = quiz.questions[currentIndex]
  const progress = quiz.questions.length === 0 ? 0 : Math.round((currentIndex / quiz.questions.length) * 100)

  function chooseAnswer(answerIndex: number): void {
    if (selectedAnswer !== null) {
      return
    }

    setSelectedAnswer(answerIndex)
    if (answerIndex === currentQuestion.answer) {
      setScore((currentScore) => currentScore + 1)
    }
  }

  function goNext(): void {
    const nextIndex = currentIndex + 1

    if (nextIndex >= quiz.questions.length) {
      const finalScore = selectedAnswer === currentQuestion.answer ? score + 1 : score
      const percentage = quiz.questions.length === 0 ? 0 : Math.round((finalScore / quiz.questions.length) * 100)

      updateQuizScore(quiz.slug, percentage)
      if (percentage >= 80 && canMaster) {
        setConceptStatus(quiz.slug, 'mastered')
      } else if (percentage >= 80) {
        setConceptStatus(quiz.slug, 'in-progress')
      }

      setIsFinished(true)
      return
    }

    setCurrentIndex(nextIndex)
    setSelectedAnswer(null)
  }

  function restart(): void {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setIsFinished(false)
  }

  if (quiz.questions.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
        Aucun quiz disponible pour ce concept.
      </div>
    )
  }

  if (isFinished) {
    return <QuizResult score={score} total={quiz.questions.length} canMaster={canMaster} onRestart={restart} />
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <ProgressBar value={progress} label={`Question ${currentIndex + 1}/${quiz.questions.length}`} />

      <h2 className="mt-6 text-xl font-semibold text-slate-950 dark:text-white">{currentQuestion.question}</h2>

      <div className="mt-5 space-y-3">
        {currentQuestion.options.map((option, optionIndex) => {
          const isSelected = selectedAnswer === optionIndex
          const isCorrect = currentQuestion.answer === optionIndex
          const feedbackClass =
            selectedAnswer === null
              ? 'border-slate-200 hover:border-domain-devops-500 dark:border-slate-800'
              : isCorrect
                ? 'border-green-400 bg-green-50 text-green-900 dark:border-green-700 dark:bg-green-950 dark:text-green-100'
                : isSelected
                  ? 'border-red-400 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-950 dark:text-red-100'
                  : 'border-slate-200 opacity-70 dark:border-slate-800'

          return (
            <button
              key={option}
              type="button"
              onClick={() => chooseAnswer(optionIndex)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${feedbackClass}`}
            >
              {option}
            </button>
          )
        })}
      </div>

      {selectedAnswer !== null && (
        <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {currentQuestion.explanation}
        </div>
      )}

      <button
        type="button"
        onClick={goNext}
        disabled={selectedAnswer === null}
        className="mt-6 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950"
      >
        {currentIndex + 1 === quiz.questions.length ? 'Voir le rÃ©sultat' : 'Question suivante'}
      </button>
    </section>
  )
}
