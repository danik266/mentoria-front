import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import OpportunityCard from '../components/OpportunityCard'
import { categories, formats, categoryColors } from '../data/mock'
import { getOpportunities, formatDate, daysUntil, isSaved, toggleSaved } from '../utils/storage'

const grades = [8, 9, 10, 11]

export default function Opportunities() {
  const allOps = useMemo(() => getOpportunities(), [])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [grade, setGrade] = useState('all')
  const [format, setFormat] = useState('all')
  const [selected, setSelected] = useState(null)
  const [savedTick, setSavedTick] = useState(0)

  const filtered = useMemo(() => {
    return allOps.filter((op) => {
      if (query && !op.title.toLowerCase().includes(query.toLowerCase())) return false
      if (category !== 'all' && op.category !== category) return false
      if (grade !== 'all' && !op.grades.includes(Number(grade))) return false
      if (format !== 'all' && op.format !== format) return false
      return true
    })
  }, [allOps, query, category, grade, format])

  const reset = () => {
    setQuery('')
    setCategory('all')
    setGrade('all')
    setFormat('all')
  }

  const FilterGroup = ({ label, value, setValue, options }) => (
    <div>
      <p className="text-sm font-semibold text-slate-700 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setValue('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            value === 'all' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Все
        </button>
        {options.map((o) => (
          <button
            key={o}
            onClick={() => setValue(String(o))}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              String(value) === String(o)
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Каталог возможностей</h1>
        <p className="text-slate-600 mt-2">
          {filtered.length} из {allOps.length} возможностей подходят под фильтры
        </p>
      </div>

      {/* Поиск */}
      <div className="relative mb-6">
        <Icon
          name="search"
          className="text-[22px] absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию…"
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Сайдбар фильтров */}
        <aside className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-fit space-y-5 lg:sticky lg:top-20">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Icon name="tune" className="text-[20px]" /> Фильтры
            </h2>
            <button onClick={reset} className="text-xs text-primary font-semibold hover:underline">
              Сбросить
            </button>
          </div>
          <FilterGroup label="Категория" value={category} setValue={setCategory} options={categories} />
          <FilterGroup label="Класс" value={grade} setValue={setGrade} options={grades} />
          <FilterGroup label="Формат" value={format} setValue={setFormat} options={formats} />
        </aside>

        {/* Сетка карточек */}
        <div>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-500">
              <Icon name="search_off" className="text-[48px] text-slate-300 mb-3" />
              <p>Ничего не найдено. Попробуйте изменить фильтры.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((op) => (
                <OpportunityCard
                  key={op.id}
                  op={op}
                  onDetails={setSelected}
                  onToggleSave={() => setSavedTick((t) => t + 1)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Модалка «Подробнее» */}
      {selected && (
        <DetailsModal
          op={selected}
          onClose={() => setSelected(null)}
          onToggleSave={() => setSavedTick((t) => t + 1)}
        />
      )}
    </div>
  )
}

function DetailsModal({ op, onClose, onToggleSave }) {
  const [saved, setSaved] = useState(isSaved(op.id))
  const days = daysUntil(op.deadline)
  const urgent = days < 7
  const badge = categoryColors[op.category] || 'bg-slate-100 text-slate-700'

  const handleSave = () => {
    toggleSaved(op.id)
    setSaved((s) => !s)
    onToggleSave?.()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge}`}>
              {op.category}
            </span>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <Icon name="close" className="text-[24px]" />
            </button>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-800 mb-3">{op.title}</h2>

          <div className={`flex items-center gap-1.5 font-medium mb-5 ${urgent ? 'text-red-600' : 'text-slate-500'}`}>
            <Icon name="schedule" className="text-[20px]" />
            Дедлайн: до {formatDate(op.deadline)}
            {days >= 0 ? ` (осталось ${days} дн.)` : ' (завершено)'}
          </div>

          <p className="text-slate-600 leading-relaxed mb-5">{op.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Классы</p>
              <p className="font-semibold text-slate-700">{op.grades.join(', ')}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Формат</p>
              <p className="font-semibold text-slate-700">{op.format}</p>
            </div>
          </div>

          <div className="bg-sky-soft rounded-xl p-4 mb-6">
            <p className="text-xs text-primary font-semibold mb-1">Требования</p>
            <p className="text-sm text-slate-700">{op.requirements}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className={`flex-1 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
                saved
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-sky-soft text-primary hover:bg-primary hover:text-white'
              }`}
            >
              <Icon name="favorite" className="text-[20px]" filled={saved} />
              {saved ? 'Сохранено' : 'Сохранить'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
