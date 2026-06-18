import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import ScrollReveal from '../components/ScrollReveal'
import InteractiveFinder from '../components/InteractiveFinder'
import Roadmap from '../components/Roadmap'
import Testimonials from '../components/Testimonials'
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
  const [activeFaq, setActiveFaq] = useState(null)

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
          <ScrollReveal animation="fade-in-left">
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
          </ScrollReveal>

          {/* Правая колонка — карточка дедлайнов */}
          <ScrollReveal animation="fade-in-right" delay={150}>
            <div className="rounded-3xl border border-slate-200/85 dark:border-white/10 bg-white dark:bg-slate-900/50 shadow-xl p-5 sm:p-7">
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
          </ScrollReveal>
        </div>
      </section>

      {/* ===== INTERACTIVE FINDER ===== */}
      <section className="py-10">
        <ScrollReveal animation="scale-in">
          <InteractiveFinder />
        </ScrollReveal>
      </section>

      {/* ===== SEARCH BY FIELD ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <ScrollReveal animation="fade-in-up">
          <h2 className="text-sm font-semibold text-brand mb-6">{t('home.searchByField')}</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((f, idx) => (
            <ScrollReveal key={f.key} animation="fade-in-up" delay={idx * 50}>
              <button
                onClick={() => go('/app/opportunities')}
                className="w-full group flex items-center gap-4 text-left p-4 sm:p-5 rounded-2xl border border-slate-200/85 dark:border-white/10 bg-white dark:bg-slate-900/50 hover:border-brand hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
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
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== ROADMAP ===== */}
      <section className="bg-white/10 dark:bg-slate-900/10">
        <Roadmap />
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-800/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-in-up" className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl tracking-tight">
              {t('home.stats.title')}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <ScrollReveal animation="scale-in" delay={0} className="w-full">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-100 dark:border-slate-800 p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300 shadow-sm">
                <p className="text-4xl sm:text-5xl font-black text-brand mb-2">1,500+</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">{t('home.stats.students')}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="scale-in" delay={100} className="w-full">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-100 dark:border-slate-800 p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300 shadow-sm">
                <p className="text-4xl sm:text-5xl font-black text-brand mb-2">120+</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">{t('home.stats.programs')}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="scale-in" delay={200} className="w-full">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-100 dark:border-slate-800 p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300 shadow-sm">
                <p className="text-4xl sm:text-5xl font-black text-brand mb-2">450+</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">{t('home.stats.certs')}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="scale-in" delay={300} className="w-full">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-100 dark:border-slate-800 p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300 shadow-sm">
                <p className="text-4xl sm:text-5xl font-black text-brand mb-2">95%</p>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">{t('home.stats.success')}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ScrollReveal animation="fade-in-up" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl tracking-tight mb-4">
            {t('home.features.title')}
          </h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <ScrollReveal animation="fade-in-up" delay={100} className="h-full">
            <div className="group h-full relative bg-white/60 dark:bg-slate-900/50 backdrop-blur border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl hover:shadow-xl hover:border-brand/40 hover:-translate-y-1 transition-all duration-300">
              <span className="w-12 h-12 rounded-2xl bg-brand/10 text-brand grid place-items-center mb-6 group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                <Icon name="notifications_active" className="text-[26px]" />
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {t('home.features.1.title')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                {t('home.features.1.desc')}
              </p>
            </div>
          </ScrollReveal>
          {/* Feature 2 */}
          <ScrollReveal animation="fade-in-up" delay={200} className="h-full">
            <div className="group h-full relative bg-white/60 dark:bg-slate-900/50 backdrop-blur border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl hover:shadow-xl hover:border-brand/40 hover:-translate-y-1 transition-all duration-300">
              <span className="w-12 h-12 rounded-2xl bg-brand/10 text-brand grid place-items-center mb-6 group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                <Icon name="auto_stories" className="text-[26px]" />
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {t('home.features.2.title')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                {t('home.features.2.desc')}
              </p>
            </div>
          </ScrollReveal>
          {/* Feature 3 */}
          <ScrollReveal animation="fade-in-up" delay={300} className="h-full">
            <div className="group h-full relative bg-white/60 dark:bg-slate-900/50 backdrop-blur border border-slate-100 dark:border-slate-800/80 p-8 rounded-3xl hover:shadow-xl hover:border-brand/40 hover:-translate-y-1 transition-all duration-300">
              <span className="w-12 h-12 rounded-2xl bg-brand/10 text-brand grid place-items-center mb-6 group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                <Icon name="verified" className="text-[26px]" />
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {t('home.features.3.title')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                {t('home.features.3.desc')}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-slate-50/20 dark:bg-slate-900/10">
        <Testimonials />
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-800/60 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-in-up" className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl tracking-tight">
              {t('home.faq.title')}
            </h2>
          </ScrollReveal>
          <div className="space-y-4">
            {[1, 2, 3].map((num, idx) => {
              const isOpen = activeFaq === num;
              return (
                <ScrollReveal key={num} animation="fade-in-up" delay={idx * 100}>
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : num)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-bold text-slate-800 dark:text-slate-100 hover:text-brand transition-colors"
                    >
                      <span>{t(`home.faq.${num}.q`)}</span>
                      <Icon 
                        name={isOpen ? "expand_less" : "expand_more"} 
                        className={`text-[24px] text-slate-400 dark:text-slate-600 transition-transform ${isOpen ? 'text-brand' : ''}`}
                      />
                    </button>
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? 'max-h-60 opacity-100 border-t border-slate-50 dark:border-slate-800/50' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="p-5 sm:p-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/50">
                        {t(`home.faq.${num}.a`)}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ScrollReveal animation="scale-in">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand to-brand-dark px-6 py-12 sm:px-12 sm:py-16 md:py-20 text-center shadow-xl shadow-brand/10">
            {/* Decorative floating blurred shapes */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
            
            <div className="relative max-w-2xl mx-auto flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {t('home.cta.title')}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-brand-soft/90 max-w-xl leading-relaxed">
                {t('home.cta.subtitle')}
              </p>
              <button
                onClick={() => go('/register')}
                className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-brand font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                {t('home.cta.btn')} <Icon name="rocket_launch" className="text-[20px]" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
