import { useState, useEffect } from 'react'
import Icon from '../components/Icon'
import Logo from '../components/Logo'
import LanguageSwitcher from '../components/LanguageSwitcher'
import ThemeToggle from '../components/ThemeToggle'
import { useLanguage } from '../contexts/LanguageContext'
import { categories, formats } from '../data/mock'
import {
  getOpportunities,
  saveOpportunities,
  getCourses,
  saveCourses,
  getLessons,
  saveLessons,
  formatDate,
} from '../utils/storage'
import { API_BASE } from '../utils/api'

const PASSWORD = 'admin123'

export default function Admin() {
  const { t } = useLanguage()
  const [authed, setAuthed] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [errorText, setErrorText] = useState('')
  const [tab, setTab] = useState('opportunities')

  const [ops, setOps] = useState(() => getOpportunities())
  const [crs, setCrs] = useState(() => getCourses())
  const [analytics, setAnalytics] = useState(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  const [opModal, setOpModal] = useState(null)
  const [courseModal, setCourseModal] = useState(null)
  const [studentDetail, setStudentDetail] = useState(null)

  const login = async (e) => {
    e.preventDefault()
    if (adminCode !== 'admin123') {
      setErrorText(t('admin.login.errCode'))
      return
    }
    setErrorText('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.access_token)
        // Verify admin access by calling analytics
        const testRes = await fetch(`${API_BASE}/api/admin/analytics`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        })
        if (testRes.ok) {
          const analyticsData = await testRes.json()
          setAnalytics(analyticsData)
          setAuthed(true)
        } else {
          setErrorText(t('admin.login.errNoRights'))
          localStorage.removeItem('token')
        }
      } else {
        setErrorText(data.detail || t('admin.login.errCreds'))
      }
    } catch (err) {
      setErrorText(t('common.networkError'))
    }
  }

  // Fetch analytics when switching to analytics tab
  useEffect(() => {
    if (authed && tab === 'analytics') {
      fetchAnalytics()
    }
  }, [authed, tab])

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      } else {
        console.error("Failed to fetch analytics")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingAnalytics(false)
    }
  }

  // ---- Возможности ----
  const persistOps = (list) => {
    setOps(list)
    saveOpportunities(list)
  }
  
  const deleteOp = async (id) => {
    if (!confirm(t('admin.confirmDeleteOp'))) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/admin/opportunities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        persistOps(ops.filter((o) => o.id !== id))
      } else {
        alert(t('admin.errDeleteOp'))
      }
    } catch (e) {
      console.error(e)
      alert(t('admin.errConnection'))
    }
  }

  const saveOp = async (data) => {
    const isNew = !data.id
    const finalData = isNew ? { ...data, id: `op${Date.now()}` } : data
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/admin/opportunities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
      })
      if (res.ok) {
        const nextList = isNew ? [...ops, finalData] : ops.map((o) => (o.id === data.id ? finalData : o))
        persistOps(nextList)
        setOpModal(null)
      } else {
        alert(t('admin.errSaveOp'))
      }
    } catch (e) {
      console.error(e)
      alert(t('admin.errConnection'))
    }
  }

  // ---- Курсы ----
  const persistCrs = (list) => {
    setCrs(list)
    saveCourses(list)
  }

  const deleteCourse = async (id) => {
    if (!confirm(t('admin.confirmDeleteCourse'))) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        persistCrs(crs.filter((c) => c.id !== id))
        
        // Удаляем уроки из локального стейта уроков
        const lessonsMap = getLessons()
        delete lessonsMap[id]
        saveLessons(lessonsMap)
      } else {
        alert(t('admin.errDeleteCourse'))
      }
    } catch (e) {
      console.error(e)
      alert(t('admin.errConnection'))
    }
  }

  const saveCourse = async (data) => {
    const isNew = !data.id
    const finalData = isNew ? {
      ...data,
      id: `c${Date.now()}`,
      lessons: data.lessons || [],
      lessonsCount: (data.lessons || []).length
    } : {
      ...data,
      lessonsCount: (data.lessons || []).length
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/admin/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalData)
      })
      if (res.ok) {
        const nextList = isNew ? [...crs, finalData] : crs.map((c) => (c.id === data.id ? finalData : c))
        persistCrs(nextList)

        // Обновляем уроки локально
        const lessonsMap = getLessons()
        lessonsMap[finalData.id] = finalData.lessons || []
        saveLessons(lessonsMap)

        setCourseModal(null)
      } else {
        alert(t('admin.errSaveCourse'))
      }
    } catch (e) {
      console.error(e)
      alert(t('admin.errConnection'))
    }
  }

  // ---- Экран входа ----
  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="flex justify-center mb-6">
            <Logo to="/" size="lg" />
          </div>
          <span className="w-14 h-14 rounded-2xl bg-brand-soft text-brand grid place-items-center mx-auto mb-4">
            <Icon name="admin_panel_settings" className="text-[32px]" filled />
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{t('admin.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{t('admin.login.subtitle')}</p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-3xl border border-slate-100 dark:border-slate-800">
            <form className="space-y-5" onSubmit={login}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('admin.login.email')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mentoria.site"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('admin.login.password')}</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('admin.login.code')}</label>
                <input
                  type="password"
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="admin123"
                  className="input"
                />
              </div>

              {errorText && (
                <p className="text-sm text-red-600 font-semibold bg-red-50 border border-red-100 p-3 rounded-xl">
                  {errorText}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-dark transition-all transform hover:-translate-y-0.5 shadow-sm"
              >
                {t('admin.login.submit')}
              </button>
            </form>

            <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800 pt-4">
              <a href="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand transition-colors font-medium">
                {t('admin.login.back')}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---- Панель ----
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">{t('admin.title')}</h1>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setAuthed(false)}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand inline-flex items-center gap-1 ml-1"
          >
            <Icon name="logout" className="text-[18px]" /> {t('dash.logout')}
          </button>
        </div>
      </div>

      {/* Вкладки */}
      <div className="flex gap-1 sm:gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { key: 'opportunities', label: t('nav.opportunities'), icon: 'explore' },
          { key: 'courses', label: t('nav.courses'), icon: 'menu_book' },
          { key: 'analytics', label: t('admin.tab.analytics'), icon: 'monitoring' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 sm:px-4 py-2.5 font-semibold text-sm inline-flex items-center gap-1.5 border-b-2 -mb-px transition-colors whitespace-nowrap shrink-0 ${
              tab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <Icon name={t.icon} className="text-[20px]" /> {t.label}
          </button>
        ))}
      </div>

      {/* Возможности */}
      {tab === 'opportunities' && (
        <div>
          <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('admin.opp.count').replace('{n}', ops.length)}</p>
            <button
              onClick={() => setOpModal({})}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-emerald-600 transition-colors"
            >
              <Icon name="add" className="text-[20px]" /> {t('admin.opp.add')}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="text-left text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-4 py-3 font-medium">{t('admin.th.title')}</th>
                  <th className="px-4 py-3 font-medium">{t('admin.th.category')}</th>
                  <th className="px-4 py-3 font-medium">{t('admin.th.deadline')}</th>
                  <th className="px-4 py-3 font-medium">{t('admin.th.format')}</th>
                  <th className="px-4 py-3 font-medium text-right">{t('admin.th.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {ops.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{o.title}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{t('cat.' + o.category)}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(o.deadline)}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{t('fmt.' + o.format)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setOpModal(o)}
                          className="p-2 rounded-lg text-primary hover:bg-sky-soft"
                          title={t('admin.edit')}
                        >
                          <Icon name="edit" className="text-[20px]" />
                        </button>
                        <button
                          onClick={() => deleteOp(o.id)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                          title={t('admin.delete')}
                        >
                          <Icon name="delete" className="text-[20px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Курсы */}
      {tab === 'courses' && (
        <div>
          <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('admin.crs.count').replace('{n}', crs.length)}</p>
            <button
              onClick={() => {
                const lessonsMap = getLessons()
                setCourseModal({ lessons: [] })
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-emerald-600 transition-colors"
            >
              <Icon name="add" className="text-[20px]" /> {t('admin.crs.add')}
            </button>
          </div>

          <div className="space-y-3">
            {crs.map((c) => {
              // Привязываем сохраненные уроки
              const lessonsMap = getLessons()
              const courseLessons = lessonsMap[c.id] || c.lessons || []
              return (
                <div
                  key={c.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4 flex items-center gap-4"
                >
                  <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient || 'from-brand to-brand-light'} grid place-items-center shrink-0`}>
                    <Icon name={c.icon || 'menu_book'} className="text-white text-[24px]" filled />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-white">{c.title}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {c.level} · {t('admin.crs.lessonsCount').replace('{n}', courseLessons.length)}
                    </p>
                  </div>
                  <button
                    onClick={() => setCourseModal({ ...c, lessons: courseLessons })}
                    className="p-2 rounded-lg text-primary hover:bg-sky-soft"
                    title={t('admin.edit')}
                  >
                    <Icon name="edit" className="text-[20px]" />
                  </button>
                  <button
                    onClick={() => deleteCourse(c.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                    title={t('admin.delete')}
                  >
                    <Icon name="delete" className="text-[20px]" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Аналитика */}
      {tab === 'analytics' && (
        <div>
          {loadingAnalytics ? (
            <div className="text-center py-20 text-slate-400 dark:text-slate-500">
              <Icon name="cached" className="animate-spin text-[40px] mb-2" />
              <p>{t('admin.an.loading')}</p>
            </div>
          ) : analytics ? (
            <div>
              {/* Стат-карточки */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-brand-soft text-brand rounded-xl grid place-items-center mb-3">
                    <Icon name="groups" className="text-[24px]" />
                  </div>
                  <p className="text-3xl font-extrabold text-slate-800 dark:text-white">{analytics.total_students}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.an.totalStudents')}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl grid place-items-center mb-3">
                    <Icon name="how_to_reg" className="text-[24px]" />
                  </div>
                  <p className="text-3xl font-extrabold text-slate-800 dark:text-white">{analytics.active_students}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.an.activeStudents')}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl grid place-items-center mb-3">
                    <Icon name="done_all" className="text-[24px]" />
                  </div>
                  <p className="text-3xl font-extrabold text-slate-800 dark:text-white">{analytics.total_completed_lessons}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.an.completedLessons')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Список учеников */}
                <div className="lg:col-span-2">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Icon name="school" className="text-primary text-[22px]" /> {t('admin.an.students')}
                  </h3>
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
                    <table className="w-full min-w-[600px] text-sm">
                      <thead>
                        <tr className="text-left text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                          <th className="px-4 py-3 font-medium">{t('admin.an.thName')}</th>
                          <th className="px-4 py-3 font-medium">{t('admin.an.thGrade')}</th>
                          <th className="px-4 py-3 font-medium">{t('admin.an.thTests')}</th>
                          <th className="px-4 py-3 font-medium text-right">{t('admin.an.thDetails')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {analytics.students.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-slate-800 dark:text-white">{s.name}</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500">{s.email}</p>
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{s.grade} {t('admin.an.gradeSuffix')}</td>
                            <td className="px-4 py-3 font-medium text-brand">{s.completed_lessons}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => setStudentDetail(s)}
                                className="px-3 py-1.5 rounded-lg bg-sky-soft text-primary font-semibold text-xs hover:bg-brand-soft transition-colors"
                              >
                                {t('admin.an.progress')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Статистика по курсам */}
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Icon name="analytics" className="text-primary text-[22px]" /> {t('admin.an.coursePopularity')}
                  </h3>
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
                    {analytics.courses.map((c) => (
                      <div key={c.id} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        <p className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{c.title}</p>
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                          <span>{t('admin.an.started').replace('{n}', c.started_students)}</span>
                          <span>{t('admin.an.completed').replace('{n}', c.completed_students)}</span>
                        </div>
                        {/* Небольшой прогресс-бар */}
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full"
                            style={{
                              width: `${c.started_students > 0 ? (c.completed_students / c.started_students) * 100 : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 dark:text-slate-500">{t('admin.an.error')}</div>
          )}
        </div>
      )}

      {opModal !== null && (
        <OpportunityForm initial={opModal} onSave={saveOp} onClose={() => setOpModal(null)} />
      )}
      {courseModal !== null && (
        <CourseForm initial={courseModal} onSave={saveCourse} onClose={() => setCourseModal(null)} />
      )}
      {studentDetail !== null && (
        <StudentDetailModal student={studentDetail} onClose={() => setStudentDetail(null)} crs={crs} />
      )}
    </div>
  )
}

// ---------- Форма возможности ----------
function OpportunityForm({ initial, onSave, onClose }) {
  const { t } = useLanguage()
  const [form, setForm] = useState({
    id: initial.id,
    title: initial.title || '',
    category: initial.category || categories[0],
    deadline: initial.deadline || '',
    grades: initial.grades ? initial.grades.join(', ') : '',
    format: initial.format || formats[0],
    description: initial.description || '',
    requirements: initial.requirements || '',
    tags: initial.tags ? initial.tags.join(', ') : '',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    onSave({
      id: form.id,
      title: form.title,
      category: form.category,
      deadline: form.deadline,
      grades: form.grades
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n)),
      format: form.format,
      description: form.description,
      requirements: form.requirements,
      tags: form.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    })
  }

  return (
    <Modal title={form.id ? t('admin.opf.editTitle') : t('admin.opf.newTitle')} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label={t('admin.opf.title')}>
          <input
            required
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="input"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('admin.opf.category')}>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className="input">
              {categories.map((c) => (
                <option key={c} value={c}>{t('cat.' + c)}</option>
              ))}
            </select>
          </Field>
          <Field label={t('admin.opf.format')}>
            <select value={form.format} onChange={(e) => set('format', e.target.value)} className="input">
              {formats.map((f) => (
                <option key={f} value={f}>{t('fmt.' + f)}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('admin.opf.deadline')}>
            <input
              type="date"
              required
              value={form.deadline}
              onChange={(e) => set('deadline', e.target.value)}
              className="input"
            />
          </Field>
          <Field label={t('admin.opf.grades')}>
            <input
              value={form.grades}
              onChange={(e) => set('grades', e.target.value)}
              placeholder="9, 10, 11"
              className="input"
            />
          </Field>
        </div>
        <Field label={t('admin.opf.description')}>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            className="input resize-none"
          />
        </Field>
        <Field label={t('admin.opf.requirements')}>
          <input
            value={form.requirements}
            onChange={(e) => set('requirements', e.target.value)}
            className="input"
          />
        </Field>
        <Field label={t('admin.opf.tags')}>
          <input
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            placeholder="STEM, Математика"
            className="input"
          />
        </Field>
        <FormActions onClose={onClose} />
      </form>
    </Modal>
  )
}

// ---------- Форма курса + редактор уроков ----------
function CourseForm({ initial, onSave, onClose }) {
  const { t } = useLanguage()
  const [form, setForm] = useState({
    id: initial.id,
    title: initial.title || '',
    description: initial.description || '',
    level: initial.level || 'Начальный',
    icon: initial.icon || 'menu_book',
    gradient: initial.gradient || 'from-brand to-brand-light',
    tags: initial.tags ? initial.tags.join(', ') : '',
  })

  // Стейт списка уроков внутри курса
  const [lessons, setLessons] = useState(() => initial.lessons || [])
  const [activeLessonIndex, setActiveLessonIndex] = useState(null) // индекс редактируемого урока или null
  const [lessonForm, setLessonForm] = useState(null) // форма редактируемого урока

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      lessons,
      tags: form.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    })
  }

  // ---- Управление уроками ----
  const addLesson = () => {
    const newLesson = {
      id: `l${Date.now()}`,
      title: 'Новый урок',
      content: ['Текст абзаца 1.'],
      quiz: [
        { question: 'Вопрос 1', options: ['Вариант А', 'Вариант Б', 'Вариант В', 'Вариант Г'], correct: 0 },
        { question: 'Вопрос 2', options: ['Вариант А', 'Вариант Б', 'Вариант В', 'Вариант Г'], correct: 0 },
        { question: 'Вопрос 3', options: ['Вариант А', 'Вариант Б', 'Вариант В', 'Вариант Г'], correct: 0 }
      ]
    }
    setLessons([...lessons, newLesson])
    editLesson(lessons.length, newLesson)
  }

  const editLesson = (index, lesson) => {
    setActiveLessonIndex(index)
    setLessonForm({
      id: lesson.id,
      title: lesson.title,
      content: lesson.content.join('\n\n'),
      quiz: lesson.quiz.map(q => ({
        question: q.question,
        options: [...q.options],
        correct: q.correct
      }))
    })
  }

  const deleteLesson = (index) => {
    if (confirm(t('admin.crf.confirmDeleteLesson'))) {
      setLessons(lessons.filter((_, i) => i !== index))
      if (activeLessonIndex === index) {
        setActiveLessonIndex(null)
        setLessonForm(null)
      }
    }
  }

  const saveLessonDetails = () => {
    const updated = {
      id: lessonForm.id,
      title: lessonForm.title,
      content: lessonForm.content.split('\n\n').map(p => p.trim()).filter(Boolean),
      quiz: lessonForm.quiz
    }
    setLessons(lessons.map((l, i) => i === activeLessonIndex ? updated : l))
    setActiveLessonIndex(null)
    setLessonForm(null)
  }

  const updateQuizField = (qIdx, field, val) => {
    setLessonForm(prev => {
      const updatedQuiz = [...prev.quiz]
      updatedQuiz[qIdx] = { ...updatedQuiz[qIdx], [field]: val }
      return { ...prev, quiz: updatedQuiz }
    })
  }

  const updateQuizOption = (qIdx, optIdx, val) => {
    setLessonForm(prev => {
      const updatedQuiz = [...prev.quiz]
      const updatedOptions = [...updatedQuiz[qIdx].options]
      updatedOptions[optIdx] = val
      updatedQuiz[qIdx] = { ...updatedQuiz[qIdx], options: updatedOptions }
      return { ...prev, quiz: updatedQuiz }
    })
  }

  return (
    <Modal title={form.id ? t('admin.crf.editTitle') : t('admin.crf.newTitle')} onClose={onClose}>
      {lessonForm !== null ? (
        /* РЕДАКТОР КОНКРЕТНОГО УРОКА */
        <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 dark:text-white text-base">{t('admin.crf.editLesson').replace('{n}', activeLessonIndex + 1)}</h4>
            <button
              type="button"
              onClick={() => {
                setActiveLessonIndex(null)
                setLessonForm(null)
              }}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500"
            >
              {t('admin.cancel')}
            </button>
          </div>

          <Field label={t('admin.crf.lessonTitle')}>
            <input
              value={lessonForm.title}
              onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
              className="input"
              required
            />
          </Field>

          <Field label={t('admin.crf.lessonContent')}>
            <textarea
              value={lessonForm.content}
              onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
              rows={5}
              className="input resize-none text-sm"
              placeholder="Абзац 1...&#10;&#10;Абзац 2..."
            />
          </Field>

          {/* Редактор теста из 3 вопросов */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
            <h5 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{t('admin.crf.miniTest')}</h5>
            {lessonForm.quiz.map((q, qi) => (
              <div key={qi} className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl space-y-2">
                <Field label={t('admin.crf.question').replace('{n}', qi + 1)}>
                  <input
                    value={q.question}
                    onChange={(e) => updateQuizField(qi, 'question', e.target.value)}
                    className="input bg-white dark:bg-slate-900 text-sm"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <input
                      key={oi}
                      value={opt}
                      onChange={(e) => updateQuizOption(qi, oi, e.target.value)}
                      placeholder={t('admin.crf.option').replace('{n}', oi + 1)}
                      className="input bg-white dark:bg-slate-900 text-xs py-1.5"
                    />
                  ))}
                </div>
                <Field label={t('admin.crf.correctAnswer')}>
                  <select
                    value={q.correct}
                    onChange={(e) => updateQuizField(qi, 'correct', Number(e.target.value))}
                    className="input bg-white dark:bg-slate-900 text-xs py-1.5"
                  >
                    {q.options.map((_, oi) => (
                      <option key={oi} value={oi}>{t('admin.crf.optionLabel').replace('{n}', oi + 1).replace('{text}', q.options[oi])}</option>
                    ))}
                  </select>
                </Field>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={saveLessonDetails}
            className="w-full py-2.5 bg-accent hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors mt-4"
          >
            {t('admin.crf.applyLesson')}
          </button>
        </div>
      ) : (
        /* ОСНОВНАЯ ФОРМА КУРСА */
        <form onSubmit={submit} className="space-y-4">
          <Field label={t('admin.crf.courseTitle')}>
            <input required value={form.title} onChange={(e) => set('title', e.target.value)} className="input" />
          </Field>
          <Field label={t('admin.crf.description')}>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="input resize-none"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('admin.crf.level')}>
              <select value={form.level} onChange={(e) => set('level', e.target.value)} className="input">
                <option value="Начальный">{t('admin.crf.levelBeginner')}</option>
                <option value="Средний">{t('admin.crf.levelIntermediate')}</option>
                <option value="Продвинутый">{t('admin.crf.levelAdvanced')}</option>
              </select>
            </Field>
            <Field label={t('admin.crf.icon')}>
              <input
                value={form.icon}
                onChange={(e) => set('icon', e.target.value)}
                placeholder="functions"
                className="input"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('admin.crf.gradient')}>
              <input
                value={form.gradient}
                onChange={(e) => set('gradient', e.target.value)}
                placeholder="from-brand to-brand-light"
                className="input"
              />
            </Field>
            <Field label={t('admin.crf.tags')}>
              <input
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="STEM, Математика"
                className="input"
              />
            </Field>
          </div>

          {/* Менеджер Уроков */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">{t('admin.crf.lessonsManager').replace('{n}', lessons.length)}</h4>
              <button
                type="button"
                onClick={addLesson}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
              >
                <Icon name="add" className="text-[14px]" /> {t('admin.crf.addLesson')}
              </button>
            </div>

            {lessons.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">{t('admin.crf.noLessons')}</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {lessons.map((l, idx) => (
                  <div key={l.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">{t('admin.crf.lessonN').replace('{n}', idx + 1)}</span>
                    <span className="text-xs text-slate-800 dark:text-white font-semibold truncate flex-1 mx-3">{l.title}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => editLesson(idx, l)}
                        className="p-1 rounded-md hover:bg-slate-200 text-primary"
                        title={t('admin.crf.editLessonTip')}
                      >
                        <Icon name="edit" className="text-[16px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteLesson(idx)}
                        className="p-1 rounded-md hover:bg-slate-200 text-red-500"
                        title={t('admin.crf.deleteLessonTip')}
                      >
                        <Icon name="delete" className="text-[16px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <FormActions onClose={onClose} />
        </form>
      )}
    </Modal>
  )
}

// ---------- Модалка подробностей ученика ----------
function StudentDetailModal({ student, onClose, crs }) {
  const { t } = useLanguage()
  return (
    <Modal title={t('admin.sd.title').replace('{name}', student.name)} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">{t('admin.sd.email')}</p>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{student.email}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">{t('admin.sd.interests')}</p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {student.interests.length > 0 ? student.interests.map(i => (
              <span key={i} className="text-[10px] font-semibold bg-brand-soft text-brand px-2 py-0.5 rounded-full">{i}</span>
            )) : <span className="text-xs text-slate-400 dark:text-slate-500">{t('admin.sd.noInterests')}</span>}
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <p className="font-bold text-slate-800 dark:text-white text-sm mb-3">{t('admin.sd.courseProgress')}</p>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {crs.map(c => {
              const prog = student.progress[c.id] || {}
              const lessonsCount = (c.lessons || []).length
              const completedCount = Object.keys(prog).length
              const pct = lessonsCount ? Math.round((completedCount / lessonsCount) * 100) : 0
              
              if (completedCount === 0) return null

              return (
                <div key={c.id} className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-white mb-1">
                    <span>{c.title}</span>
                    <span>{completedCount} / {lessonsCount} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
            {Object.keys(student.progress).length === 0 && (
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">{t('admin.sd.noCourses')}</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ---------- Общие UI-кусочки ----------
function Modal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-600">
            <Icon name="close" className="text-[24px]" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 block">{label}</span>
      {children}
    </label>
  )
}

function FormActions({ onClose }) {
  const { t } = useLanguage()
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 py-3 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
      >
        {t('admin.cancel')}
      </button>
      <button
        type="submit"
        className="flex-1 py-3 rounded-xl font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
      >
        {t('admin.save')}
      </button>
    </div>
  )
}
