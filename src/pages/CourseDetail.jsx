import { useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { getCourses, isLessonComplete, completedCount, getLessons } from '../utils/storage'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const course = useMemo(() => getCourses().find((c) => c.id === id), [id])
  const lessons = useMemo(() => getLessons(), [])
  const courseLessons = lessons[id] || []

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Icon name="error_outline" className="text-[48px] text-slate-300 mb-3" />
        <p className="text-slate-500 mb-4">Курс не найден</p>
        <Link to="/courses" className="text-primary font-semibold hover:underline">
          ← К списку курсов
        </Link>
      </div>
    )
  }

  const total = courseLessons.length
  const done = completedCount(id)
  const pct = total ? Math.round((done / total) * 100) : 0

  // Первый непройденный урок (или последний, если все пройдены)
  const firstIncomplete =
    courseLessons.find((l) => !isLessonComplete(id, l.id)) || courseLessons[courseLessons.length - 1]

  // статус урока: done | current | locked
  const statusOf = (lesson, index) => {
    if (isLessonComplete(id, lesson.id)) return 'done'
    // текущий — первый непройденный
    const prevDone = index === 0 || isLessonComplete(id, courseLessons[index - 1].id)
    return prevDone ? 'current' : 'locked'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/courses"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-6"
      >
        <Icon name="arrow_back" className="text-[18px]" /> К курсам
      </Link>

      {/* Заголовок */}
      <div className={`rounded-3xl bg-gradient-to-br ${course.gradient} text-white p-8 mb-8 relative overflow-hidden`}>
        <Icon
          name={course.icon}
          className="text-[140px] absolute -right-4 -bottom-6 text-white/15"
          filled
        />
        <span className="relative inline-block text-xs font-semibold bg-white/25 px-3 py-1 rounded-full mb-3 backdrop-blur">
          {course.level}
        </span>
        <h1 className="relative text-3xl font-extrabold mb-2">{course.title}</h1>
        <p className="relative text-white/90 max-w-xl">{course.description}</p>

        <div className="relative mt-6 max-w-md">
          <div className="flex justify-between text-sm mb-1">
            <span>
              Пройдено {done} из {total}
            </span>
            <span className="font-semibold">{pct}%</span>
          </div>
          <div className="h-2.5 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Список уроков */}
      <h2 className="text-xl font-bold text-slate-800 mb-4">Программа курса</h2>
      <div className="space-y-3 mb-8">
        {courseLessons.map((lesson, index) => {
          const status = statusOf(lesson, index)
          const clickable = status !== 'locked'
          return (
            <button
              key={lesson.id}
              disabled={!clickable}
              onClick={() => clickable && navigate(`/courses/${id}/lesson/${lesson.id}`)}
              className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                clickable
                  ? 'bg-white border-slate-100 shadow-sm hover:border-primary hover:shadow-md cursor-pointer'
                  : 'bg-slate-50 border-slate-100 opacity-70 cursor-not-allowed'
              }`}
            >
              <span
                className={`w-10 h-10 rounded-xl grid place-items-center font-bold shrink-0 ${
                  status === 'done'
                    ? 'bg-accent text-white'
                    : status === 'current'
                    ? 'bg-primary text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {status === 'done' ? (
                  <Icon name="check" className="text-[22px]" />
                ) : status === 'locked' ? (
                  <Icon name="lock" className="text-[20px]" />
                ) : (
                  index + 1
                )}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">
                  Урок {index + 1}. {lesson.title}
                </p>
                <p className="text-xs text-slate-400">
                  {status === 'done'
                    ? 'Пройден'
                    : status === 'current'
                    ? 'Доступен сейчас'
                    : 'Заблокирован'}
                </p>
              </div>
              {clickable && <Icon name="chevron_right" className="text-[22px] text-slate-300" />}
            </button>
          )
        })}
      </div>

      {/* Кнопка действия */}
      <Link
        to={`/courses/${id}/lesson/${firstIncomplete.id}`}
        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
      >
        <Icon name="play_arrow" className="text-[22px]" filled />
        {done > 0 ? 'Продолжить курс' : 'Начать курс'}
      </Link>
    </div>
  )
}
