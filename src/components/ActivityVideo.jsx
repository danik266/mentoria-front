import Icon from './Icon'

export default function ActivityVideo({ activity, onComplete }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-xl bg-blue-50 grid place-items-center">
          <Icon name="play_circle" className="text-[22px] text-blue-500" filled />
        </span>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{activity.title}</h2>
          <p className="text-sm text-slate-400">Посмотри видеоурок для продолжения</p>
        </div>
      </div>

      <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-900">
        <iframe
          src={activity.url}
          title="YouTube video player"
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      <button
        onClick={onComplete}
        className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors mt-6 flex items-center justify-center gap-2"
      >
        <Icon name="check_circle" className="text-[22px]" /> Я посмотрел видео
      </button>
    </div>
  )
}
