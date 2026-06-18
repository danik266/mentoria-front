import { useState } from 'react'
import Icon from './Icon'
import { useLanguage } from '../contexts/LanguageContext'
import { categoryColors } from '../data/mock'
import { daysUntil, formatDate, isSaved, toggleSaved } from '../utils/storage'

export default function OpportunityCard({ op, onDetails, onToggleSave }) {
  const { t } = useLanguage()
  const [saved, setSaved] = useState(isSaved(op.id))
  const days = daysUntil(op.deadline)
  const urgent = days < 7
  const badge = categoryColors[op.category] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'

  const handleSave = () => {
    toggleSaved(op.id)
    setSaved((s) => !s)
    onToggleSave?.()
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge}`}>
          {t('cat.' + op.category)}
        </span>
        <button
          onClick={handleSave}
          aria-label={t('opp.save')}
          className={`shrink-0 transition-transform hover:scale-110 ${
            saved ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'
          }`}
        >
          <Icon name="favorite" className="text-[24px]" filled={saved} />
        </button>
      </div>

      <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-snug mb-2">{op.title}</h3>

      <div className={`flex items-center gap-1.5 text-sm font-medium mb-3 ${urgent ? 'text-red-600' : 'text-slate-500 dark:text-slate-400'}`}>
        <Icon name="schedule" className="text-[18px]" />
        <span>
          {t('card.until')} {formatDate(op.deadline)}
          {urgent && days >= 0 && ` ${t('card.daysLeftShort').replace('{n}', days)}`}
          {days < 0 && ` ${t('card.finishedShort')}`}
        </span>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-3 flex-1">{op.description}</p>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
        <span className="inline-flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-md">
          <Icon name="groups" className="text-[16px]" /> {op.grades.join(', ')} {t('card.gradeSuffix')}
        </span>
        <span className="inline-flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded-md">
          <Icon name="public" className="text-[16px]" /> {t('fmt.' + op.format)}
        </span>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        <span className="font-semibold text-slate-600 dark:text-slate-300">{t('card.requirements')}</span> {op.requirements}
      </div>

      <button
        onClick={() => onDetails?.(op)}
        className="mt-auto w-full py-2.5 rounded-xl bg-sky-soft text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
      >
        {t('card.details')}
      </button>
    </div>
  )
}
