import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { LearningPath } from '../types/content'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const COURSES_DIR = path.join(CONTENT_DIR, 'courses')
const QUIZZES_DIR = path.join(CONTENT_DIR, 'quizzes')
const PRACTICES_DIR = path.join(CONTENT_DIR, 'practices')
const PATHS_DIR = path.join(CONTENT_DIR, 'paths')

interface CourseValidationMeta {
  slug: string
  prerequisites: string[]
  source: string
}

function listFilesRecursive(directory: string, extension: string): string[] {
  if (!fs.existsSync(directory)) {
    return []
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      return listFilesRecursive(entryPath, extension)
    }

    return entry.isFile() && entry.name.endsWith(extension) ? [entryPath] : []
  })
}

function readCourseMeta(filePath: string): CourseValidationMeta | null {
  const rawContent = fs.readFileSync(filePath, 'utf8')
  const parsed = matter(rawContent)
  const data = parsed.data as Partial<CourseValidationMeta>

  if (!data.slug || !Array.isArray(data.prerequisites)) {
    return null
  }

  return {
    slug: data.slug,
    prerequisites: data.prerequisites,
    source: filePath
  }
}

function readLearningPath(filePath: string): LearningPath | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as LearningPath
  } catch {
    return null
  }
}

function relative(filePath: string): string {
  return path.relative(process.cwd(), filePath)
}

function validateContent(): number {
  const errors: string[] = []
  const warnings: string[] = []
  const courseFiles = listFilesRecursive(COURSES_DIR, '.mdx')
  const courses = courseFiles.map(readCourseMeta)
  const validCourses = courses.filter((course): course is CourseValidationMeta => course !== null)
  const slugs = new Set(validCourses.map((course) => course.slug))

  courses.forEach((course, index) => {
    if (!course) {
      errors.push(`Frontmatter invalide : ${relative(courseFiles[index])}`)
    }
  })

  if (courseFiles.length === 0) {
    warnings.push('Aucun cours MDX trouvé dans content/courses.')
  }

  for (const course of validCourses) {
    const quizPath = path.join(QUIZZES_DIR, `${course.slug}.quiz.json`)
    const practicePath = path.join(PRACTICES_DIR, `${course.slug}.practice.json`)

    if (!fs.existsSync(quizPath)) {
      errors.push(`Quiz manquant pour "${course.slug}" : ${relative(quizPath)}`)
    }

    if (!fs.existsSync(practicePath)) {
      errors.push(`Pratique manquante pour "${course.slug}" : ${relative(practicePath)}`)
    }

    for (const prerequisite of course.prerequisites) {
      if (!slugs.has(prerequisite)) {
        errors.push(`Prérequis inconnu "${prerequisite}" dans ${relative(course.source)}`)
      }
    }
  }

  const pathFiles = listFilesRecursive(PATHS_DIR, '.path.json')
  for (const pathFile of pathFiles) {
    const learningPath = readLearningPath(pathFile)

    if (!learningPath) {
      errors.push(`Parcours JSON invalide : ${relative(pathFile)}`)
      continue
    }

    for (const step of learningPath.steps) {
      if (!slugs.has(step.slug)) {
        errors.push(`Slug de parcours inconnu "${step.slug}" dans ${relative(pathFile)}`)
      }
    }
  }

  console.log('Validation du contenu DevLearn')
  console.log(`Cours analysés : ${courseFiles.length}`)
  console.log(`Parcours analysés : ${pathFiles.length}`)

  if (warnings.length > 0) {
    console.log('\nAvertissements :')
    warnings.forEach((warning) => console.log(`- ${warning}`))
  }

  if (errors.length > 0) {
    console.error('\nIncohérences détectées :')
    errors.forEach((error) => console.error(`- ${error}`))
    return 1
  }

  console.log('\nAucune incohérence détectée.')
  return 0
}

process.exitCode = validateContent()
