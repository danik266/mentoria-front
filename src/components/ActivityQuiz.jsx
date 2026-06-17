import { useState } from 'react'
import Icon from './Icon'

export default function ActivityQuiz({ activity, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const [retry, setRetry] = useState(0)

  const score = activity.questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0
  )
  const total = activity.questions.length
  const allCorrect = score === total
  const canCheck = Object.keys(answers).length === total

  const handleCheck = () => {
    setChecked(true)
  }

  const handleRetry = () => {
    setAnswers({})
    setChecked(false)
    setRetry(r => r + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl bg-rose-50 grid place-items-center">
          <Icon name="quiz" className="text-[22px] text-rose-500" filled />
        </span>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{activity.title}</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500">Ответь на все вопросы чтобы пройти этот блок</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full transition-all duration-500"
          style={{ width: `${(Object.keys(answers).length / total) * 100}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 text-right -mt-4">
        {Object.keys(answers).length} из {total} ответов
      </p>

      <div className="space-y-8">
        {activity.questions.map((q, qi) => (
          <div key={`${retry}-${qi}`} className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5">
            <p className="font-semibold text-slate-800 dark:text-white mb-4 flex items-start gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-soft text-brand-dark text-sm font-bold grid place-items-center shrink-0 mt-0.5">
                {qi + 1}
              </span>
              {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const selected = answers[qi] === oi
                const isCorrect = oi === q.correct
                let cls = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-brand-light hover:bg-brand-soft/40 cursor-pointer'
                if (checked) {
                  if (isCorrect) cls = 'border-emerald-400 bg-emerald-50'
                  else if (selected) cls = 'border-red-400 bg-red-50'
                  else cls = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 opacity-50'
                } else if (selected) {
                  cls = 'border-brand-light bg-brand-soft shadow-sm'
                }
                return (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${cls}`}
                  >
                    <input
                      type="radio"
                      name={`q-${retry}-${qi}`}
                      checked={selected}
                      disabled={checked}
                      onChange={() => !checked && setAnswers(a => ({ ...a, [qi]: oi }))}
                      className="accent-brand w-4 h-4 shrink-0"
                    />
                    <span className="text-slate-700 dark:text-slate-200 text-sm flex-1">{opt}</span>
                    {checked && isCorrect && <Icon name="check_circle" className="text-[20px] text-emerald-500 shrink-0" filled />}
                    {checked && selected && !isCorrect && <Icon name="cancel" className="text-[20px] text-red-500 shrink-0" filled />}
                  </label>
                )
              })}
            </div>
            {checked && q.explanation && (
              <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs text-amber-700"><strong>Объяснение:</strong> {q.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Result banner */}
      {checked && (
        <div className={`rounded-2xl p-5 flex items-center gap-4 ${allCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
          <span className={`w-12 h-12 rounded-xl grid place-items-center shrink-0 ${allCorrect ? 'bg-emerald-500' : 'bg-amber-500'}`}>
            <Icon name={allCorrect ? 'verified' : 'info'} className="text-[28px] text-white" filled />
          </span>
          <div>
            <p className={`font-bold text-lg ${allCorrect ? 'text-emerald-800' : 'text-amber-800'}`}>
              {allCorrect ? 'Отлично!' : `${score} из ${total} верно`}
            </p>
            <p className={`text-sm ${allCorrect ? 'text-emerald-600' : 'text-amber-600'}`}>
              {allCorrect ? 'Ты ответил правильно на все вопросы!' : 'Попробуй ещё раз — изучи ответы выше'}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={!canCheck}
            className="flex-1 py-3.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Проверить ответы
          </button>
        ) : !allCorrect ? (
          <button
            onClick={handleRetry}
            className="flex-1 py-3.5 rounded-xl border-2 border-brand-light text-brand-dark font-semibold hover:bg-brand-soft transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="refresh" className="text-[20px]" /> Попробовать снова
          </button>
        ) : null}

        {allCorrect && (
          <button
            onClick={onComplete}
            className="flex-1 py-3.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="task_alt" className="text-[22px]" filled /> Завершить урок!
          </button>
        )}
      </div>
    </div>
  )
}
