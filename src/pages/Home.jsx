import { Link } from 'react-router-dom'
import Icon from '../components/Icon'

const features = [
  {
    icon: 'explore',
    title: 'Каталог возможностей',
    desc: 'Олимпиады, хакатоны, стипендии и летние школы — всё в одном месте с удобными фильтрами и дедлайнами.',
    color: 'bg-indigo-50 text-primary',
  },
  {
    icon: 'play_lesson',
    title: 'Асинхронные курсы',
    desc: 'Учись когда удобно: видео, материалы и тесты доступны 24/7. Прогресс сохраняется автоматически.',
    color: 'bg-emerald-50 text-accent',
  },
  {
    icon: 'auto_awesome',
    title: 'AI-рекомендации',
    desc: 'Умный помощник подбирает возможности и курсы под твои интересы, класс и цели поступления.',
    color: 'bg-sky-50 text-sky-600',
  },
]

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-soft to-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 bg-white border border-slate-100 shadow-sm text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Образовательная платформа для 8–11 классов
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight max-w-4xl mx-auto">
            Найди возможности. <br className="hidden sm:block" />
            <span className="text-primary">Учись в своём темпе.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Mentoria Hub — это асинхронное обучение и каталог образовательных возможностей для
            школьников Казахстана. Олимпиады, курсы и поступление в топ-вузы — всё в одном месте.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/opportunities"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-colors"
            >
              <Icon name="explore" className="text-[20px]" /> Найти возможности
            </Link>
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold shadow-sm hover:bg-emerald-600 transition-colors"
            >
              <Icon name="play_circle" className="text-[20px]" /> Начать курс
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              <Icon name="person_add" className="text-[20px]" /> Присоединиться
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-800">Почему Mentoria Hub?</h2>
          <p className="mt-3 text-slate-600">Всё, что нужно для роста — в одном приложении</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl grid place-items-center mb-5 ${f.color}`}>
                <Icon name={f.icon} className="text-[30px]" filled />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA полоса */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-primary rounded-3xl px-8 py-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <h2 className="relative text-3xl font-extrabold mb-3">Готов начать свой путь?</h2>
          <p className="relative text-white/90 mb-8 max-w-xl mx-auto">
            Заполни короткий профиль — и мы подберём возможности специально для тебя.
          </p>
          <Link
            to="/register"
            className="relative inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-primary font-bold hover:bg-sky-soft transition-colors"
          >
            Создать профиль <Icon name="arrow_forward" className="text-[20px]" />
          </Link>
        </div>
      </section>
    </div>
  )
}
