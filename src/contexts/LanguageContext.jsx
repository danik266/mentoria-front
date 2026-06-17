import { createContext, useContext, useEffect, useState } from 'react'
import { translations, LANGUAGES } from '../i18n/translations'

const LanguageContext = createContext()

export const useLanguage = () => useContext(LanguageContext)

const getInitialLang = () => {
  if (typeof window === 'undefined') return 'ru'
  const stored = localStorage.getItem('mh_lang')
  if (stored && translations[stored]) return stored
  const nav = (navigator.language || 'ru').slice(0, 2)
  return translations[nav] ? nav : 'ru'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    localStorage.setItem('mh_lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  // Перевод по ключу. Если ключа нет — падаем на русский, затем на сам ключ.
  const t = (key) => {
    const dict = translations[lang] || translations.ru
    return dict[key] ?? translations.ru[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}
