import type { ConceptProgress, LearningPath, LearningPathStep, ProgressStore } from '@/types/content'

export interface PathStepProgress {
  step: LearningPathStep
  progress: ConceptProgress | null
  status: 'completed' | 'in-progress' | 'blocked' | 'available' | 'optional'
}

export interface LearningPathProgress {
  path: LearningPath
  steps: PathStepProgress[]
  completed: number
  totalRequired: number
  percentage: number
  nextStep: LearningPathStep | null
}

export function sortPathSteps(steps: LearningPathStep[]): LearningPathStep[] {
  return [...steps].sort((a, b) => a.order - b.order)
}

export function getPathProgress(path: LearningPath, progress: ProgressStore): LearningPathProgress {
  const orderedSteps = sortPathSteps(path.steps)
  const steps: PathStepProgress[] = orderedSteps.map((step, index) => {
    const conceptProgress = progress[step.slug] ?? null
    const previousRequiredSteps = orderedSteps.slice(0, index).filter((previousStep) => !previousStep.optional)
    const previousRequiredCompleted = previousRequiredSteps.every((previousStep) => {
      return progress[previousStep.slug]?.status === 'mastered'
    })

    if (conceptProgress?.status === 'mastered') {
      return { step, progress: conceptProgress, status: 'completed' }
    }

    if (conceptProgress?.status === 'in-progress') {
      return { step, progress: conceptProgress, status: 'in-progress' }
    }

    if (step.optional) {
      return { step, progress: conceptProgress, status: 'optional' }
    }

    return {
      step,
      progress: conceptProgress,
      status: previousRequiredCompleted ? 'available' : 'blocked'
    }
  })

  const requiredSteps = orderedSteps.filter((step) => !step.optional)
  const completed = requiredSteps.filter((step) => progress[step.slug]?.status === 'mastered').length
  const totalRequired = requiredSteps.length
  const nextStep = steps.find((stepProgress) => {
    return stepProgress.status === 'available' || stepProgress.status === 'in-progress'
  })?.step ?? null

  return {
    path,
    steps,
    completed,
    totalRequired,
    percentage: totalRequired === 0 ? 0 : Math.round((completed / totalRequired) * 100),
    nextStep
  }
}

export function getRemainingEstimatedTime(path: LearningPath, progress: ProgressStore): number {
  const requiredSteps = path.steps.filter((step) => !step.optional)
  const remainingRequiredSteps = requiredSteps.filter((step) => progress[step.slug]?.status !== 'mastered')
  const averageStepTime = requiredSteps.length === 0 ? 0 : path.totalEstimatedTime / requiredSteps.length

  return Math.round(remainingRequiredSteps.length * averageStepTime)
}
