import { useState } from 'react'
import Icon from './Icon'

function FlashCard({ card, index, total }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="relative h-52 cursor-pointer" onClick={() => setFlipped(!flipped)}>
      <div
        className="relative w-full h-full transition-all duration-500"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-brand to-brand-dark rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 text-white"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-soft mb-3">
            Карточка {index + 1} из {total} · Нажми чтобы перевернуть
          </p>
          <p className="text-xl font-bold text-center">{card.front}</p>
          <span className="mt-4 text-brand-soft">
            <Icon name="flip" className="text-[24px]" />
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border-2 border-brand-soft flex flex-col items-center justify-center p-6"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-light mb-3">Ответ</p>
          <p className="text-lg text-slate-800 dark:text-white text-center leading-relaxed">{card.back}</p>
        </div>
      </div>
    </div>
  )
}

export default function ActivityFlashcards({ activity, onComplete }) {
  const [current, setCurrent] = useState(0)
  const [seen, setSeen] = useState(new Set())

  const card = activity.cards[current]
  const allSeen = seen.size === activity.cards.length

  const handleNext = () => {
    setSeen(prev => new Set([...prev, current]))
    if (current < activity.cards.length - 1) {
      setCurrent(current + 1)
    }
  }

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl bg-brand-soft grid place-items-center">
          <Icon name="style" className="text-[22px] text-brand-light" filled />
        </span>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{activity.title}</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500">Нажимай на карточку, чтобы увидеть ответ</p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 flex-wrap">
        {activity.cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
              i === current
                ? 'bg-brand text-white shadow-md scale-110'
                : seen.has(i)
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200'
            }`}
          >
            {seen.has(i) ? <Icon name="check" className="text-[16px] mx-auto" /> : i + 1}
          </button>
        ))}
      </div>

      <FlashCard card={card} index={current} total={activity.cards.length} />

      <div className="flex justify-between gap-3">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="arrow_back" className="text-[20px]" /> Назад
        </button>
        <button
          onClick={handleNext}
          disabled={current === activity.cards.length - 1}
          className="flex-1 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          Вперёд <Icon name="arrow_forward" className="text-[20px]" />
        </button>
      </div>

      {allSeen && (
        <button
          onClick={onComplete}
          className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="task_alt" className="text-[22px]" filled /> Отлично, продолжаем!
        </button>
      )}
    </div>
  )
}
