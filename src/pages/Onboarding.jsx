import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Icon from '../components/Icon'
import Logo from '../components/Logo'
import { interestsList, goalsList } from '../data/mock'
import { saveProfile } from '../utils/storage'

const grades = [8, 9, 10, 11]

const TOTAL_STEPS = 4

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, botUsername } = useAuth()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [grade, setGrade] = useState(null)
  const [interests, setInterests] = useState([])
  const [goals, setGoals] = useState([])
  const [telegram, setTelegram] = useState('')

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const canNext =
    (step === 1 && grade !== null) ||
    (step === 2 && interests.length >= 1) ||
    step === 3 ||
    step === 4

  const finish = () => {
    saveProfile({
      name: name.trim() || 'Ученик',
      grade,
      interests,
      goals,
      telegram: telegram.trim().replace('@', ''),
      email_notifications: true,
      telegram_notifications: true,
      email_certs: true,
      telegram_certs: true,
    })
    navigate('/app')
  }

  const progress = (step / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-soft to-white flex flex-col">
      {/* Шапка */}
      <div className="max-w-2xl w-full mx-auto px-4 pt-10">
        <div className="flex items-center justify-center mb-8">
          <Logo to={null} />
        </div>

        {/* Прогресс-бар */}
        <div className="mb-2 flex justify-between text-sm font-medium text-slate-500">
          <span>Шаг {step} из {TOTAL_STEPS}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-10">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Карточка шага */}
      <div className="max-w-2xl w-full mx-auto px-4 pb-16 flex-1">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-1">Привет! Как тебя зовут?</h2>
              <p className="text-slate-500 mb-6">И выбери, в каком ты классе</p>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Твоё имя"
                className="w-full mb-8 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />

              <p className="font-semibold text-slate-700 mb-3">Выбери класс</p>
              <div className="grid grid-cols-4 gap-3">
                {grades.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`aspect-square rounded-2xl text-2xl font-bold border-2 transition-all ${grade === g
                        ? 'border-primary bg-primary text-white shadow-md scale-105'
                        : 'border-slate-200 text-slate-600 hover:border-primary'
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-1">Что тебе интересно?</h2>
              <p className="text-slate-500 mb-6">Выбери хотя бы одно направление</p>
              <div className="flex flex-wrap gap-3">
                {interestsList.map((item) => {
                  const active = interests.includes(item)
                  return (
                    <button
                      key={item}
                      onClick={() => toggle(interests, setInterests, item)}
                      className={`px-4 py-2.5 rounded-xl font-medium border-2 transition-all ${active
                          ? 'border-primary bg-primary text-white shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:border-primary'
                        }`}
                    >
                      {active && <Icon name="check" className="text-[16px] mr-1 align-middle" />}
                      {item}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-1">Какие у тебя цели?</h2>
              <p className="text-slate-500 mb-6">Можно выбрать несколько (или пропустить)</p>
              <div className="flex flex-wrap gap-3">
                {goalsList.map((item) => {
                  const active = goals.includes(item)
                  return (
                    <button
                      key={item}
                      onClick={() => toggle(goals, setGoals, item)}
                      className={`px-4 py-2.5 rounded-xl font-medium border-2 transition-all ${active
                          ? 'border-accent bg-accent text-white shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:border-accent'
                        }`}
                    >
                      {active && <Icon name="check" className="text-[16px] mr-1 align-middle" />}
                      {item}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 grid place-items-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-sky-500">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-2.04 9.613c-.148.658-.537.818-1.09.508l-3-2.21-1.447 1.392c-.16.16-.295.295-.604.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.56-4.456c.537-.194 1.006.131.918.605z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800">Подключи Telegram</h2>
                  <p className="text-slate-500 text-sm">Необязательно, но очень удобно</p>
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 mb-6">
                <p className="text-sm text-sky-800 font-medium mb-2">
                  🔔 Если добавишь Telegram, мы будем отправлять тебе:
                </p>
                <ul className="space-y-1.5">
                  {[
                    '⏰ Напоминания о дедлайнах по твоим направлениям',
                    '🎓 Сертификат сразу после прохождения курса',
                    '💬 Мотивационные сообщения — не шали, давай участвуй!',
                  ].map((item) => (
                    <li key={item} className="text-xs text-sky-700 leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Твой Telegram username
              </label>
              <div className="relative mb-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-base select-none">@</span>
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value.replace('@', ''))}
                  placeholder="tihon2008"
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-slate-800"
                />
              </div>

              {telegram.trim() ? (
                <a
                  href={`https://t.me/${botUsername}?start=${user?.id || (user?.email ? user.email.replace('@', '_at_').replace(/\./g, '_dot_') : 'new')
                    }`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm transition-all shadow-md shadow-sky-500/25 hover:-translate-y-0.5 mt-1"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-2.04 9.613c-.148.658-.537.818-1.09.508l-3-2.21-1.447 1.392c-.16.16-.295.295-.604.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.56-4.456c.537-.194 1.006.131.918.605z" />
                  </svg>
                  Открыть бота и нажать /start
                </a>
              ) : (
                <p className="text-xs text-slate-400 mt-1">
                  Можно пропустить — настроить позже в разделе «Профиль»
                </p>
              )}
            </div>
          )}

          {/* Навигация */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : navigate('/'))}
              className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
            >
              <Icon name="arrow_back" className="text-[20px]" /> Назад
            </button>

            {step < TOTAL_STEPS ? (
              <button
                onClick={() => canNext && setStep(step + 1)}
                disabled={!canNext}
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1"
              >
                Далее <Icon name="arrow_forward" className="text-[20px]" />
              </button>
            ) : (
              <button
                onClick={finish}
                className="px-7 py-2.5 rounded-xl font-bold text-white bg-accent hover:bg-emerald-600 transition-colors inline-flex items-center gap-1"
              >
                Начать <Icon name="celebration" className="text-[20px]" filled />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
