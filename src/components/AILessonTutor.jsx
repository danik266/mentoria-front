import { useState, useEffect } from 'react'
import Icon from './Icon'
import { API_BASE } from '../utils/api'

export default function AILessonTutor({ lessonTitle, courseTitle, content }) {
  const [explanation, setExplanation] = useState('')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false)
  const [taskAnswers, setTaskAnswers] = useState({})
  const [taskChecked, setTaskChecked] = useState({})

  const loadExplanation = async () => {
    if (loaded) { setOpen(true); return }
    setOpen(true)
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/ai/lesson-explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lesson_title: lessonTitle,
          course_title: courseTitle,
          content: content || [],
        }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setExplanation(data.explanation || '')
      setTasks(data.tasks || [])
      setLoaded(true)
    } catch {
      setExplanation('Не удалось загрузить объяснение. Проверь подключение к интернету.')
    } finally {
      setLoading(false)
    }
  }

  // Reset when lesson changes
  useEffect(() => {
    setLoaded(false)
    setExplanation('')
    setTasks([])
    setOpen(false)
    setTaskAnswers({})
    setTaskChecked({})
  }, [lessonTitle])

  return (
    <div className="mt-6 rounded-2xl border border-brand/20 overflow-hidden shadow-md shadow-brand/5">
      {/* Header — always visible */}
      <button
        onClick={open ? () => setOpen(false) : loadExplanation}
        className="w-full flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 hover:from-brand-soft hover:to-indigo-50 dark:hover:from-slate-700 dark:hover:to-slate-800 transition-all"
      >
        <div className="w-9 h-9 rounded-xl bg-brand grid place-items-center shrink-0 shadow-sm shadow-brand/30">
          <Icon name="auto_awesome" className="text-[18px] text-white" filled />
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold text-slate-800 dark:text-white text-sm">MentorAI</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {loaded ? 'Объяснение + задания готовы' : 'Объясни простыми словами + дай задания'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!loaded && !loading && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand text-white">
              Спросить ИИ
            </span>
          )}
          <Icon
            name={open ? 'expand_less' : 'expand_more'}
            className="text-[22px] text-slate-400"
          />
        </div>
      </button>

      {/* Expandable body */}
      {open && (
        <div className="bg-white dark:bg-slate-900 border-t border-brand/10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-500">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2.5 h-2.5 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-sm font-medium animate-pulse">Объясняю тему простыми словами...</p>
            </div>
          ) : (
            <div className="p-5 space-y-6">
              {/* Explanation */}
              {explanation && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="lightbulb" className="text-[18px] text-amber-500" filled />
                    <h3 className="font-bold text-slate-700 dark:text-white text-sm uppercase tracking-wide">
                      Простое объяснение
                    </h3>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-100 dark:border-amber-900/40">
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-sm">
                      {explanation}
                    </p>
                  </div>
                </div>
              )}

              {/* Tasks */}
              {tasks.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="edit_note" className="text-[18px] text-brand" filled />
                    <h3 className="font-bold text-slate-700 dark:text-white text-sm uppercase tracking-wide">
                      Практические задания
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {tasks.map((task, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                      >
                        <div className="flex gap-3 p-4">
                          <span className={`
                            w-7 h-7 rounded-lg grid place-items-center shrink-0 text-xs font-extrabold
                            ${i === 0 ? 'bg-emerald-100 text-emerald-700' : i === 1 ? 'bg-brand-soft text-brand' : 'bg-rose-100 text-rose-600'}
                          `}>
                            {i + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium">
                              {task}
                            </p>
                            {/* Answer input */}
                            <div className="mt-3 flex gap-2">
                              <textarea
                                rows={2}
                                placeholder="Напиши свой ответ здесь..."
                                value={taskAnswers[i] || ''}
                                onChange={(e) => setTaskAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                                className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand/40 transition"
                              />
                            </div>
                            {taskAnswers[i] && !taskChecked[i] && (
                              <button
                                onClick={() => setTaskChecked(prev => ({ ...prev, [i]: true }))}
                                className="mt-2 text-xs font-semibold px-3 py-1.5 bg-brand text-white rounded-lg hover:bg-brand-dark transition"
                              >
                                Отметить выполненным ✓
                              </button>
                            )}
                            {taskChecked[i] && (
                              <p className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                <Icon name="check_circle" className="text-[14px]" filled /> Отлично, задание выполнено!
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Refresh button */}
              <div className="flex justify-end">
                <button
                  onClick={() => { setLoaded(false); setExplanation(''); setTasks([]); loadExplanation() }}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand transition-colors"
                >
                  <Icon name="refresh" className="text-[16px]" /> Обновить объяснение
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
