import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'

const MONTHS_RU = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
]
const DAYS_RU = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

const CATEGORY_COLORS = {
  'Олимпиада':    { dot: 'bg-teal-400',   badge: 'bg-teal-100 text-teal-700',   icon: 'emoji_events' },
  'Хакатон':      { dot: 'bg-cyan-400',   badge: 'bg-cyan-100 text-cyan-700',   icon: 'code' },
  'Стипендия':    { dot: 'bg-emerald-400',badge: 'bg-emerald-100 text-emerald-700',icon: 'school' },
  'Летняя школа': { dot: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700', icon: 'wb_sunny' },
  'Стажировка':   { dot: 'bg-sky-400',    badge: 'bg-sky-100 text-sky-700',     icon: 'work' },
  'Открытый день':{ dot: 'bg-rose-400',   badge: 'bg-rose-100 text-rose-700',   icon: 'door_open' },
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfWeek(year, month) {
  // Monday=0, ..., Sunday=6
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

export default function EventCalendar({ opportunities = [] }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(null)

  // Build a map: 'YYYY-MM-DD' -> [opportunity, ...]
  const eventMap = useMemo(() => {
    const map = {}
    opportunities.forEach((op) => {
      if (op.deadline) {
        const key = op.deadline.slice(0, 10)
        if (!map[key]) map[key] = []
        map[key].push(op)
      }
    })
    return map
  }, [opportunities])

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDow = getFirstDayOfWeek(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
    setSelectedDay(null)
  }

  const selectedKey = selectedDay
    ? `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null
  const selectedEvents = selectedKey ? (eventMap[selectedKey] || []) : []

  // All events this month (for sidebar when nothing selected)
  const monthEvents = useMemo(() => {
    return Object.entries(eventMap)
      .filter(([key]) => {
        const [y, m] = key.split('-').map(Number)
        return y === viewYear && m === viewMonth + 1
      })
      .sort(([a], [b]) => a.localeCompare(b))
      .flatMap(([key, ops]) => ops.map(op => ({ ...op, _key: key })))
  }, [eventMap, viewYear, viewMonth])

  const displayEvents = selectedDay ? selectedEvents.map(op => ({ ...op, _key: selectedKey })) : monthEvents

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_320px]">
        {/* ── CALENDAR GRID ── */}
        <div className="p-6 border-r border-slate-100 dark:border-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-brand-soft dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <Icon name="chevron_left" className="text-[22px] text-slate-600 dark:text-slate-300" />
            </button>
            <div className="text-center">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
                {MONTHS_RU[viewMonth]} {viewYear}
              </h3>
            </div>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-brand-soft dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <Icon name="chevron_right" className="text-[22px] text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_RU.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDow }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const events = eventMap[key] || []
              const isToday =
                day === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear()
              const isSelected = selectedDay === day

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`
                    relative flex flex-col items-center justify-start pt-1.5 pb-1 rounded-xl mx-0.5 min-h-[52px] transition-all
                    ${isSelected
                      ? 'bg-brand text-white shadow-md shadow-brand/30'
                      : isToday
                        ? 'bg-brand/10 text-brand dark:text-brand-light'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }
                  `}
                >
                  <span className={`text-sm font-bold leading-none ${isToday && !isSelected ? 'underline decoration-2 decoration-brand underline-offset-2' : ''}`}>
                    {day}
                  </span>
                  {/* Event dots */}
                  {events.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                      {events.slice(0, 3).map((op, idx) => {
                        const col = CATEGORY_COLORS[op.category]
                        return (
                          <span
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/80' : col?.dot || 'bg-slate-400'}`}
                          />
                        )
                      })}
                      {events.length > 3 && (
                        <span className={`text-[9px] font-bold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>+{events.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 pt-4 border-t border-slate-50 dark:border-slate-800">
            {Object.entries(CATEGORY_COLORS).map(([cat, { dot }]) => (
              <div key={cat} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-xs text-slate-500 dark:text-slate-400">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── EVENTS SIDEBAR ── */}
        <div className="flex flex-col p-5 bg-slate-50/50 dark:bg-slate-800/30">
          <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            {selectedDay
              ? `${selectedDay} ${MONTHS_RU[viewMonth]} — события`
              : `${MONTHS_RU[viewMonth]} — все события`}
          </h4>

          {displayEvents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <Icon name="event_busy" className="text-[48px] text-slate-200 dark:text-slate-700 mb-3" />
              <p className="text-sm text-slate-400 dark:text-slate-500">
                {selectedDay ? 'Нет событий в этот день' : 'Нет событий в этом месяце'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[420px] pr-1">
              {displayEvents.map((op, idx) => {
                const col = CATEGORY_COLORS[op.category] || { badge: 'bg-slate-100 text-slate-700', icon: 'event' }
                const deadline = new Date(op._key)
                const diffMs = deadline.setHours(23, 59, 59) - Date.now()
                const daysLeft = Math.ceil(diffMs / 86400000)
                return (
                  <Link
                    key={`${op.id}-${idx}`}
                    to="/app/opportunities"
                    className="group bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 hover:border-brand/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.badge}`}>
                        {op.category}
                      </span>
                      <span className={`text-xs font-bold ${daysLeft <= 3 ? 'text-rose-500' : daysLeft <= 7 ? 'text-amber-500' : 'text-slate-400'}`}>
                        {daysLeft <= 0 ? 'Сегодня!' : `${daysLeft} дн.`}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm leading-snug mb-1 group-hover:text-brand transition-colors">
                      {op.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Icon name="calendar_today" className="text-[13px]" />
                      <span>{op._key.split('-').reverse().join('.')}</span>
                      {op.format && (
                        <>
                          <span>·</span>
                          <Icon name={op.format === 'Онлайн' ? 'videocam' : op.format === 'Гибрид' ? 'swap_horiz' : 'location_on'} className="text-[13px]" />
                          <span>{op.format}</span>
                        </>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
