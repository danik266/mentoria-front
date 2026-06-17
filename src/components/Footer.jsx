import Logo from './Logo'
import { useLanguage } from '../contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <Logo to="/" />
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('footer.tagline')}</p>
          <div className="text-center sm:text-right">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} Mentoria Hub. {t('footer.rights')}
            </p>
            <a
              href="/admin"
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-brand hover:underline transition-colors mt-1 inline-block"
            >
              {t('footer.admin')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
