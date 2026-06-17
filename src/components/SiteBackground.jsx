// Декоративный фон на всю длину сайта: мягкая «гамма-аврора» + волны.
export default function SiteBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-slate-950"
    >
      {/* Светящиеся пятна (аврора) */}
      <div className="absolute -top-48 -left-40 w-[42rem] h-[42rem] rounded-full bg-brand/20 dark:bg-brand/25 blur-3xl animate-float-slow" />
      <div className="absolute top-1/4 -right-48 w-[46rem] h-[46rem] rounded-full bg-emerald-400/15 dark:bg-emerald-500/15 blur-3xl animate-float-slower" />
      <div className="absolute bottom-10 left-1/4 w-[40rem] h-[40rem] rounded-full bg-teal-300/15 dark:bg-teal-500/10 blur-3xl animate-float-slow" />

      {/* Анимированные волны снизу (несколько слоёв с разной скоростью) */}
      <svg
        className="absolute bottom-0 left-[-25%] w-[150%] h-[42vh] text-brand/10 dark:text-brand/20 animate-wave-slower"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,160 C320,260 420,60 720,140 C1020,220 1180,80 1440,160 L1440,320 L0,320 Z"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-[-25%] w-[150%] h-[34vh] text-emerald-400/10 dark:text-emerald-500/15 animate-wave-slow"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,224 C360,120 540,300 880,210 C1140,140 1260,260 1440,200 L1440,320 L0,320 Z"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-[-25%] w-[150%] h-[26vh] text-teal-300/10 dark:text-teal-400/10 animate-wave-mid"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,256 C300,200 600,300 900,256 C1140,220 1320,290 1440,256 L1440,320 L0,320 Z"
        />
      </svg>
    </div>
  )
}
