import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { getEntryPath } from '../utils/storage'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user } = useAuth()

  const go = (appPath) => navigate(getEntryPath(user, appPath))

  const navItems = [
    { label: t('nav.opportunities'), appPath: '/app/opportunities' },
    { label: t('nav.courses'), appPath: '/app/courses' },
  ]

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Логотип */}
          <Logo to="/" subtitle={t('brand.tagline')} />

          {/* Центр — ссылки */}
          <div className="hidden lg:flex items-center gap-1 mx-auto">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item.appPath)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand hover:bg-brand-soft dark:hover:bg-slate-800 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Право — действия */}
          <div className="hidden lg:flex items-center gap-1.5 ml-auto lg:ml-0">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand hover:bg-brand-soft dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <Icon name="admin_panel_settings" className="text-[18px]" /> {t('nav.dashboard')}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand transition-colors"
            >
              {t('nav.signin')}
            </button>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-dark rounded-full shadow-sm transition-all hover:-translate-y-0.5"
            >
              {t('nav.findPrograms')} <Icon name="arrow_forward" className="text-[18px]" />
            </button>
          </div>

          {/* Планшет/мобайл: тема + язык + бургер */}
          <div className="flex lg:hidden items-center gap-1 ml-auto">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              className="p-2 text-slate-600 dark:text-slate-300"
              onClick={() => setOpen((o) => !o)}
              aria-label={t('nav.menu')}
            >
              <Icon name={open ? 'close' : 'menu'} className="text-[26px]" />
            </button>
          </div>
        </div>
      </nav>

      {/* Мобильное меню */}
      {open && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setOpen(false)
                go(item.appPath)
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-brand-soft dark:hover:bg-slate-800 hover:text-brand transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              setOpen(false)
              navigate('/admin')
            }}
            className="w-full mt-2 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {t('nav.dashboard')}
          </button>
          <button
            onClick={() => {
              setOpen(false)
              navigate('/login')
            }}
            className="w-full mt-2 px-4 py-2.5 text-sm font-semibold text-brand bg-brand-soft dark:bg-slate-800 rounded-lg hover:bg-brand/10 transition-colors"
          >
            {t('nav.signin')}
          </button>
          <button
            onClick={() => {
              setOpen(false)
              navigate('/register')
            }}
            className="w-full mt-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand rounded-lg hover:bg-brand-dark transition-colors"
          >
            {t('nav.findPrograms')}
          </button>
        </div>
      )}
    </header>
  )
}
