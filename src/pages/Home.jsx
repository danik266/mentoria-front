import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { getOpportunities, getEntryPath, daysUntil } from '../utils/storage'

const localeMap = { ru: 'ru-RU', kk: 'kk-KZ', en: 'en-US' }

const fields = [
  { key: 'field.programming', icon: 'code' },
  { key: 'field.business', icon: 'business_center' },
  { key: 'field.finance', icon: 'payments' },
  { key: 'field.math', icon: 'functions' },
  { key: 'field.science', icon: 'science' },
  { key: 'field.english', icon: 'language' },
]

export default function Home() {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  const go = (appPath) => navigate(getEntryPath(user, appPath))

  // Ближайшие 4 дедлайна из реальных данных
  const upcoming = useMemo(() => {
    return getOpportunities()
      .filter((o) => daysUntil(o.deadline) >= 0)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 4)
  }, [])

  const formatShort = (dateStr) =>
    new Date(dateStr).toLocaleDateString(localeMap[lang] || 'en-US', {
      day: 'numeric',
      month: 'short',
    })

  const gradesRange = (grades) => {
    if (!grades?.length) return ''
    const min = Math.min(...grades)
    const max = Math.max(...grades)
    return min === max ? `${min}` : `${min}–${max}`
  }

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Левая колонка */}
          <div>
            <span className="text-sm font-semibold text-brand">{t('home.eyebrow')}</span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] sm:leading-[1.05]">
              {t('home.heroTitle')}
            </h1>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              {t('home.heroSubtitle')}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                onClick={() => go('/app/opportunities')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand text-white font-semibold shadow-sm hover:bg-brand-dark transition-all hover:-translate-y-0.5"
              >
                {t('home.cta.findPrograms')} <Icon name="arrow_forward" className="text-[20px]" />
              </button>
              <button
                onClick={() => go('/app/courses')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full font-semibold text-slate-700 dark:text-slate-200 hover:text-brand hover:bg-brand-soft dark:hover:bg-slate-800 transition-colors"
              >
                <Icon name="menu_book" className="text-[20px]" /> {t('home.cta.viewCourses')}
              </button>
            </div>
          </div>

          {/* Правая колонка — карточка дедлайнов */}
          <div className="rounded-3xl border border-white/50 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl shadow-slate-900/5 p-5 sm:p-7">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('home.deadlines.title')}
                </h2>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  {t('home.deadlines.subtitle')}
                </p>
              </div>
              <span className="text-brand">
                <Icon name="event" className="text-[26px]" />
              </span>
            </div>

            {/* Таймлайн */}
            <ol className="relative ml-1 border-l border-slate-200 dark:border-slate-700 space-y-7">
              {upcoming.map((o) => (
                <li key={o.id} className="relative pl-6">
                  <span className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-brand ring-4 ring-brand/15" />
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {formatShort(o.deadline)}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">
                      {t(`cat.${o.category}`)}
                    </span>
                  </div>
                  <h3 className="mt-1 font-semibold text-slate-900 dark:text-white">{o.title}</h3>
                  <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-500">
                    {t('home.grades')} {gradesRange(o.grades)} · {t(`fmt.${o.format}`)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ===== SEARCH BY FIELD ===== */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <h2 className="text-sm font-semibold text-brand mb-6">{t('home.searchByField')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((f) => (
              <button
                key={f.key}
                onClick={() => go('/app/opportunities')}
                className="group flex items-center gap-4 text-left p-4 sm:p-5 rounded-2xl border border-white/50 dark:border-white/10 bg-white/55 dark:bg-slate-900/50 backdrop-blur-md hover:border-brand hover:bg-white/80 dark:hover:bg-slate-900/70 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <span className="w-11 h-11 shrink-0 grid place-items-center rounded-xl bg-brand-soft text-brand dark:bg-brand/15 group-hover:bg-brand group-hover:text-white transition-colors">
                  <Icon name={f.icon} className="text-[24px]" />
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{t(f.key)}</span>
                <Icon
                  name="arrow_forward"
                  className="text-[20px] ml-auto text-slate-300 dark:text-slate-600 group-hover:text-brand transition-colors"
                />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
