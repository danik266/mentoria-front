import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { getCourses, getProfile, formatDate } from '../utils/storage'

export default function Certificate() {
  const { courseId } = useParams()
  const course = useMemo(() => getCourses().find((c) => c.id === courseId), [courseId])
  const profile = getProfile()
  const name = profile?.name || 'Ученик'
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 flex flex-col items-center">
      {/* Панель действий (не печатается) */}
      <div className="no-print w-full max-w-3xl flex items-center justify-between mb-6">
        <Link
          to={course ? `/app/courses/${courseId}` : '/app/courses'}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Icon name="arrow_back" className="text-[18px]" /> Назад
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
        >
          <Icon name="download" className="text-[20px]" /> Скачать
        </button>
      </div>

      {/* Сертификат */}
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-sm p-3">
        <div className="border-4 border-primary rounded-sm p-2">
          <div className="border border-primary/30 rounded-sm px-6 sm:px-14 py-12 sm:py-16 text-center relative overflow-hidden">
            {/* Логотип */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="w-11 h-11 rounded-xl bg-primary text-white grid place-items-center font-extrabold text-2xl">
                M
              </span>
              <span className="font-extrabold text-2xl text-slate-800">
                Mentoria <span className="text-primary">Hub</span>
              </span>
            </div>

            <div className="w-16 h-px bg-primary/40 mx-auto mb-6" />

            <p className="uppercase tracking-[0.3em] text-sm text-slate-400 mb-2">Сертификат</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-8">
              об окончании курса
            </h1>

            <p className="text-slate-500 mb-2">Настоящим подтверждается, что</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-primary mb-2 border-b-2 border-slate-200 inline-block px-8 pb-2">
              {name}
            </p>

            <p className="text-slate-500 mt-6 mb-2">успешно завершил(а) курс</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-800 mb-10">
              «{course ? course.title : 'Курс Mentoria Hub'}»
            </p>

            <div className="flex items-end justify-between max-w-md mx-auto pt-6">
              <div className="text-center">
                <p className="font-semibold text-slate-700 border-t border-slate-300 pt-1 px-6">
                  {formatDate(today)} {new Date().getFullYear()}
                </p>
                <p className="text-xs text-slate-400 mt-1">Дата</p>
              </div>
              <div className="text-center">
                <p className="font-[cursive] text-2xl text-primary px-6">Mentoria</p>
                <p className="text-xs text-slate-400 border-t border-slate-300 pt-1">Подпись</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
