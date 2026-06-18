import Icon from './Icon'
import ScrollReveal from './ScrollReveal'

export default function Roadmap() {
  const steps = [
    {
      num: '01',
      title: 'Интерактивный тест',
      desc: 'Ответь на несколько вопросов в Telegram-боте. Мы определим твои сильные стороны, уровень подготовки и составим профиль.',
      icon: 'psychology',
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/20'
    },
    {
      num: '02',
      title: 'Умный подбор',
      desc: 'Наша система автоматически отфильтрует 120+ олимпиад, летних школ и стажировок. Ты получишь готовый шортлист только с тем, что подходит именно тебе.',
      icon: 'auto_awesome',
      color: 'from-emerald-400 to-teal-500',
      shadow: 'shadow-emerald-500/20'
    },
    {
      num: '03',
      title: 'Подготовка на максимум',
      desc: 'Готовься по специальным курсам. Встроенный ИИ-наставник готов ответить на любой сложный вопрос по теории или практике в любое время суток.',
      icon: 'school',
      color: 'from-brand to-brand-dark',
      shadow: 'shadow-brand/20'
    },
    {
      num: '04',
      title: 'Дипломы & Поступление',
      desc: 'Подтверждай свои достижения, получай именные блокчейн-сертификаты, крепи их к портфолио и поступай на грант в лучшие вузы!',
      icon: 'military_tech',
      color: 'from-purple-500 to-pink-500',
      shadow: 'shadow-purple-500/20'
    }
  ]

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Заголовок */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <ScrollReveal animation="fade-in-up">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">Как это устроено</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl tracking-tight mt-2">
            Твой путь к поступлению
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
            Пошаговый план от регистрации на платформе до получения долгожданного оффера в университет мечты.
          </p>
        </ScrollReveal>
      </div>

      {/* Линия связи на фоне (только для больших экранов) */}
      <div className="hidden lg:block absolute left-1/2 top-48 bottom-32 w-0.5 bg-gradient-to-b from-blue-500 via-brand to-purple-500 opacity-20 -translate-x-1/2" />

      {/* Шаги */}
      <div className="space-y-12 lg:space-y-20 relative">
        {steps.map((step, idx) => {
          const isEven = idx % 2 === 0
          return (
            <div
              key={step.num}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                isEven ? '' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Контентная карточка */}
              <div className="w-full lg:w-1/2">
                <ScrollReveal animation={isEven ? 'fade-in-left' : 'fade-in-right'}>
                  <div className="group relative rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 hover:shadow-xl hover:border-brand/30 shadow-md transition-all duration-300">
                    <span className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg ${step.shadow} mb-6`}>
                      <Icon name={step.icon} className="text-[24px]" />
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-3">
                      <span className="text-brand/80 font-mono text-sm">{step.num}.</span>
                      {step.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                      {step.desc}
                    </p>
                  </div>
                </ScrollReveal>
              </div>

              {/* Декоративный круг посередине */}
              <div className="hidden lg:flex shrink-0 items-center justify-center z-10 w-12 h-12 rounded-full border-4 border-slate-50 dark:border-slate-950 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                <span className="text-xs font-black font-mono">{step.num}</span>
              </div>

              {/* Пустая колонка для выравнивания */}
              <div className="hidden lg:block w-1/2" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
