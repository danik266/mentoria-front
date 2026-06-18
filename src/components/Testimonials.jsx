import Icon from './Icon'
import ScrollReveal from './ScrollReveal'

export default function Testimonials() {
  const reviews = [
    {
      name: 'Амирлан К.',
      grade: 'Выпускник, г. Алматы',
      tag: 'Поступил на грант в NU',
      quote: 'С помощью платформы нашел STEM Camp Almaty в прошлом году. Этот лагерь круто изменил мои цели. Понял, что хочу заниматься биомедицинской инженерией. Сейчас учусь на гранте в Nazarbayev University!',
      avatarBg: 'bg-indigo-500',
      initials: 'АК'
    },
    {
      name: 'Дана М.',
      grade: '11 класс, г. Астана',
      tag: 'Призер NIS Math',
      quote: 'Раньше я постоянно забывала вовремя зарегистрироваться на хакатоны и олимпиады, просто пропускала даты. Как только подключила Telegram-бота Mentoria Hub — жизнь наладилась. Приходят напоминалки о дедлайнах, все четко.',
      avatarBg: 'bg-emerald-500',
      initials: 'ДМ'
    },
    {
      name: 'Санжар Т.',
      grade: 'Выпускник, г. Караганда',
      tag: 'Студент Astana IT University',
      quote: 'Прошел курс по веб-разработке здесь. Очень практичные задания, особенно понравился интерактивный тренажер. Завершил на 100%, получил сертификат, который прикрепил к резюме. Очень помогло при поступлении.',
      avatarBg: 'bg-rose-500',
      initials: 'СТ'
    },
    {
      name: 'Алина Б.',
      grade: '10 класс, г. Шымкент',
      tag: 'Участница летних школ',
      quote: 'Круто, что можно фильтровать программы по формату. Нашла несколько классных онлайн-курсов и летних школ, про которые даже не знала. Не нужно искать по сотням сайтов — все собрано в одном месте!',
      avatarBg: 'bg-teal-500',
      initials: 'АБ'
    },
    {
      name: 'Темирлан Ж.',
      grade: '11 класс, г. Актобе',
      tag: 'Разработчик, призер олимпиад',
      quote: 'Здесь супер приятный интерфейс. AI-ассистент прямо внутри уроков — это топ. Если не понимаешь ошибку в коде, он объясняет человеческим языком. Настоящий карманный ментор.',
      avatarBg: 'bg-amber-500',
      initials: 'ТЖ'
    },
    {
      name: 'Мадина С.',
      grade: '11 класс, г. Павлодар',
      tag: 'Поступила в Constructor Univ.',
      quote: 'Платформа помогла упорядочить все олимпиады. В итоге за 11 класс собрала портфолио, выиграла грант в зарубежный вуз. Рекомендую всем ребятам из 8-10 классов начинать пользоваться прямо сейчас!',
      avatarBg: 'bg-purple-500',
      initials: 'МС'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <ScrollReveal animation="fade-in-up">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">Отзывы</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl tracking-tight mt-2">
            Что говорят будущие студенты
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
            Реальные истории школьников, которые нашли возможности, подтянули навыки и поступили в лучшие университеты.
          </p>
        </ScrollReveal>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <ScrollReveal key={idx} animation="scale-in" delay={idx * 80}>
            <div className="flex flex-col justify-between h-full bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-7 rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-4">
                {/* Рейтинг/Иконка кавычек */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Icon key={s} name="star" className="text-[16px] filled-star" filled />
                    ))}
                  </div>
                  <span className="text-slate-200 dark:text-slate-700 text-3xl font-serif">“</span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                  {rev.quote}
                </p>
              </div>

              {/* Профиль студента */}
              <div className="mt-6 flex items-center gap-3.5 border-t border-slate-100/60 dark:border-slate-850 pt-4">
                <span className={`w-10 h-10 shrink-0 rounded-full ${rev.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                  {rev.initials}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {rev.name}
                  </h4>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
                    {rev.grade}
                  </p>
                  <span className="mt-1 inline-block text-[10px] font-bold text-brand bg-brand-soft px-2 py-0.5 rounded-full dark:bg-brand/10">
                    {rev.tag}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
