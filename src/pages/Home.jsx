import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

/* ─── data ─────────────────────────────────────────────── */
const features = [
  {
    icon: 'travel_explore',
    title: 'Каталог возможностей',
    desc: 'Олимпиады, хакатоны, стипендии и летние школы — всё в одном месте с удобными фильтрами и дедлайнами.',
    gradient: 'from-[#6C63FF] to-[#9C97FF]',
    glow: 'rgba(108,99,255,0.25)',
  },
  {
    icon: 'play_lesson',
    title: 'Асинхронные курсы',
    desc: 'Учись когда удобно: видео, материалы и тесты доступны 24/7. Прогресс сохраняется автоматически.',
    gradient: 'from-[#00C896] to-[#34DEB1]',
    glow: 'rgba(0,200,150,0.22)',
  },
  {
    icon: 'auto_awesome',
    title: 'AI-рекомендации',
    desc: 'Умный помощник подбирает возможности и курсы под твои интересы, класс и цели поступления.',
    gradient: 'from-[#F857A6] to-[#FF5858]',
    glow: 'rgba(248,87,166,0.22)',
  },
]

const stats = [
  { value: '50+', label: 'Курсов' },
  { value: '200+', label: 'Возможностей' },
  { value: '3 000+', label: 'Учеников' },
  { value: '24/7', label: 'Доступ' },
]

const steps = [
  {
    num: '01',
    title: 'Создай профиль',
    desc: 'Заполни короткий опрос о своих интересах, классе и целях — это займёт меньше 2 минут.',
  },
  {
    num: '02',
    title: 'Получи рекомендации',
    desc: 'AI подберёт подходящие курсы и возможности специально под твои цели и интересы.',
  },
  {
    num: '03',
    title: 'Учись и побеждай',
    desc: 'Проходи курсы, участвуй в олимпиадах и строй путь к поступлению в топ-вузы.',
  },
]

/* ─── helpers ───────────────────────────────────────────── */
function useIntersection(ref) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return visible
}

function RevealSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const visible = useIntersection(ref)
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${visible ? 'visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

/* ─── Floating orb ──────────────────────────────────────── */
function Orb({ className }) {
  return (
    <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />
  )
}

/* ─── Stat Counter ──────────────────────────────────────── */
function StatCard({ value, label, delay }) {
  const ref = useRef(null)
  const visible = useIntersection(ref)
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${visible ? 'visible' : ''} text-center`}
    >
      <div className="font-display text-4xl sm:text-5xl font-bold gradient-text mb-1">{value}</div>
      <div className="text-sm text-white/50 font-medium uppercase tracking-widest">{label}</div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────── */
export default function Home() {
  const cursorRef = useRef(null)
  const heroRef = useRef(null)

  /* Mouse glow that follows cursor */
  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  /* Parallax for hero blobs */
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const handleMouse = (e) => {
      const { left, top, width, height } = hero.getBoundingClientRect()
      const x = (e.clientX - left - width / 2) / width
      const y = (e.clientY - top - height / 2) / height
      const orbs = hero.querySelectorAll('[data-parallax]')
      orbs.forEach((orb) => {
        const speed = parseFloat(orb.dataset.parallax)
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`
      })
    }
    hero.addEventListener('mousemove', handleMouse)
    return () => hero.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <>
      {/* Cursor glow */}
      <div ref={cursorRef} className="cursor-glow" />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background orbs */}
        <Orb
          data-parallax="30"
          className="w-[500px] h-[500px] bg-primary/20 -top-24 -right-32 animate-float"
        />
        <Orb
          data-parallax="20"
          className="w-[400px] h-[400px] bg-accent/15 bottom-0 -left-40 animate-float-slow"
        />
        <Orb
          data-parallax="40"
          className="w-[240px] h-[240px] bg-[#F857A6]/10 top-1/3 left-1/3 animate-float-delayed"
        />

        {/* Grid lines background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(108,99,255,1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(108,99,255,1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          {/* Badge */}
          <RevealSection delay={0}>
            <span className="inline-flex items-center gap-2 glass-card px-5 py-2 text-sm font-medium text-white/70 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Образовательная платформа для 8–11 классов Казахстана
            </span>
          </RevealSection>

          {/* Headline */}
          <RevealSection delay={100}>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] text-white mb-6">
              Найди возможности.{' '}
              <br className="hidden sm:block" />
              <span className="gradient-text">Учись в своём темпе.</span>
            </h1>
          </RevealSection>

          {/* Subheadline */}
          <RevealSection delay={200}>
            <p className="text-lg sm:text-xl text-white/55 max-w-2xl mx-auto mb-12 leading-relaxed">
              Асинхронное обучение и каталог образовательных возможностей для школьников Казахстана.
              Олимпиады, курсы и поступление в топ-вузы — всё в одном месте.
            </p>
          </RevealSection>

          {/* CTAs */}
          <RevealSection delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-base px-8 py-4">
                Начать бесплатно
                <span className="material-symbols-rounded text-[20px]">arrow_forward</span>
              </Link>
              <Link to="/login" className="btn-ghost text-base px-8 py-4">
                Войти в аккаунт
              </Link>
            </div>
          </RevealSection>

          {/* Floating UI card mockup */}
          <RevealSection delay={400} className="mt-20">
            <div className="relative max-w-3xl mx-auto">
              {/* Main card */}
              <div className="glass-card gradient-border p-6 sm:p-8 rounded-3xl text-left shadow-2xl shadow-primary/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-white/10" />
                    <span className="w-3 h-3 rounded-full bg-white/10" />
                    <span className="w-3 h-3 rounded-full bg-white/10" />
                  </div>
                  <div className="flex-1 h-6 rounded-full bg-white/5 flex items-center px-3">
                    <span className="text-xs text-white/30">mentoria.hub / dashboard</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {['Олимпиады', 'Курсы', 'Прогресс'].map((label, i) => (
                    <div key={label} className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div
                        className="w-8 h-8 rounded-lg mb-3"
                        style={{
                          background: ['#6C63FF', '#00C896', '#F857A6'][i] + '33',
                        }}
                      />
                      <div className="text-xs font-semibold text-white/80 mb-1">{label}</div>
                      <div className="text-xs text-white/30">
                        {['24 активных', '12 курсов', '86% завершено'][i]}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full"
                    style={{ width: '72%', background: 'linear-gradient(90deg,#6C63FF,#00C896)' }}
                  />
                </div>
              </div>

              {/* Floating badge 1 */}
              <div className="hidden sm:block absolute -top-6 -right-8 glass-card px-4 py-2.5 rounded-xl shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <span className="material-symbols-rounded text-accent text-[18px]">verified</span>
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">Сертификат</div>
                    <div className="text-[10px] text-white/40">Получен!</div>
                  </div>
                </div>
              </div>

              {/* Floating badge 2 */}
              <div className="hidden sm:block absolute -bottom-4 -left-8 glass-card px-4 py-2.5 rounded-xl shadow-lg animate-float-delayed">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-rounded text-primary-light text-[18px]">school</span>
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">Новая олимпиада</div>
                    <div className="text-[10px] text-white/40">Дедлайн через 3 дня</div>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
      </section>

      {/* ── STATS ──────────────────────────────────────────────── */}
      <section className="relative py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card gradient-border rounded-3xl p-10 grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((s, i) => (
              <StatCard key={s.label} value={s.value} label={s.label} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <Orb className="w-[600px] h-[600px] bg-primary/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-light uppercase tracking-widest mb-4">
              Возможности
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
              Всё, что нужно для роста
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-lg">
              Один аккаунт — весь твой образовательный путь от школы до поступления
            </p>
          </RevealSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {features.map((f, i) => (
              <RevealSection key={f.title} delay={i * 100}>
                <FeatureCard feature={f} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealSection className="text-center mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-4">
              Как это работает
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5">
              Три шага до успеха
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-lg">
              Начни прямо сейчас — без лишних шагов
            </p>
          </RevealSection>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-px bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40" />

            {steps.map((step, i) => (
              <RevealSection key={step.num} delay={i * 120}>
                <div className="relative flex flex-col items-center text-center">
                  {/* Number bubble */}
                  <div className="relative w-20 h-20 rounded-2xl glass-card gradient-border mb-8 flex items-center justify-center">
                    <span className="font-display text-2xl font-bold gradient-text">{step.num}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <RevealSection>
            <div className="relative overflow-hidden rounded-3xl p-1"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #00C896, #6C63FF)' }}>
              <div className="relative rounded-[22px] bg-surface-2 px-8 py-16 sm:py-20 text-center overflow-hidden">
                {/* Animated orbs inside */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-float" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/15 blur-3xl animate-float-slow" />

                <p className="relative text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
                  Готов начать?
                </p>
                <h2 className="relative font-display text-4xl sm:text-5xl font-bold text-white mb-6">
                  Создай свой профиль{' '}
                  <span className="gradient-text">бесплатно</span>
                </h2>
                <p className="relative text-white/50 text-lg max-w-xl mx-auto mb-10">
                  Заполни короткий профиль и получи персональные рекомендации по курсам и
                  возможностям за 2 минуты.
                </p>
                <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register" className="btn-primary text-base px-8 py-4">
                    Начать бесплатно
                    <span className="material-symbols-rounded text-[20px]">arrow_forward</span>
                  </Link>
                  <Link to="/login" className="btn-ghost text-base px-8 py-4">
                    Уже есть аккаунт
                  </Link>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </>
  )
}

/* ─── Feature Card sub-component ────────────────────────── */
function FeatureCard({ feature: f }) {
  const [hovered, setHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden rounded-2xl border border-white/8 bg-surface-2 p-8 cursor-default transition-all duration-300 hover:-translate-y-2 hover:border-white/15 group"
      style={{
        boxShadow: hovered ? `0 20px 60px ${f.glow}` : 'none',
      }}
    >
      {/* Radial spotlight following mouse */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${f.glow} 0%, transparent 65%)`,
        }}
      />

      {/* Icon */}
      <div
        className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-6 shadow-lg`}
      >
        <span className="material-symbols-rounded text-white text-[28px]">{f.icon}</span>
      </div>

      <h3 className="relative font-display text-xl font-bold text-white mb-3">{f.title}</h3>
      <p className="relative text-white/50 leading-relaxed text-sm">{f.desc}</p>

      {/* Bottom gradient line */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${f.gradient}`}
      />
    </div>
  )
}
