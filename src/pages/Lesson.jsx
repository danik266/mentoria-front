import { useMemo, useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { getCourses, isLessonComplete, completeLesson, getLessons } from '../utils/storage'

export default function Lesson() {
  const { id, lessonId } = useParams()
  const navigate = useNavigate()

  const course = useMemo(() => getCourses().find((c) => c.id === id), [id])
  const lessons = useMemo(() => getLessons(), [])
  const courseLessons = lessons[id] || []
  const lessonIndex = courseLessons.findIndex((l) => l.id === lessonId)
  const lesson = courseLessons[lessonIndex]

  const isLast = lessonIndex === courseLessons.length - 1
  const nextLesson = courseLessons[lessonIndex + 1]

  // состояние теста
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const [passed, setPassed] = useState(isLessonComplete(id, lessonId))

  // сброс при смене урока
  useEffect(() => {
    setAnswers({})
    setChecked(false)
    setPassed(isLessonComplete(id, lessonId))
    window.scrollTo(0, 0)
  }, [id, lessonId])

  if (!course || !lesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Icon name="error_outline" className="text-[48px] text-slate-300 mb-3" />
        <p className="text-slate-500 mb-4">Урок не найден</p>
        <Link to={`/courses/${id}`} className="text-primary font-semibold hover:underline">
          ← К курсу
        </Link>
      </div>
    )
  }

  const score = lesson.quiz.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0),
    0
  )
  const allCorrect = score === lesson.quiz.length

  const handleCheck = () => {
    setChecked(true)
    if (score === lesson.quiz.length) {
      completeLesson(id, lessonId)
      setPassed(true)
    }
  }

  const goNext = () => {
    if (nextLesson) navigate(`/courses/${id}/lesson/${nextLesson.id}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Боковая навигация */}
        <aside className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 h-fit lg:sticky lg:top-20">
          <Link
            to={`/courses/${id}`}
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-4"
          >
            <Icon name="arrow_back" className="text-[18px]" /> {course.title}
          </Link>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 px-2">
            Уроки
          </p>
          <nav className="space-y-1">
            {courseLessons.map((l, i) => {
              const active = l.id === lessonId
              const complete = isLessonComplete(id, l.id)
              return (
                <Link
                  key={l.id}
                  to={`/courses/${id}/lesson/${l.id}`}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? 'bg-sky-soft text-primary font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-md grid place-items-center text-xs shrink-0 ${
                      complete
                        ? 'bg-accent text-white'
                        : active
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {complete ? <Icon name="check" className="text-[16px]" /> : i + 1}
                  </span>
                  <span className="line-clamp-1">{l.title}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Контент */}
        <article>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-6">
            <p className="text-sm font-semibold text-primary mb-1">
              Урок {lessonIndex + 1} из {courseLessons.length}
              {passed && (
                <span className="ml-2 inline-flex items-center gap-1 text-accent">
                  <Icon name="check_circle" className="text-[16px]" filled /> пройден
                </span>
              )}
            </p>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-6">{lesson.title}</h1>

            {/* Видео-плейсхолдер */}
            <div className="aspect-video bg-slate-100 rounded-2xl grid place-items-center mb-6 border border-slate-200">
              <div className="text-center text-slate-400">
                <span className="w-16 h-16 rounded-full bg-white shadow-sm grid place-items-center mx-auto mb-2">
                  <Icon name="play_arrow" className="text-[36px] text-primary" filled />
                </span>
                <p className="font-medium">Видео урока</p>
              </div>
            </div>

            {/* Текст */}
            <div className="prose prose-slate max-w-none space-y-4">
              {lesson.content.map((p, i) => (
                <p key={i} className="text-slate-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Тест */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Icon name="quiz" className="text-[24px] text-primary" /> Мини-тест
            </h2>
            <p className="text-sm text-slate-500 mb-6">Ответь на 3 вопроса, чтобы пройти урок</p>

            <div className="space-y-6">
              {lesson.quiz.map((q, qi) => (
                <div key={qi}>
                  <p className="font-semibold text-slate-800 mb-3">
                    {qi + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const selected = answers[qi] === oi
                      const isCorrect = oi === q.correct
                      let cls =
                        'border-slate-200 hover:border-primary/60 hover:bg-sky-soft/50'
                      if (checked) {
                        if (isCorrect) cls = 'border-accent bg-emerald-50'
                        else if (selected) cls = 'border-red-400 bg-red-50'
                        else cls = 'border-slate-200 opacity-60'
                      } else if (selected) {
                        cls = 'border-primary bg-sky-soft'
                      }
                      return (
                        <label
                          key={oi}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${cls}`}
                        >
                          <input
                            type="radio"
                            name={`q-${qi}`}
                            checked={selected}
                            disabled={checked}
                            onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                            className="accent-primary w-4 h-4"
                          />
                          <span className="text-slate-700 text-sm flex-1">{opt}</span>
                          {checked && isCorrect && (
                            <Icon name="check_circle" className="text-[20px] text-accent" filled />
                          )}
                          {checked && selected && !isCorrect && (
                            <Icon name="cancel" className="text-[20px] text-red-500" filled />
                          )}
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Результат */}
            {checked && (
              <div
                className={`mt-6 rounded-xl p-4 font-semibold flex items-center gap-2 ${
                  allCorrect ? 'bg-emerald-50 text-accent' : 'bg-amber-50 text-amber-700'
                }`}
              >
                <Icon name={allCorrect ? 'verified' : 'info'} className="text-[24px]" filled />
                Результат: {score} из {lesson.quiz.length}
                {!allCorrect && ' — попробуйте ещё раз, чтобы пройти урок'}
              </div>
            )}

            {/* Кнопки */}
            <div className="mt-6 flex flex-wrap gap-3">
              {!allCorrect ? (
                <button
                  onClick={handleCheck}
                  disabled={Object.keys(answers).length < lesson.quiz.length}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {checked ? 'Проверить снова' : 'Проверить ответы'}
                </button>
              ) : (
                <span className="px-5 py-3 rounded-xl bg-emerald-50 text-accent font-semibold inline-flex items-center gap-2">
                  <Icon name="task_alt" className="text-[22px]" filled /> Урок пройден!
                </span>
              )}

              {/* Следующий урок / завершение */}
              {allCorrect && !isLast && (
                <button
                  onClick={goNext}
                  className="px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-emerald-600 transition-colors inline-flex items-center gap-2"
                >
                  Следующий урок <Icon name="arrow_forward" className="text-[20px]" />
                </button>
              )}
            </div>

            {/* Завершение курса */}
            {allCorrect && isLast && (
              <div className="mt-6 bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6 text-center">
                <p className="text-2xl font-extrabold mb-1">Курс завершён!</p>
                <p className="text-white/90 mb-5">
                  Поздравляем! Ты прошёл все уроки курса «{course.title}».
                </p>
                <Link
                  to={`/certificate/${id}`}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-primary font-bold hover:bg-sky-soft transition-colors"
                >
                  <Icon name="workspace_premium" className="text-[22px]" filled /> Получить сертификат
                </Link>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
