import { useState, useMemo } from 'react'
import Icon from './Icon'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getEntryPath } from '../utils/storage'

export default function InteractiveFinder() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [selectedGrade, setSelectedGrade] = useState(10)
  const [selectedInterests, setSelectedInterests] = useState(['programming'])

  const interestsList = [
    { id: 'programming', label: '💻 Программирование', field: 'field.programming' },
    { id: 'business', label: '💼 Бизнес & Стартапы', field: 'field.business' },
    { id: 'math', label: '🧮 Математика', field: 'field.math' },
    { id: 'science', label: '🔬 Наука & STEM', field: 'field.science' },
    { id: 'english', label: '🇬🇧 Английский', field: 'field.english' },
  ]

  const toggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }

  // Данные для предложений
  const demoOpportunities = [
    {
      id: 'opt-1',
      title: 'Google Code-in Challenge',
      category: 'Хакатон',
      grades: [9, 10, 11],
      format: 'Онлайн',
      interest: 'programming',
      desc: 'Глобальное соревнование по программированию для школьников. Идеально подходит для портфолио.',
      icon: 'code'
    },
    {
      id: 'opt-2',
      title: 'NIS Math Olympiad',
      category: 'Олимпиада',
      grades: [8, 9, 10, 11],
      format: 'Гибрид',
      interest: 'math',
      desc: 'Престижная олимпиада по математике для оценки аналитических способностей.',
      icon: 'functions'
    },
    {
      id: 'opt-3',
      title: 'Astana Business Cup',
      category: 'Хакатон',
      grades: [10, 11],
      format: 'Офлайн',
      interest: 'business',
      desc: 'Кейс-чемпионат для молодых стартаперов и будущих предпринимателей.',
      icon: 'business_center'
    },
    {
      id: 'opt-4',
      title: 'STEM Camp Almaty',
      category: 'Летняя школа',
      grades: [8, 9, 10],
      format: 'Офлайн',
      interest: 'science',
      desc: 'Летний лагерь по инженерии, химии и космическим исследованиям.',
      icon: 'science'
    },
    {
      id: 'opt-5',
      title: 'English Debates & Writing Cup',
      category: 'Олимпиада',
      grades: [8, 9, 10, 11],
      format: 'Онлайн',
      interest: 'english',
      desc: 'Турнир по дебатам на английском языке для развития навыков публичных выступлений.',
      icon: 'language'
    }
  ]

  const matches = useMemo(() => {
    return demoOpportunities.filter(
      (opt) =>
        opt.grades.includes(selectedGrade) &&
        (selectedInterests.length === 0 || selectedInterests.includes(opt.interest))
    )
  }, [selectedGrade, selectedInterests])

  const go = (path) => navigate(getEntryPath(user, path))

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/40 shadow-xl p-6 sm:p-10 transition-all duration-500">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Управление */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">Интерактивный подборщик</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
              Найди идеальную программу за 2 клика
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Укажи свой класс и интересы, и мы мгновенно покажем подходящие мероприятия.
            </p>
          </div>

          {/* Шаг 1: Класс */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              1. Твой класс
            </label>
            <div className="flex gap-2.5">
              {[8, 9, 10, 11].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    selectedGrade === grade
                      ? 'bg-brand text-white shadow-lg shadow-brand/25 scale-[1.03]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700/80'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {/* Шаг 2: Интересы */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              2. Что тебе интересно?
            </label>
            <div className="flex flex-wrap gap-2">
              {interestsList.map((item) => {
                const active = selectedInterests.includes(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleInterest(item.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                      active
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Результат */}
        <div className="lg:col-span-7">
          <div className="relative rounded-2xl bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-sm min-h-[300px] flex flex-col justify-between overflow-hidden">
            {/* Декоративное пятно внутри */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand/5 dark:bg-brand/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex justify-between items-center mb-5">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Подходящие программы ({matches.length})
                </span>
              </div>

              {matches.length > 0 ? (
                <div className="space-y-4">
                  {matches.slice(0, 2).map((opt) => {
                    let badgeColor = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    let iconBg = 'bg-brand/10 text-brand'

                    if (opt.category === 'Олимпиада') {
                      badgeColor = 'bg-violet-100/80 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
                      iconBg = 'bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300'
                    } else if (opt.category === 'Хакатон') {
                      badgeColor = 'bg-amber-100/80 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                      iconBg = 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300'
                    } else if (opt.category === 'Летняя школа') {
                      badgeColor = 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      iconBg = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                    }

                    return (
                      <div
                        key={opt.id}
                        className="group flex flex-col sm:flex-row gap-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                      >
                        {/* Левая колонка — Иконка */}
                        <div className="flex items-start">
                          <span className={`w-11 h-11 grid place-items-center rounded-xl ${iconBg} shadow-sm transition-transform duration-300`}>
                            <Icon name={opt.icon} className="text-[22px]" />
                          </span>
                        </div>

                        {/* Правая колонка — Контент */}
                        <div className="flex-1 space-y-2">
                          {/* Бейджи в верхнем ряду */}
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${badgeColor}`}>
                              {opt.category}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {opt.format}
                            </span>
                          </div>

                          {/* Заголовок */}
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg leading-tight transition-colors">
                            {opt.title}
                          </h4>

                          {/* Описание */}
                          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-10 text-center space-y-3">
                  <span className="inline-block p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <Icon name="search" className="text-[30px]" />
                  </span>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Увы, под этот класс и интересы пока нет активных дедлайнов.
                  </p>
                  <p className="text-xs text-slate-400">
                    Попробуй выбрать другие сферы или сменить класс.
                  </p>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-6 border-t border-slate-50 dark:border-slate-850 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs text-slate-400 text-center sm:text-left">
                Мы регулярно добавляем новые возможности от партнеров
              </span>
              <button
                onClick={() => go('/app/opportunities')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-brand text-white font-bold text-xs hover:bg-brand-dark transition-colors shadow-sm"
              >
                Открыть весь список <Icon name="arrow_forward" className="text-[14px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
