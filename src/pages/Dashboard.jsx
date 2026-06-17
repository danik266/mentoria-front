import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { categoryColors } from '../data/mock'
import {
  getProfile,
  getCourses,
  getOpportunities,
  getSaved,
  completedCount,
  isCourseStarted,
  daysUntil,
  formatDate,
  urgencyColor,
  urgencyDot,
  getLessons,
} from '../utils/storage'

export default function Dashboard() {
  const profile = getProfile()
  const courses = useMemo(() => getCourses(), [])
  const allOps = useMemo(() => getOpportunities(), [])
  const savedIds = getSaved()

  // Секция 1 — начатые курсы
  const allLessons = useMemo(() => getLessons(), [])
  const startedCourses = courses
    .map((c) => {
      const total = (allLessons[c.id] || []).length || c.lessonsCount || 0
      const done = completedCount(c.id)
      return { ...c, total, done, pct: total ? Math.round((done / total) * 100) : 0 }
    })
    .filter((c) => isCourseStarted(c.id))

  // Секция 2 — сохранённые возможности
  const savedOps = allOps.filter((o) => savedIds.includes(o.id))

  // Секция 3 — ближайшие дедлайны (из всех, не завершённые)
  const upcoming = [...allOps]
    .filter((o) => daysUntil(o.deadline) >= 0)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
    .slice(0, 5)

  // Секция 4 — рекомендации по интересам
  const interests = profile?.interests || []
  const recommendations = (() => {
    if (interests.length === 0) return allOps.slice(0, 3)
    const matched = allOps.filter((o) => o.tags?.some((t) => interests.includes(t)))
    const pool = matched.length ? matched : allOps
    return pool.slice(0, 3)
  })()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Приветствие */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
        <p className="relative text-white/80 mb-1">Личный кабинет</p>
        <h1 className="relative text-3xl font-extrabold">
          Привет, {profile?.name || 'Ученик'}!
        </h1>
        <p className="relative text-white/90 mt-2">
          {profile
            ? `${profile.grade} класс · ${(profile.interests || []).join(', ') || 'интересы не выбраны'}`
            : 'Заполни профиль, чтобы получить персональные рекомендации'}
        </p>
        {!profile && (
          <Link
            to="/onboarding"
            className="relative inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-white text-primary font-semibold hover:bg-sky-soft transition-colors"
          >
            <Icon name="person_add" className="text-[20px]" /> Создать профиль
          </Link>
        )}
      </div>

      {/* Секция 1 — Мои курсы */}
      <Section title="Мои курсы" icon="play_lesson">
        {startedCourses.length === 0 ? (
          <Empty text="Ты ещё не начал ни одного курса" link="/app/courses" linkText="Выбрать курс" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {startedCourses.map((c) => (
              <Link
                key={c.id}
                to={`/app/courses/${c.id}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} grid place-items-center`}>
                    <Icon name={c.icon} className="text-white text-[26px]" filled />
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">{c.title}</p>
                    <p className="text-xs text-slate-400">
                      {c.done} из {c.total} уроков
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Прогресс</span>
                  <span className="font-semibold text-primary">{c.pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* Секция 2 — Сохранённые возможности */}
      <Section title="Сохранённые возможности" icon="favorite">
        {savedOps.length === 0 ? (
          <Empty
            text="Нет сохранённых возможностей"
            link="/opportunities"
            linkText="Открыть каталог"
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedOps.map((o) => {
              const days = daysUntil(o.deadline)
              return (
                <div
                  key={o.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                >
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      categoryColors[o.category] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {o.category}
                  </span>
                  <h4 className="font-bold text-slate-800 mt-3 mb-2">{o.title}</h4>
                  <p className={`text-sm font-medium flex items-center gap-1 ${urgencyColor(days)}`}>
                    <Icon name="schedule" className="text-[16px]" /> до {formatDate(o.deadline)}
                    {days >= 0 ? ` · ${days} дн.` : ' · завершено'}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </Section>

      {/* Секция 3 — Ближайшие дедлайны */}
      <Section title="Ближайшие дедлайны" icon="event">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
          {upcoming.map((o) => {
            const days = daysUntil(o.deadline)
            return (
              <div key={o.id} className="flex items-center gap-4 p-4">
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
      </Section>

      {/* Секция 4 — Рекомендации */}
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
                to="/opportunities"
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-primary transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      categoryColors[o.category] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {o.category}
                  </span>
                  <Icon name="auto_awesome" className="text-[18px] text-primary" filled />
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

function Section({ title, icon, subtitle, children }) {
  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Icon name={icon} className="text-[24px] text-primary" filled /> {title}
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
      <Link to={link} className="text-primary font-semibold hover:underline">
        {linkText} →
      </Link>
    </div>
  )
}
