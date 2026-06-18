import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { getProfile, saveProfile } from '../utils/storage'
import { interestsList, goalsList } from '../data/mock'
import Icon from '../components/Icon'

export default function Profile() {
  const { user, logout, botUsername } = useAuth()
  const { t } = useLanguage()

  const [profile, setProfile] = useState(() => getProfile() || {})
  const [name, setName] = useState(profile.name || user?.name || '')
  const [grade, setGrade] = useState(profile.grade || 8)
  const [interests, setInterests] = useState(profile.interests || [])
  const [goals, setGoals] = useState(profile.goals || [])
  const [telegram, setTelegram] = useState(profile.telegram || '')
  const [emailNotifications, setEmailNotifications] = useState(profile.email_notifications !== false)
  const [telegramNotifications, setTelegramNotifications] = useState(profile.telegram_notifications !== false)
  const [emailCerts, setEmailCerts] = useState(profile.email_certs !== false)
  const [telegramCerts, setTelegramCerts] = useState(profile.telegram_certs !== false)
  const [saved, setSaved] = useState(false)

  const toggleInterest = (item) =>
    setInterests((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))

  const toggleGoal = (item) =>
    setGoals((prev) => (prev.includes(item) ? prev.filter((g) => g !== item) : [...prev, item]))

  const handleSave = () => {
    const updated = {
      name,
      grade: Number(grade),
      interests,
      goals,
      telegram,
      email_notifications: emailNotifications,
      telegram_notifications: telegramNotifications,
      email_certs: emailCerts,
      telegram_certs: telegramCerts
    }
    saveProfile(updated)
    setProfile(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">{t('prof.title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('prof.subtitle')}</p>
      </div>

      {/* Avatar & Account info */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 mb-6">
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
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{name || t('prof.noName')}</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500">{user?.email || t('prof.noEmail')}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-600 font-medium">{t('prof.accountActive')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-slate-800 dark:text-white text-base mb-4 flex items-center gap-2">
          <Icon name="badge" className="text-[22px] text-brand" filled />
          {t('prof.personalData')}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">{t('prof.name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('prof.namePlaceholder')}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand-light transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">{t('prof.grade')}</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand-light transition-all"
            >
              {[8, 9, 10, 11].map((g) => (
                <option key={g} value={g}>
                  {g} {t('prof.gradeSuffix')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-slate-800 dark:text-white text-base mb-1 flex items-center gap-2">
          <Icon name="interests" className="text-[22px] text-brand" filled />
          {t('prof.interests')}
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">{t('prof.interestsHint')}</p>
        <div className="flex flex-wrap gap-2">
          {interestsList.map((item) => {
            const active = interests.includes(item)
            return (
              <button
                key={item}
                onClick={() => toggleInterest(item)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active
                  ? 'bg-brand text-white shadow-md shadow-brand/20 scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-soft hover:bg-brand-soft'
                  }`}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      {/* Goals */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-slate-800 dark:text-white text-base mb-1 flex items-center gap-2">
          <Icon name="flag" className="text-[22px] text-brand" filled />
          {t('prof.goals')}
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">{t('prof.goalsHint')}</p>
        <div className="flex flex-wrap gap-2">
          {goalsList.map((item) => {
            const active = goals.includes(item)
            return (
              <button
                key={item}
                onClick={() => toggleGoal(item)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-[1.02]'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                  }`}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-slate-800 dark:text-white text-base mb-1 flex items-center gap-2">
          <Icon name="notifications" className="text-[22px] text-brand" filled />
          {t('prof.notifications')}
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
          {t('prof.notificationsHint')}
        </p>

        {/* Telegram Username */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            {t('prof.tgUsername')}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value.replace('@', ''))}
              placeholder="tihon2008"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand-light transition-all"
            />
            {telegram && (
              <a
                href={`https://t.me/${botUsername}?start=${user?.id || (user?.email ? user.email.replace('@', '_at_').replace(/\./g, '_dot_') : '')
                  }`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-brand-soft hover:bg-brand text-brand hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand/5"
              >
                {t('prof.connectBot')}
              </a>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            {t('prof.tgHint')}
          </p>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('prof.deadlineReminders')}</h4>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-700 text-brand focus:ring-brand"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{t('prof.emailChannel')}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={telegramNotifications}
                  onChange={(e) => setTelegramNotifications(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-700 text-brand focus:ring-brand"
                  disabled={!telegram}
                />
                <span className={`text-xs font-medium ${!telegram ? 'text-slate-300 dark:text-slate-600' : 'text-slate-600 dark:text-slate-300'}`}>Telegram</span>
              </label>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('prof.certsReceiving')}</h4>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailCerts}
                  onChange={(e) => setEmailCerts(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-700 text-brand focus:ring-brand"
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{t('prof.emailChannel')}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={telegramCerts}
                  onChange={(e) => setTelegramCerts(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-700 text-brand focus:ring-brand"
                  disabled={!telegram}
                />
                <span className={`text-xs font-medium ${!telegram ? 'text-slate-300 dark:text-slate-600' : 'text-slate-600 dark:text-slate-300'}`}>Telegram</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand to-brand text-white font-bold text-sm hover:from-brand hover:to-brand-light transition-all duration-300 shadow-lg shadow-brand/20 hover:-translate-y-0.5"
        >
          {t('prof.save')}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 animate-fade-in">
            <Icon name="check_circle" className="text-[20px]" filled />
            {t('prof.saved')}
          </span>
        )}
      </div>

      {/* Danger zone */}
      <div className="mt-10 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/30 p-6">
        <h3 className="font-bold text-red-800 dark:text-red-400 text-base mb-1 flex items-center gap-2">
          <Icon name="warning" className="text-[22px] text-red-500 dark:text-red-400" filled />
          {t('prof.dangerZone')}
        </h3>
        <p className="text-xs text-red-600/70 dark:text-red-400/70 mb-4">{t('prof.dangerHint')}</p>
        <button
          onClick={() => {
            if (confirm(t('prof.logoutConfirm'))) {
              logout()
            }
          }}
          className="px-6 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-900/40 dark:hover:text-red-300 dark:hover:border-red-800 transition-all duration-200"
        >
          {t('prof.logout')}
        </button>
      </div>
    </div>
  )
}
