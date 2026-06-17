import Icon from './Icon'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()
  const { t } = useLanguage()

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? t('theme.toLight') : t('theme.toDark')}
      title={isDark ? t('theme.toLight') : t('theme.toDark')}
      className={`grid place-items-center w-9 h-9 rounded-full text-slate-500 dark:text-slate-300 hover:text-brand hover:bg-brand-soft dark:hover:bg-slate-800 transition-colors ${className}`}
    >
      <Icon name={isDark ? 'light_mode' : 'dark_mode'} className="text-[22px]" filled={isDark} />
    </button>
  )
}
