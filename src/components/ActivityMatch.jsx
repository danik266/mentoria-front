import { useState, useEffect } from 'react'
import Icon from './Icon'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function ActivityMatch({ activity, onComplete }) {
  const [selected, setSelected] = useState(null) // { side: 'term'|'def', index }
  const [matched, setMatched] = useState({}) // { termIndex: defIndex }
  const [wrong, setWrong] = useState(null)
  const [terms, setTerms] = useState([])
  const [defs, setDefs] = useState([])

  useEffect(() => {
    setTerms(shuffle(activity.pairs.map((p, i) => ({ ...p, origIndex: i }))))
    setDefs(shuffle(activity.pairs.map((p, i) => ({ ...p, origIndex: i }))))
  }, [activity])

  const allMatched = Object.keys(matched).length === activity.pairs.length

  const handleSelect = (side, index, origIndex) => {
    if (Object.values(matched).includes(origIndex) && side === 'def') return
    if (matched[terms.findIndex(t => t.origIndex === origIndex)] !== undefined && side === 'term') return

    if (!selected) {
      setSelected({ side, index, origIndex })
      return
    }

    if (selected.side === side) {
      setSelected({ side, index, origIndex })
      return
    }

    // Match attempt
    const termOrigIndex = selected.side === 'term' ? selected.origIndex : origIndex
    const defOrigIndex = selected.side === 'def' ? selected.origIndex : origIndex
    const termIdx = terms.findIndex(t => t.origIndex === termOrigIndex)

    if (termOrigIndex === defOrigIndex) {
      setMatched(prev => ({ ...prev, [termIdx]: defOrigIndex }))
      setSelected(null)
      setWrong(null)
    } else {
      setWrong({ termOrigIndex, defOrigIndex })
      setTimeout(() => {
        setWrong(null)
        setSelected(null)
      }, 800)
    }
  }

  const isTermMatched = (origIndex) => {
    const termIdx = terms.findIndex(t => t.origIndex === origIndex)
    return matched[termIdx] !== undefined
  }
  const isDefMatched = (origIndex) => Object.values(matched).includes(origIndex)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl bg-amber-50 grid place-items-center">
          <Icon name="link" className="text-[22px] text-amber-500" filled />
        </span>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{activity.title}</h2>
          <p className="text-sm text-slate-400">Выбери термин слева, затем его определение справа</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Совпадений: <strong className="text-brand">{Object.keys(matched).length}</strong> из {activity.pairs.length}</span>
        {allMatched && <span className="text-emerald-600 font-semibold flex items-center gap-1"><Icon name="celebration" className="text-[18px]" filled /> Всё верно!</span>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Terms column */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide text-center mb-3">Термины</p>
          {terms.map((item) => {
            const isMatch = isTermMatched(item.origIndex)
            const isSelected = selected?.side === 'term' && selected?.origIndex === item.origIndex
            const isWrong = wrong?.termOrigIndex === item.origIndex
            return (
              <button
                key={item.origIndex}
                onClick={() => !isMatch && handleSelect('term', item.origIndex, item.origIndex)}
                disabled={isMatch}
                className={`w-full p-3 rounded-xl text-sm font-medium text-left transition-all border-2 ${
                  isMatch
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                    : isWrong
                    ? 'bg-red-50 border-red-300 text-red-700 animate-shake'
                    : isSelected
                    ? 'bg-brand-soft border-brand-light text-brand-dark shadow-md scale-[1.02]'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-brand-light hover:bg-brand-soft/30 cursor-pointer'
                }`}
              >
                {isMatch && <Icon name="check_circle" className="text-[16px] text-emerald-500 inline mr-1.5" filled />}
                {item.term}
              </button>
            )
          })}
        </div>

        {/* Definitions column */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide text-center mb-3">Определения</p>
          {defs.map((item) => {
            const isMatch = isDefMatched(item.origIndex)
            const isSelected = selected?.side === 'def' && selected?.origIndex === item.origIndex
            const isWrong = wrong?.defOrigIndex === item.origIndex
            return (
              <button
                key={item.origIndex}
                onClick={() => !isMatch && handleSelect('def', item.origIndex, item.origIndex)}
                disabled={isMatch}
                className={`w-full p-3 rounded-xl text-sm font-medium text-left transition-all border-2 ${
                  isMatch
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                    : isWrong
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : isSelected
                    ? 'bg-brand-soft border-brand-light text-brand-dark shadow-md scale-[1.02]'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-brand-light hover:bg-brand-soft/30 cursor-pointer'
                }`}
              >
                {isMatch && <Icon name="check_circle" className="text-[16px] text-emerald-500 inline mr-1.5" filled />}
                {item.definition}
              </button>
            )
          })}
        </div>
      </div>

      {allMatched && (
        <button
          onClick={onComplete}
          className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="task_alt" className="text-[22px]" filled /> Продолжаем!
        </button>
      )}
    </div>
  )
}
