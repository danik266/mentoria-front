import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, saveProfile } from '../utils/storage'
import { interestsList, goalsList } from '../data/mock'
import Icon from '../components/Icon'

export default function Profile() {
  const { user, logout } = useAuth()

  const [profile, setProfile] = useState(() => getProfile() || {})
  const [name, setName] = useState(profile.name || user?.name || '')
  const [grade, setGrade] = useState(profile.grade || 8)
  const [interests, setInterests] = useState(profile.interests || [])
  const [goals, setGoals] = useState(profile.goals || [])
  const [saved, setSaved] = useState(false)

  const toggleInterest = (item) =>
    setInterests((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))

  const toggleGoal = (item) =>
    setGoals((prev) => (prev.includes(item) ? prev.filter((g) => g !== item) : [...prev, item]))

  const handleSave = () => {
    const updated = { name, grade: Number(grade), interests, goals }
    saveProfile(updated)
    setProfile(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Настройки профиля</h1>
        <p className="text-slate-500 text-sm mt-1">Обновите ваши данные и предпочтения</p>
      </div>

      {/* Avatar & Account info */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-light to-brand-light grid place-items-center text-white text-2xl font-bold shadow-lg shadow-brand/20">
            {(name || user?.email || '?')
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{name || 'Без имени'}</h2>
            <p className="text-sm text-slate-400">{user?.email || 'email не указан'}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-600 font-medium">Аккаунт активен</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
          <Icon name="badge" className="text-[22px] text-brand" filled />
          Личные данные
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand-light transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">Класс</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand-light transition-all"
            >
              {[8, 9, 10, 11].map((g) => (
                <option key={g} value={g}>
                  {g} класс
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-slate-800 text-base mb-1 flex items-center gap-2">
          <Icon name="interests" className="text-[22px] text-brand" filled />
          Интересы
        </h3>
        <p className="text-xs text-slate-400 mb-4">Выберите области, которые вам интересны</p>
        <div className="flex flex-wrap gap-2">
          {interestsList.map((item) => {
            const active = interests.includes(item)
            return (
              <button
                key={item}
                onClick={() => toggleInterest(item)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-brand text-white shadow-md shadow-brand/20 scale-[1.02]'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-brand-soft hover:bg-brand-soft'
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      {/* Goals */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-slate-800 text-base mb-1 flex items-center gap-2">
          <Icon name="flag" className="text-[22px] text-brand" filled />
          Цели
        </h3>
        <p className="text-xs text-slate-400 mb-4">Что вы хотите достичь?</p>
        <div className="flex flex-wrap gap-2">
          {goalsList.map((item) => {
            const active = goals.includes(item)
            return (
              <button
                key={item}
                onClick={() => toggleGoal(item)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-[1.02]'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand to-brand text-white font-bold text-sm hover:from-brand hover:to-brand-light transition-all duration-300 shadow-lg shadow-brand/20 hover:-translate-y-0.5"
        >
          Сохранить изменения
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 animate-fade-in">
            <Icon name="check_circle" className="text-[20px]" filled />
            Сохранено!
          </span>
        )}
      </div>

      {/* Danger zone */}
      <div className="mt-10 bg-red-50 rounded-3xl border border-red-100 p-6">
        <h3 className="font-bold text-red-800 text-base mb-1 flex items-center gap-2">
          <Icon name="warning" className="text-[22px] text-red-500" filled />
          Опасная зона
        </h3>
        <p className="text-xs text-red-600/70 mb-4">Действия здесь необратимы</p>
        <button
          onClick={() => {
            if (confirm('Вы уверены что хотите выйти из аккаунта?')) {
              logout()
            }
          }}
          className="px-6 py-2.5 rounded-xl border border-red-200 bg-white text-red-600 font-semibold text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  )
}
