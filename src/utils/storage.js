// =====================================================================
// Тонкая обёртка над localStorage + хелперы для дат и данных.
// Всё состояние платформы живёт здесь + синхронизируется с бд.
// =====================================================================
import { opportunities as defaultOpportunities, courses as defaultCourses, lessons as defaultLessons } from '../data/mock'

const KEYS = {
  profile: 'mh_profile',
  saved: 'mh_saved',
  progress: 'mh_progress', // { [courseId]: { [lessonId]: true } }
  opportunities: 'mh_opportunities',
  courses: 'mh_courses',
  lessons: 'mh_lessons',
}

// Куда вести «гостя» по кнопкам входа в приложение:
//  - залогинен      → в само приложение (appPath)
//  - был аккаунт    → на /login
//  - впервые здесь  → на /register
export function getEntryPath(user, appPath) {
  if (user) return appPath
  return localStorage.getItem('mh_registered') ? '/login' : '/register'
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* noop */
  }
}

// Фоновая синхронизация с бд
function asyncSyncBack(profile, progress, saved) {
  const token = localStorage.getItem('token')
  if (!token) return
  fetch('http://localhost:8000/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      profile,
      progress,
      saved_opportunities: saved
    })
  })
  .then(res => {
    if (!res.ok) console.warn('Sync server returned non-OK status')
  })
  .catch(err => console.error("Sync background error:", err))
}

// ---------- ПРОФИЛЬ ----------
export function getProfile() {
  return read(KEYS.profile, null)
}

export function saveProfile(profile) {
  write(KEYS.profile, profile)
  asyncSyncBack(profile, getProgress(), getSaved())
}

// ---------- СОХРАНЁННЫЕ ВОЗМОЖНОСТИ ----------
export function getSaved() {
  return read(KEYS.saved, [])
}

export function toggleSaved(id) {
  const saved = getSaved()
  const next = saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id]
  write(KEYS.saved, next)
  asyncSyncBack(getProfile(), getProgress(), next)
  return next
}

export function isSaved(id) {
  return getSaved().includes(id)
}

// ---------- ПРОГРЕСС КУРСОВ ----------
export function getProgress() {
  return read(KEYS.progress, {})
}

export function startCourse(courseId) {
  const progress = getProgress()
  if (!progress[courseId]) {
    progress[courseId] = {}
    write(KEYS.progress, progress)
    asyncSyncBack(getProfile(), progress, getSaved())
  }
}

export function isCourseStarted(courseId) {
  const progress = getProgress()
  return progress.hasOwnProperty(courseId)
}

export function removeCourseProgress(courseId) {
  const progress = getProgress()
  if (progress[courseId]) {
    delete progress[courseId]
    write(KEYS.progress, progress)
    asyncSyncBack(getProfile(), progress, getSaved())
  }
}

export function completeLesson(courseId, lessonId) {
  const progress = getProgress()
  if (!progress[courseId]) progress[courseId] = {}
  progress[courseId][lessonId] = true
  write(KEYS.progress, progress)
  asyncSyncBack(getProfile(), progress, getSaved())
  return progress
}

export function isLessonComplete(courseId, lessonId) {
  const progress = getProgress()
  return Boolean(progress[courseId]?.[lessonId])
}

// Кол-во пройденных уроков курса
export function completedCount(courseId) {
  const progress = getProgress()
  return Object.keys(progress[courseId] || {}).length
}

// ---------- ВОЗМОЖНОСТИ ----------
export function getOpportunities() {
  return read(KEYS.opportunities, defaultOpportunities)
}

export function saveOpportunities(list) {
  write(KEYS.opportunities, list)
}

// ---------- КУРСЫ ----------
export function getCourses() {
  return read(KEYS.courses, defaultCourses)
}

export function saveCourses(list) {
  write(KEYS.courses, list)
}

// ---------- УРОКИ ----------
export function getLessons() {
  return read(KEYS.lessons, defaultLessons)
}

export function saveLessons(data) {
  write(KEYS.lessons, data)
}

// ---------- ДАТЫ ----------
// Кол-во дней до дедлайна относительно «сегодня».
export function daysUntil(dateStr) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - now) / (1000 * 60 * 60 * 24))
}

export function formatDate(dateStr) {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ]
  const d = new Date(dateStr)
  return `${d.getDate()} ${months[d.getMonth()]}`
}

// Класс цвета срочности по кол-ву дней
export function urgencyColor(days) {
  if (days < 7) return 'text-red-600'
  if (days < 14) return 'text-amber-600'
  return 'text-emerald-600'
}

export function urgencyDot(days) {
  if (days < 7) return 'bg-red-500'
  if (days < 14) return 'bg-amber-500'
  return 'bg-emerald-500'
}
