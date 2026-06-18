import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import Icon from '../components/Icon'
import { categoryColors } from '../data/mock'
import { API_BASE } from '../utils/api'
import EventCalendar from '../components/EventCalendar'
import {
  getProfile,
  getCourses,
  getOpportunities,
  getSaved,
  completedCount,
  daysUntil,
  formatDate,
  urgencyColor,
  isCourseStarted,
  removeCourseProgress,
  getLessons,
} from '../utils/storage'

export default function DashboardHome() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [refresh, setRefresh] = useState(0)
  
  // AI Welcome State
  const [showAIWelcome, setShowAIWelcome] = useState(false)
  const [aiMessage, setAiMessage] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const profile = getProfile()
  const courses = useMemo(() => getCourses(), [])
  const allOps = useMemo(() => getOpportunities(), [])
  const savedIds = getSaved()
  const allLessons = useMemo(() => getLessons(), [])

  useEffect(() => {
    // Check if we just finished onboarding
    const justOnboarded = localStorage.getItem('mh_just_onboarded')
    if (justOnboarded) {
      localStorage.removeItem('mh_just_onboarded')
      setShowAIWelcome(true)
      generateAIWelcome()
    }
  }, [])

  const generateAIWelcome = async () => {
    setAiLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: 'Я только что заполнил профиль. Напиши ОЧЕНЬ коротко (максимум 2-3 предложения). НЕ перечисляй мой профиль, я его и так знаю. Просто скажи "Привет" и сразу назови 1-2 конкретных курса или активности с платформы, которые идеально мне подходят. Без лишней воды и длинных списков.'
            }
          ]
        })
      })
      if (!res.ok) throw new Error('API Error')
      const data = await res.json()
      setAiMessage(data.reply)
    } catch (err) {
      setAiMessage('Привет! Твой профиль отлично выглядит. Рекомендую начать с каталога курсов и олимпиад ниже!')
    } finally {
      setAiLoading(false)
    }
  }

  const startedCourses = courses
    .map((c) => {
      const total = (allLessons[c.id] || []).length || c.lessonsCount || 0
      const done = completedCount(c.id)
      return { ...c, total, done, pct: total ? Math.round((done / total) * 100) : 0 }
    })
    .filter((c) => isCourseStarted(c.id))

  const savedOps = allOps.filter((o) => savedIds.includes(o.id))

  const upcoming = [...allOps]
    .filter((o) => daysUntil(o.deadline) >= 0)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
    .slice(0, 5)

  const interests = profile?.interests || []
  const recommendations = (() => {
    if (interests.length === 0) return allOps.slice(0, 3)
    const matched = allOps.filter((o) => o.tags?.some((t) => interests.includes(t)))
    const pool = matched.length ? matched : allOps
    return pool.slice(0, 3)
  })()

  const totalCourses = courses.length
  const completedCourses = startedCourses.filter((c) => c.pct === 100).length
  const activeCourses = startedCourses.filter((c) => c.pct < 100).length

  const displayName = user?.name || profile?.name || t('common.student')

  const profileMeta = profile
    ? `${profile.grade} ${t('dh.gradeWord')} · ${(profile.interests || []).join(', ') || t('dh.noInterests')}`
    : t('dh.fillProfilePrompt')

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* AI Welcome Banner */}
      {showAIWelcome && (
        <div className="mb-10 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-brand-dark to-slate-900 rounded-[2rem] p-6 sm:p-10 shadow-2xl shadow-brand/20 text-white">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3" />
          
          <button
            onClick={() => setShowAIWelcome(false)}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors z-10"
          >
            <Icon name="close" className="text-[24px]" />
          </button>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-light to-brand grid place-items-center shadow-lg shadow-brand/40 shrink-0">
                <Icon name="auto_awesome" className="text-[28px] text-white" filled />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Твой персональный план</h2>
                <p className="text-indigo-200 font-medium mt-1">Mentoria Hub AI проанализировал твой профиль</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Левая колонка: Текст от ИИ */}
              <div className="lg:col-span-2 flex flex-col h-full">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 h-full flex flex-col justify-center min-h-[200px]">
                  {aiLoading ? (
                    <div className="flex flex-col items-center justify-center text-white/70 gap-4">
                      <div className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-brand-light animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-3 h-3 rounded-full bg-brand-light animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-3 h-3 rounded-full bg-brand-light animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <p className="text-sm font-medium animate-pulse text-center">Анализируем интересы и время...</p>
                    </div>
                  ) : (
                    <div className="prose prose-sm sm:prose-base prose-invert max-w-none text-center sm:text-left">
                      {aiMessage.split('\n').map((line, i) => {
                        const cleanLine = line.replace(/\*\*(.*?)\*\*/g, '$1');
                        if (!cleanLine.trim()) return null;
                        return (
                          <p key={i} className="mb-3 last:mb-0 leading-relaxed text-indigo-50 sm:text-lg font-medium">
                            {cleanLine.startsWith('-') || cleanLine.startsWith('*') ? (
                              <span className="flex gap-2 items-start justify-center sm:justify-start">
                                <span className="text-brand-light font-bold mt-1">•</span>
                                <span>{cleanLine.replace(/^[-*]\s*/, '')}</span>
                              </span>
                            ) : (
                              cleanLine
                            )}
                          </p>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Правая колонка: Карточки с рекомендациями (Курсы и Активности) */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Icon name="rocket_launch" className="text-brand-light" filled /> 
                  Рекомендуем начать с этого:
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Показываем первый курс как рекомендацию */}
                  {courses[0] && (
                    <Link
                      to={`/app/courses/${courses[0].id}`}
                      className="group bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-5 hover:bg-white/20 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">Курс</span>
                        <Icon name="play_circle" className="text-[20px] text-white/50 group-hover:text-white transition-colors" filled />
                      </div>
                      <h4 className="font-bold text-white mb-2">{courses[0].title}</h4>
                      <p className="text-sm text-indigo-100/70 line-clamp-2">{courses[0].description}</p>
                    </Link>
                  )}
                  
                  {/* Показываем 1-2 топовые активности */}
                  {recommendations.slice(0, 2).map((o) => (
                    <Link
                      key={o.id}
                      to="/app/opportunities"
                      className="group bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-5 hover:bg-white/20 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand/30 text-brand-light border border-brand/50">
                          {o.category}
                        </span>
                        <Icon name="arrow_forward" className="text-[20px] text-white/50 group-hover:text-white transition-colors group-hover:translate-x-1" />
                      </div>
                      <h4 className="font-bold text-white mb-2">{o.title}</h4>
                      <p className={`text-xs font-medium ${urgencyColor(daysUntil(o.deadline))} drop-shadow-md`}>
                        до {formatDate(o.deadline)}
                      </p>
                    </Link>
                  ))}
                </div>

                {!aiLoading && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setShowAIWelcome(false)}
                      className="px-6 py-3 bg-brand hover:bg-brand-light text-white rounded-xl font-bold transition-colors shadow-lg shadow-brand/30 flex items-center gap-2 hover:scale-105 active:scale-95"
                    >
                      Начать обучение <Icon name="check_circle" className="text-[20px]" filled />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Welcome banner */}
      <div className="relative bg-gradient-to-r from-brand via-brand to-brand-dark text-white rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-brand-light/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-brand-soft text-sm font-medium mb-1">{t('dh.cabinet')}</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            {t('dh.greeting').replace('{name}', displayName)}
          </h1>
          <p className="text-brand-soft text-sm sm:text-base max-w-lg">
            {profileMeta}
          </p>
          {!profile && (
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-brand font-semibold text-sm hover:bg-brand-soft transition-colors shadow-lg shadow-brand/20"
            >
              <Icon name="person_add" className="text-[20px]" /> {t('dh.createProfile')}
            </Link>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="menu_book" label={t('dh.stat.total')} value={totalCourses} color="indigo" />
        <StatCard icon="trending_up" label={t('dh.stat.active')} value={activeCourses} color="amber" />
        <StatCard icon="check_circle" label={t('dh.stat.completed')} value={completedCourses} color="emerald" />
        <StatCard icon="bookmark" label={t('dh.stat.saved')} value={savedOps.length} color="purple" />
      </div>

      {/* My courses */}
      <Section title={t('dh.myCourses')} icon="play_lesson">
        {startedCourses.length === 0 ? (
          <Empty text={t('dh.empty.courses')} link="/app/courses" linkText={t('dh.chooseCourse')} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {startedCourses.map((c) => (
              <div key={c.id} className="relative group h-full">
                <Link
                  to={`/app/courses/${c.id}`}
                  className="block h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 hover:shadow-lg hover:border-brand-soft transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4 pr-6">
                    <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} grid place-items-center shadow-md group-hover:scale-105 transition-transform overflow-hidden shrink-0`}>
                      {c.cover ? (
                        <img src={c.cover} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Icon name={c.icon} className="text-white text-[26px]" filled />
                      )}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white line-clamp-2 leading-tight">{c.title}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {t('dh.lessonsProgress').replace('{done}', c.done).replace('{total}', c.total)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 mt-auto">
                    <span>{t('dh.progress')}</span>
                    <span className="font-semibold text-brand">{c.pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full transition-all duration-500" style={{ width: `${c.pct}%` }} />
                  </div>
                </Link>
                
                {/* Кнопка сброса прогресса */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm(t('dh.resetConfirm'))) {
                      removeCourseProgress(c.id);
                      setRefresh(r => r + 1);
                    }
                  }}
                  className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                  title={t('dh.removeFromMy')}
                >
                  <Icon name="delete" className="text-[20px]" filled />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Calendar */}
      <Section title={t('dh.calendar')} icon="calendar_month">
        <EventCalendar opportunities={allOps} />
      </Section>

      {/* Recommendations */}
      <Section
        title={t('dh.recommendations')}
        icon="auto_awesome"
        subtitle={
          interests.length
            ? t('dh.recoBasedOn').replace('{interests}', interests.join(', '))
            : t('dh.recoFillProfile')
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.map((o) => {
            const days = daysUntil(o.deadline)
            return (
              <Link
                key={o.id}
                to="/app/opportunities"
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 hover:shadow-lg hover:border-brand-soft transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      categoryColors[o.category] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {t('cat.' + o.category)}
                  </span>
                  <Icon name="auto_awesome" className="text-[18px] text-brand group-hover:rotate-12 transition-transform" filled />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-2">{o.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">{o.description}</p>
                <p className={`text-xs font-medium ${urgencyColor(days)}`}>
                  {t('dh.until')} {formatDate(o.deadline)}
                </p>
              </Link>
            )
          })}
        </div>
      </Section>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  const colorMap = {
    indigo: 'bg-brand-soft text-brand',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-brand-soft text-brand-dark',
  }
  const iconBg = colorMap[color] || colorMap.indigo

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl ${iconBg} grid place-items-center mb-3`}>
        <Icon name={icon} className="text-[22px]" filled />
      </div>
      <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{value}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}

function Section({ title, icon, subtitle, children }) {
  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Icon name={icon} className="text-[24px] text-brand" filled /> {title}
        </h2>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function Empty({ text, link, linkText }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
      <p className="text-slate-500 dark:text-slate-400 mb-3">{text}</p>
      <Link to={link} className="text-brand font-semibold hover:underline">
        {linkText} →
      </Link>
    </div>
  )
}
