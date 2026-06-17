import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { useLanguage } from '../contexts/LanguageContext'

// Компактный выбор языка для шапки.
export default function LanguageSwitcher({ className = '' }) {
  const { lang, setLang, t, languages } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = languages.find((l) => l.code === lang) || languages[0]

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t('lang.label')}
        className="flex items-center gap-1 pl-2.5 pr-2 h-9 rounded-full text-sm font-semibold text-slate-600 hover:text-brand hover:bg-brand-soft transition-colors"
      >
        <Icon name="language" className="text-[20px]" />
        <span className="min-w-[28px] text-left">{current.short}</span>
        <Icon
          name="expand_more"
          className={`text-[18px] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-100 bg-white shadow-lg shadow-slate-900/5 p-1.5 z-50">
          {languages.map((l) => {
            const active = l.code === lang
            return (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active ? 'text-brand bg-brand-soft' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{l.label}</span>
                {active && <Icon name="check" className="text-[18px]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
