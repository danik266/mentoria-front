import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Icon from './Icon'
import AIAssistant from './AIAssistant'

const navItems = [
  { to: '/app', icon: 'dashboard', label: 'Обзор', end: true },
  { to: '/app/courses', icon: 'menu_book', label: 'Курсы' },
  { to: '/app/opportunities', icon: 'explore', label: 'Возможности' },
  { to: '/app/profile', icon: 'person', label: 'Профиль' },
]

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  const displayName = user?.name || user?.email || 'Ученик'

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 shrink-0">
        <span className="w-9 h-9 rounded-xl bg-white/10 text-white grid place-items-center font-extrabold text-lg shrink-0">
          M
        </span>
        {!collapsed && (
          <span className="font-extrabold text-lg text-white whitespace-nowrap overflow-hidden">
            Mentoria <span className="text-indigo-300">Hub</span>
          </span>
        )}
      </div>

      {/* User card */}
      <div className={`mx-3 mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 ${collapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 grid place-items-center text-white font-bold text-sm shrink-0 shadow-lg shadow-indigo-500/20">
            {initials}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg shadow-indigo-500/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-400 rounded-r-full" />
                )}
                <Icon
                  name={item.icon}
                  className={`text-[22px] shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}
                  filled={isActive}
                />
                {!collapsed && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-3 mt-auto border-t border-white/5">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <Icon name="logout" className="text-[22px] shrink-0" />
          {!collapsed && <span>Выйти</span>}
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 transition-all duration-300 ease-in-out shrink-0 ${
          collapsed ? 'w-[76px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Icon name="menu" className="text-[24px]" />
            </button>

            {/* Desktop collapse */}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="hidden lg:flex p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title={collapsed ? 'Раскрыть меню' : 'Свернуть меню'}
            >
              <Icon name={collapsed ? 'menu_open' : 'menu'} className="text-[22px]" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <Icon name="waving_hand" className="text-[18px] text-amber-400" />
              <span>Привет, <span className="font-semibold text-slate-700">{user?.name || 'Ученик'}</span></span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 grid place-items-center text-white font-bold text-xs shadow-sm">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  )
}
