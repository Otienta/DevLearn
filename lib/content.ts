import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import type { Course, CourseMeta, Domain, LearningPath, PracticeFile, QuizFile } from '@/types/content'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const COURSES_DIR = path.join(CONTENT_DIR, 'courses')
const QUIZZES_DIR = path.join(CONTENT_DIR, 'quizzes')
const PRACTICES_DIR = path.join(CONTENT_DIR, 'practices')
const PATHS_DIR = path.join(CONTENT_DIR, 'paths')

type MatterResource = {
  titre: string
  url: string
  type?: 'doc' | 'video' | 'article'
}

type CourseMatter = {
  title?: string
  domain?: Domain
  slug?: string
  level?: CourseMeta['level']
  tags?: string[]
  description?: string
  prerequisites?: string[]
  estimatedTime?: number
  difficultyPoints?: number
  ressources?: MatterResource[]
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function listFilesRecursive(directory: string, extension: string): Promise<string[]> {
  if (!(await fileExists(directory))) {
    return []
  }

  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        return listFilesRecursive(entryPath, extension)
      }

      return entry.isFile() && entry.name.endsWith(extension) ? [entryPath] : []
    })
  )

  return files.flat()
}

function assertCourseMeta(data: CourseMatter, source: string): CourseMeta {
  if (
    !data.title ||
    !data.domain ||
    !data.slug ||
    !data.level ||
    !Array.isArray(data.tags) ||
    !data.description ||
    !Array.isArray(data.prerequisites) ||
    typeof data.estimatedTime !== 'number' ||
    typeof data.difficultyPoints !== 'number' ||
    !Array.isArray(data.ressources)
  ) {
    throw new Error(`Frontmatter incomplet ou invalide dans ${source}`)
  }

  return {
    title: data.title,
    domain: data.domain,
    slug: data.slug,
    level: data.level,
    tags: data.tags,
    description: data.description,
    prerequisites: data.prerequisites,
    estimatedTime: data.estimatedTime,
    difficultyPoints: data.difficultyPoints,
    ressources: data.ressources
  }
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  if (!(await fileExists(filePath))) {
    return null
  }

  const content = await fs.readFile(filePath, 'utf8')
  return JSON.parse(content) as T
}

export async function getAllCourses(): Promise<Course[]> {
  const courseFiles = await listFilesRecursive(COURSES_DIR, '.mdx')
  const courses = await Promise.all(
    courseFiles.map(async (filePath) => {
      const rawContent = await fs.readFile(filePath, 'utf8')
      const parsed = matter(rawContent)
      const meta = assertCourseMeta(parsed.data as CourseMatter, filePath)

      return {
        ...meta,
        content: parsed.content
      }
    })
  )

  return courses.sort((a, b) => a.title.localeCompare(b.title))
}

export async function getAllCourseMeta(): Promise<CourseMeta[]> {
  const courses = await getAllCourses()
  return courses.map(({ content: _content, ...meta }) => meta)
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const courses = await getAllCourses()
  return courses.find((course) => course.slug === slug) ?? null
}

export async function getCoursesByDomain(domain: Domain): Promise<CourseMeta[]> {
  const allMeta = await getAllCourseMeta()
  return allMeta.filter((course) => course.domain === domain)
}

export async function getQuizBySlug(slug: string): Promise<QuizFile | null> {
  return readJsonFile<QuizFile>(path.join(QUIZZES_DIR, `${slug}.quiz.json`))
}

export async function getPracticeBySlug(slug: string): Promise<PracticeFile | null> {
  return readJsonFile<PracticeFile>(path.join(PRACTICES_DIR, `${slug}.practice.json`))
}

export async function getAllLearningPaths(): Promise<LearningPath[]> {
  const pathFiles = await listFilesRecursive(PATHS_DIR, '.path.json')
  const paths = await Promise.all(pathFiles.map((filePath) => readJsonFile<LearningPath>(filePath)))

  return paths
    .filter((learningPath): learningPath is LearningPath => learningPath !== null)
    .sort((a, b) => a.title.localeCompare(b.title))
}

export async function getLearningPathById(id: string): Promise<LearningPath | null> {
  const paths = await getAllLearningPaths()
  return paths.find((learningPath) => learningPath.id === id) ?? null
}
