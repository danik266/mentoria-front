import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Icon from './Icon'

const links = []

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'text-primary bg-sky-soft' : 'text-slate-600 hover:text-primary hover:bg-sky-soft'
    }`

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="w-9 h-9 rounded-xl bg-primary text-white grid place-items-center shadow-sm font-extrabold text-lg">
              M
            </span>
            <span className="font-extrabold text-lg text-slate-800">
              Mentoria <span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Десктоп-ссылки */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Десктоп-кнопки */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-primary hover:bg-sky-soft rounded-lg transition-colors"
            >
              Панель управления
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-semibold text-primary hover:bg-sky-soft rounded-lg transition-colors"
            >
              Войти
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-sm"
            >
              Регистрация
            </button>
          </div>

          {/* Бургер */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setOpen((o) => !o)}
            aria-label="Меню"
          >
            <Icon name={open ? 'close' : 'menu'} className="text-[26px]" />
          </button>
        </div>
      </nav>

      {/* Мобильное меню */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={linkClass}
              style={{ display: 'block' }}
            >
              {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setOpen(false)
              navigate('/admin')
            }}
            className="w-full mt-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Панель управления
          </button>
          <button
            onClick={() => {
              setOpen(false)
              navigate('/register')
            }}
            className="w-full mt-2 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            Регистрация
          </button>
        </div>
      )}
    </header>
  )
}
