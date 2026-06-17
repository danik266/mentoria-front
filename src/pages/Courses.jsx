import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { getCourses, completedCount, getLessons, isCourseStarted } from '../utils/storage'

export default function Courses() {
  const courses = useMemo(() => getCourses(), [])
  const lessons = useMemo(() => getLessons(), [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Курсы</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">Асинхронные курсы — учись в удобное время</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const total = (lessons[course.id] || []).length || course.lessonsCount || 0
          const done = completedCount(course.id)
          const pct = total ? Math.round((done / total) * 100) : 0
          const started = isCourseStarted(course.id)

          return (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              {/* Обложка */}
              <div className={`h-36 bg-gradient-to-br ${course.gradient} relative overflow-hidden`}>
                {course.cover ? (
                  <img src={course.cover} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center">
                    <Icon name={course.icon} className="text-white text-[56px]" filled />
                  </div>
                )}
                <span className="absolute top-3 right-3 text-xs font-semibold bg-white/25 text-white px-2.5 py-1 rounded-full backdrop-blur">
                  {course.level}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">{course.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 flex-1">{course.description}</p>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <Icon name="menu_book" className="text-[16px]" /> {total} урока
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Icon name="signal_cellular_alt" className="text-[16px]" /> {course.level}
                  </span>
                </div>

                {started && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Прогресс</span>
                      <span className="font-semibold text-primary">{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}

                <Link
                  to={`/app/courses/${course.id}`}
                  className="mt-auto w-full py-2.5 rounded-xl bg-primary text-white text-center font-semibold text-sm hover:bg-primary-dark transition-colors"
                >
                  {started ? 'Продолжить' : 'Начать курс'}
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
