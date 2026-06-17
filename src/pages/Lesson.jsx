import { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import ActivityRead from '../components/ActivityRead'
import ActivityFlashcards from '../components/ActivityFlashcards'
import ActivityMatch from '../components/ActivityMatch'
import ActivityQuiz from '../components/ActivityQuiz'
import ActivityVideo from '../components/ActivityVideo'
import { getCourses, isLessonComplete, completeLesson, getLessons, startCourse } from '../utils/storage'

const ACTIVITY_META = {
  read:       { icon: 'menu_book',  label: 'Теория',       color: 'indigo' },
  flashcards: { icon: 'style',      label: 'Флэшкарты',    color: 'purple' },
  match:      { icon: 'link',       label: 'Совпадение',   color: 'amber'  },
  quiz:       { icon: 'quiz',       label: 'Тест',         color: 'rose'   },
  video:      { icon: 'play_circle',label: 'Видео',        color: 'blue'   },
}

export default function Lesson() {
  const { id, lessonId } = useParams()
  const navigate = useNavigate()

  const course = useMemo(() => getCourses().find((c) => c.id === id), [id])
  const lessonsMap = useMemo(() => getLessons(), [])
  const courseLessons = lessonsMap[id] || []
  const lessonIndex = courseLessons.findIndex((l) => l.id === lessonId)
  const lesson = courseLessons[lessonIndex]

  const isLast = lessonIndex === courseLessons.length - 1
  const nextLesson = courseLessons[lessonIndex + 1]
  const alreadyPassed = isLessonComplete(id, lessonId)

  // Step through activities
  const activities = useMemo(() => {
    if (!lesson) return []
    if (lesson.activities && lesson.activities.length > 0) return lesson.activities
    const acts = []
    if (lesson.video_url) {
      acts.push({ type: 'video', title: 'Видеоурок', url: lesson.video_url })
    }
    if (lesson.content && lesson.content.length > 0) {
      acts.push({ type: 'read', title: 'Теория', content: lesson.content })
    }
    if (lesson.quiz && lesson.quiz.length > 0) {
      acts.push({ type: 'quiz', title: 'Мини-тест', questions: lesson.quiz })
    }
    return acts
  }, [lesson])

  const [step, setStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(() =>
    alreadyPassed ? new Set(activities.map((_, i) => i)) : new Set()
  )

  useEffect(() => {
    setStep(0)
    setCompletedSteps(
      isLessonComplete(id, lessonId)
        ? new Set(activities.map((_, i) => i))
        : new Set()
    )
    window.scrollTo(0, 0)
  }, [id, lessonId, activities])

  if (!course || !lesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Icon name="error_outline" className="text-[48px] text-slate-300 mb-3" />
        <p className="text-slate-500 mb-4">Урок не найден или недоступен</p>
        <Link to={`/app/courses/${id}`} className="text-indigo-600 font-semibold hover:underline">
          ← Вернуться к курсу
        </Link>
      </div>
    )
  }

  const handleStepComplete = () => {
    const newCompleted = new Set([...completedSteps, step])
    setCompletedSteps(newCompleted)

    if (newCompleted.size === activities.length) {
      startCourse(id)
      completeLesson(id, lessonId)
    }

    if (step < activities.length - 1) {
      setTimeout(() => {
        setStep(step + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 400)
    }
  }

  const goNext = () => {
    if (nextLesson) navigate(`/app/courses/${id}/lesson/${nextLesson.id}`)
    else navigate(`/certificate/${id}`)
  }

  const passed = completedSteps.size === activities.length && activities.length > 0
  const currentActivity = activities[step]

  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    amber:  'bg-amber-50 text-amber-600 border-amber-200',
    rose:   'bg-rose-50 text-rose-600 border-rose-200',
    blue:   'bg-blue-50 text-blue-600 border-blue-200',
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-[260px_1fr] gap-6">

        {/* Sidebar */}
        <aside className="h-fit lg:sticky lg:top-20 space-y-4">
          {/* Back */}
          <Link
            to={`/app/courses/${id}`}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 transition-colors"
          >
            <Icon name="arrow_back" className="text-[18px]" /> {course.title}
          </Link>

          {/* Lesson list */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 px-1">
              Уроки курса
            </p>
            <nav className="space-y-1">
              {courseLessons.map((l, i) => {
                const active = l.id === lessonId
                const complete = isLessonComplete(id, l.id)
                return (
                  <Link
                    key={l.id}
                    to={`/app/courses/${id}/lesson/${l.id}`}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-md grid place-items-center text-xs shrink-0 font-bold ${
                      complete
                        ? 'bg-emerald-500 text-white'
                        : active
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {complete ? <Icon name="check" className="text-[15px]" /> : i + 1}
                    </span>
                    <span className="line-clamp-2 text-xs">{l.title}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Activity steps */}
          {activities.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 px-1">
                Шаги урока
              </p>
              <div className="space-y-1">
                {activities.map((act, i) => {
                  const meta = ACTIVITY_META[act.type] || ACTIVITY_META.read
                  const done = completedSteps.has(i)
                  const current = step === i
                  return (
                    <button
                      key={i}
                      onClick={() => (done || i <= step) && setStep(i)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-left transition-all ${
                        current
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : done
                          ? 'text-emerald-600 hover:bg-emerald-50 cursor-pointer'
                          : 'text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md grid place-items-center shrink-0 ${
                        done ? 'bg-emerald-500 text-white' : current ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300'
                      }`}>
                        {done
                          ? <Icon name="check" className="text-[15px]" />
                          : <Icon name={meta.icon} className="text-[14px]" />
                        }
                      </span>
                      <span className="text-xs line-clamp-1">{meta.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </aside>

        {/* Main content */}
        <article className="min-w-0">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-400">
                Урок {lessonIndex + 1} из {courseLessons.length}
              </p>
              {passed && (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
                  <Icon name="check_circle" className="text-[18px]" filled /> Пройден
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-4">{lesson.title}</h1>

            {/* Activity step pills */}
            {activities.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {activities.map((act, i) => {
                  const meta = ACTIVITY_META[act.type] || ACTIVITY_META.read
                  const done = completedSteps.has(i)
                  const current = step === i
                  const col = meta.color
                  return (
                    <button
                      key={i}
                      onClick={() => (done || i <= step) && setStep(i)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        current
                          ? colorMap[col] + ' shadow-sm scale-105'
                          : done
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      <Icon name={done ? 'check' : meta.icon} className="text-[14px]" filled={done} />
                      {meta.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Activity panel */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-6">
            {currentActivity?.type === 'read' && (
              <ActivityRead
                activity={currentActivity}
                onComplete={handleStepComplete}
              />
            )}
            {currentActivity?.type === 'video' && (
              <ActivityVideo
                activity={currentActivity}
                onComplete={handleStepComplete}
              />
            )}
            {currentActivity?.type === 'flashcards' && (
              <ActivityFlashcards
                key={`flash-${lessonId}-${step}`}
                activity={currentActivity}
                onComplete={handleStepComplete}
              />
            )}
            {currentActivity?.type === 'match' && (
              <ActivityMatch
                key={`match-${lessonId}-${step}`}
                activity={currentActivity}
                onComplete={handleStepComplete}
              />
            )}
            {currentActivity?.type === 'quiz' && (
              <ActivityQuiz
                key={`quiz-${lessonId}-${step}`}
                activity={currentActivity}
                onComplete={handleStepComplete}
              />
            )}

            {/* Fallback: old lesson format with content + quiz */}
            {!activities.length && lesson.content && (
              <div>
                <div className="space-y-4 mb-8">
                  {lesson.content.map((p, i) => (
                    <p key={i} className="text-slate-700 leading-relaxed">{p}</p>
                  ))}
                </div>
                {/* Old quiz fallback */}
                {lesson.quiz?.length > 0 && (
                  <ActivityQuiz
                    activity={{ title: 'Мини-тест', questions: lesson.quiz.map(q => ({ ...q, options: q.options })) }}
                    onComplete={() => { completeLesson(id, lessonId) }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Passed + navigation */}
          {passed && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              {isLast ? (
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-6 text-center">
                  <p className="text-3xl mb-1">🎉</p>
                  <p className="text-xl font-extrabold mb-1">Курс завершён!</p>
                  <p className="text-white/80 text-sm mb-5">
                    Ты прошёл все уроки курса «{course.title}»
                  </p>
                  <Link
                    to={`/certificate/${id}`}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-colors shadow-lg"
                  >
                    <Icon name="workspace_premium" className="text-[22px]" filled /> Получить сертификат
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">Урок пройден! 🏆</p>
                    <p className="text-sm text-slate-400">Готов к следующему?</p>
                  </div>
                  <button
                    onClick={goNext}
                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    Следующий урок <Icon name="arrow_forward" className="text-[20px]" />
                  </button>
                </div>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
