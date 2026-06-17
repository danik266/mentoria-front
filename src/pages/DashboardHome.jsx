import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Icon from '../components/Icon'
import { lessons, categoryColors } from '../data/mock'
import {
  getProfile,
  getCourses,
  getOpportunities,
  getSaved,
  completedCount,
  daysUntil,
  formatDate,
  urgencyColor,
  urgencyDot,
  isCourseStarted,
  removeCourseProgress,
} from '../utils/storage'

export default function DashboardHome() {
  const { user } = useAuth()
  const [refresh, setRefresh] = useState(0)
  const profile = getProfile()
  const courses = useMemo(() => getCourses(), [])
  const allOps = useMemo(() => getOpportunities(), [])
  const savedIds = getSaved()

  const startedCourses = courses
    .map((c) => {
      const total = (lessons[c.id] || []).length || c.lessonsCount || 0
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

  const displayName = user?.name || profile?.name || 'Ученик'

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <div className="relative bg-gradient-to-r from-brand via-brand to-brand-dark text-white rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-brand-light/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-brand-soft text-sm font-medium mb-1">Личный кабинет</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
            Привет, {displayName}!
          </h1>
          <p className="text-brand-soft text-sm sm:text-base max-w-lg">
            {profile
              ? `${profile.grade} класс · ${(profile.interests || []).join(', ') || 'интересы не выбраны'}`
              : 'Заполни профиль, чтобы получить персональные рекомендации'}
          </p>
          {!profile && (
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-white text-brand font-semibold text-sm hover:bg-brand-soft transition-colors shadow-lg shadow-brand/20"
            >
              <Icon name="person_add" className="text-[20px]" /> Создать профиль
            </Link>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="menu_book" label="Всего курсов" value={totalCourses} color="indigo" />
        <StatCard icon="trending_up" label="В процессе" value={activeCourses} color="amber" />
        <StatCard icon="check_circle" label="Завершено" value={completedCourses} color="emerald" />
        <StatCard icon="bookmark" label="Сохранено" value={savedOps.length} color="purple" />
      </div>

      {/* My courses */}
      <Section title="Мои курсы" icon="play_lesson">
        {startedCourses.length === 0 ? (
          <Empty text="Ты ещё не начал ни одного курса" link="/app/courses" linkText="Выбрать курс" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {startedCourses.map((c) => (
              <div key={c.id} className="relative group h-full">
                <Link
                  to={`/app/courses/${c.id}`}
                  className="block h-full bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-lg hover:border-brand-soft transition-all duration-300"
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
                      <p className="font-bold text-slate-800 line-clamp-2 leading-tight">{c.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {c.done} из {c.total} уроков
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5 mt-auto">
                    <span>Прогресс</span>
                    <span className="font-semibold text-brand">{c.pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full transition-all duration-500" style={{ width: `${c.pct}%` }} />
                  </div>
                </Link>
                
                {/* Кнопка сброса прогресса */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm('Сбросить весь прогресс и убрать этот курс из "Моих курсов"?')) {
                      removeCourseProgress(c.id);
                      setRefresh(r => r + 1);
                    }
                  }}
                  className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                  title="Убрать из моих курсов"
                >
                  <Icon name="delete" className="text-[20px]" filled />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Deadlines */}
      <Section title="Ближайшие дедлайны" icon="event">
        {upcoming.length === 0 ? (
          <Empty text="Нет предстоящих дедлайнов" link="/app/opportunities" linkText="Открыть каталог" />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            {upcoming.map((o) => {
              const days = daysUntil(o.deadline)
              return (
                <div key={o.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${urgencyDot(days)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{o.title}</p>
                    <p className="text-xs text-slate-400">{o.category}</p>
                  </div>
                  <div className={`text-right text-sm font-semibold ${urgencyColor(days)}`}>
                    <p>{formatDate(o.deadline)}</p>
                    <p className="text-xs">осталось {days} дн.</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Section>

      {/* Recommendations */}
      <Section
        title="Рекомендации для тебя"
        icon="auto_awesome"
        subtitle={
          interests.length
            ? `На основе интересов: ${interests.join(', ')}`
            : 'Заполни профиль для точных рекомендаций'
        }
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.map((o) => {
            const days = daysUntil(o.deadline)
            return (
              <Link
                key={o.id}
                to="/app/opportunities"
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-lg hover:border-brand-soft transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      categoryColors[o.category] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {o.category}
                  </span>
                  <Icon name="auto_awesome" className="text-[18px] text-brand group-hover:rotate-12 transition-transform" filled />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{o.title}</h4>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{o.description}</p>
                <p className={`text-xs font-medium ${urgencyColor(days)}`}>
                  до {formatDate(o.deadline)}
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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl ${iconBg} grid place-items-center mb-3`}>
        <Icon name={icon} className="text-[22px]" filled />
      </div>
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  )
}

function Section({ title, icon, subtitle, children }) {
  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Icon name={icon} className="text-[24px] text-brand" filled /> {title}
        </h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function Empty({ text, link, linkText }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
      <p className="text-slate-500 mb-3">{text}</p>
      <Link to={link} className="text-brand font-semibold hover:underline">
        {linkText} →
      </Link>
    </div>
  )
}
