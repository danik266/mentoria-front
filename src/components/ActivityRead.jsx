import Icon from './Icon'

export default function ActivityRead({ activity, onComplete }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl bg-brand-soft grid place-items-center">
          <Icon name="menu_book" className="text-[22px] text-brand" filled />
        </span>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{activity.title}</h2>
          <p className="text-sm text-slate-400 dark:text-slate-500">Читай внимательно — это основа урока</p>
        </div>
      </div>

      <div className="space-y-5">
        {activity.content.map((block, i) => {
          if (typeof block === 'string') {
            return (
              <p key={i} className="text-slate-700 dark:text-slate-200 leading-relaxed text-base">
                {block}
              </p>
            )
          }
          if (block.type === 'note') {
            return (
              <div key={i} className="bg-brand-soft border-l-4 border-brand-light rounded-r-xl p-4">
                <p className="text-sm font-semibold text-brand-dark mb-1 flex items-center gap-1.5">
                  <Icon name="lightbulb" className="text-[18px]" filled /> Важно запомнить
                </p>
                <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{block.text}</p>
              </div>
            )
          }
          if (block.type === 'formula') {
            return (
              <div key={i} className="bg-slate-900 rounded-2xl p-5 text-center">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">{block.label || 'Формула'}</p>
                <p className="text-2xl font-bold text-white font-mono">{block.text}</p>
                {block.desc && <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">{block.desc}</p>}
              </div>
            )
          }
          if (block.type === 'list') {
            return (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
                {block.title && <p className="font-semibold text-slate-800 dark:text-white mb-3">{block.title}</p>}
                <ul className="space-y-2">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200 text-sm">
                      <span className="w-5 h-5 rounded-full bg-brand-soft text-brand grid place-items-center text-xs font-bold shrink-0 mt-0.5">
                        {j + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          }
          if (block.type === 'example') {
            return (
              <div key={i} className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                <p className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-1.5">
                  <Icon name="check_circle" className="text-[18px]" filled /> Пример
                </p>
                <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{block.text}</p>
              </div>
            )
          }
          return null
        })}
      </div>

      <button
        onClick={onComplete}
        className="mt-4 w-full py-3.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
      >
        Прочитал, продолжить <Icon name="arrow_forward" className="text-[20px]" />
      </button>
    </div>
  )
}
