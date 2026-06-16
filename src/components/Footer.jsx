export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary text-white grid place-items-center font-extrabold">
              M
            </span>
            <span className="font-bold text-slate-800">
              Mentoria <span className="text-primary">Hub</span>
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Образовательная платформа для школьников Казахстана
          </p>
          <div className="text-center sm:text-right">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Mentoria Hub. Все права защищены.
            </p>
            <a href="/admin" className="text-xs text-slate-400 hover:text-primary hover:underline transition-colors mt-1 inline-block">
              Вход для администратора
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
