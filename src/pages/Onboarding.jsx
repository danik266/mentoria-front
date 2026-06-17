import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import Logo from '../components/Logo'
import { interestsList, goalsList } from '../data/mock'
import { saveProfile } from '../utils/storage'

const grades = [8, 9, 10, 11]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [grade, setGrade] = useState(null)
  const [interests, setInterests] = useState([])
  const [goals, setGoals] = useState([])

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const canNext =
    (step === 1 && grade !== null) ||
    (step === 2 && interests.length >= 1) ||
    step === 3

  const finish = () => {
    saveProfile({
      name: name.trim() || 'Ученик',
      grade,
      interests,
      goals,
    })
    navigate('/app')
  }

  const progress = (step / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-soft to-white flex flex-col">
      {/* Шапка */}
      <div className="max-w-2xl w-full mx-auto px-4 pt-10">
        <div className="flex items-center justify-center mb-8">
          <Logo to={null} />
        </div>

        {/* Прогресс-бар */}
        <div className="mb-2 flex justify-between text-sm font-medium text-slate-500">
          <span>Шаг {step} из 3</span>
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
                    className={`aspect-square rounded-2xl text-2xl font-bold border-2 transition-all ${
                      grade === g
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
                      className={`px-4 py-2.5 rounded-xl font-medium border-2 transition-all ${
                        active
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
                      className={`px-4 py-2.5 rounded-xl font-medium border-2 transition-all ${
                        active
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

          {/* Навигация */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : navigate('/'))}
              className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
            >
              <Icon name="arrow_back" className="text-[20px]" /> Назад
            </button>

            {step < 3 ? (
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
