import { Link } from 'react-router-dom'
import Icon from './Icon'

// Единый логотип: бирюзовая иконка-шляпка без подложки + название.
export default function Logo({ to = '/', size = 'md', subtitle = null, className = '' }) {
  const icon = size === 'lg' ? 'text-[34px]' : size === 'sm' ? 'text-[24px]' : 'text-[28px]'
  const text =
    size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-[17px]'

  const inner = (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Icon name="school" className={`text-brand ${icon}`} filled />
      <span className="leading-tight">
        <span className={`block font-extrabold ${text} text-slate-900 dark:text-white`}>
          Mentoria <span className="text-brand">Hub</span>
        </span>
        {subtitle && (
          <span className="block text-xs text-slate-500 dark:text-slate-400">{subtitle}</span>
        )}
      </span>
    </span>
  )

  if (!to) return inner
  return (
    <Link to={to} className="shrink-0">
      {inner}
    </Link>
  )
}
