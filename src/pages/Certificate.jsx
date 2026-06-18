import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Logo from '../components/Logo'
import { useLanguage } from '../contexts/LanguageContext'
import { getCourses, getProfile, formatDate, getLessons, completedCount } from '../utils/storage'

export default function Certificate() {
  const { courseId } = useParams()
  const { t } = useLanguage()
  const course = useMemo(() => getCourses().find((c) => c.id === courseId), [courseId])
  const profile = getProfile()
  const name = profile?.name || t('common.student')
  const today = new Date().toISOString().slice(0, 10)

  const totalLessons = useMemo(() => {
    if (!courseId) return 0
    return (getLessons()[courseId] || []).length || (getCourses().find(c => c.id === courseId)?.lessonsCount) || 0
  }, [courseId])

  const completed = useMemo(() => {
    if (!courseId) return 0
    return completedCount(courseId)
  }, [courseId])

  const isCompleted = totalLessons > 0 && completed === totalLessons

  if (!course || !isCompleted) {
    return (
      <div className="min-h-screen bg-slate-900/10 dark:bg-slate-950 py-10 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 max-w-md border border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="lock" className="text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t('cert.accessDenied')}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {t('cert.accessDesc').replace('{title}', course?.title || t('cert.courseFallback'))}
          </p>
          <Link
            to={course ? `/app/courses/${courseId}` : '/app/courses'}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-all w-full"
          >
            {t('cert.backToCourse')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900/10 dark:bg-slate-950 py-10 px-4 flex flex-col items-center certificate-page-container">
      {/* Стили для идеальной печати A4 Альбомного формата */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          html, body {
            margin: 0;
            padding: 0;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .certificate-page-container {
            padding: 0 !important;
            margin: 0 !important;
            background: none !important;
            min-height: 0 !important;
            display: block !important;
          }
          .certificate-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 297mm !important;
            height: 210mm !important;
            max-width: none !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            background: #ffffff !important;
          }
        }
      `}</style>

      {/* Панель действий (не печатается) */}
      <div className="no-print w-full max-w-4xl flex items-center justify-between mb-6">
        <Link
          to={course ? `/app/courses/${courseId}` : '/app/courses'}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors inline-flex items-center gap-1.5 font-medium"
        >
          <Icon name="arrow_back" className="text-[20px]" /> {t('cert.backToCourseShort')}
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5"
        >
          <Icon name="print" className="text-[20px]" /> {t('cert.print')}
        </button>
      </div>

      {/* Сертификат (в браузере имеет фиксированный А4 вид с тенью) */}
      <div className="certificate-card w-full max-w-4xl aspect-[297/210] bg-white text-slate-800 shadow-2xl rounded-2xl p-6 sm:p-10 border border-slate-100 flex flex-col justify-between relative overflow-hidden">
        
        {/* Декоративные уголки / Фоновые волны для премиального вида */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-primary/20 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-primary/20 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-primary/20 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-primary/20 rounded-br-xl pointer-events-none" />
        
        {/* Фоновый водяной знак бренда */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-[50%] h-[50%] fill-current text-primary">
            <path d="M50 15L15 35L50 55L85 35L50 15Z" />
            <path d="M15 45V65C15 75 50 85 50 85C50 85 85 75 85 65V45L50 63L15 45Z" />
          </svg>
        </div>

        {/* Рамка */}
        <div className="border-4 border-primary/90 rounded-xl p-2.5 h-full flex flex-col justify-between">
          <div className="border border-primary/25 rounded-lg h-full px-6 sm:px-16 py-10 flex flex-col justify-between text-center relative">
            
            {/* Шапка сертификата */}
            <div className="flex flex-col items-center">
              <div className="mb-4 flex items-center gap-2">
                <Logo to={null} size="lg" />
              </div>
              <div className="w-24 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>

            {/* Заголовок */}
            <div className="my-auto py-2">
              <p className="uppercase tracking-[0.4em] text-xs font-bold text-slate-400 mb-3">{t('cert.official')}</p>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mb-4">
                {t('cert.completionTitle')}
              </h1>

              <p className="text-slate-500 font-medium italic mb-2">{t('cert.certifies')}</p>
              <h2 className="text-4xl sm:text-5xl font-black text-primary border-b-2 border-slate-200 inline-block px-12 pb-3 mb-4 font-serif">
                {name}
              </h2>

              <p className="text-slate-500 font-medium mb-1.5">{t('cert.completedProgram')}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight max-w-2xl mx-auto">
                «{course ? course.title : t('cert.courseDefault')}»
              </h3>
            </div>

            {/* Абсолютно позиционированный QR-код (слева внизу) */}
            <div className="absolute bottom-8 left-8 flex flex-col items-center">
              <div className="bg-white p-1.5 border border-slate-200/80 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${encodeURIComponent(window.location.href)}`}
                  alt="QR Verification"
                  className="w-12 h-12 sm:w-14 sm:h-14"
                />
              </div>
            </div>

            {/* Подписи и Печать (по центру) */}
            <div className="flex items-end justify-between max-w-xl mx-auto w-full pt-4 gap-4">
              
              {/* Дата */}
              <div className="text-center w-1/3 flex flex-col items-center">
                <p className="font-bold text-slate-700 border-b border-slate-300 pb-1 text-xs sm:text-sm md:text-base inline-block px-4">
                  {formatDate(today)} {new Date().getFullYear()}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">{t('cert.issueDate')}</p>
              </div>

              {/* Золотая Печать */}
              <div className="flex justify-center items-center w-1/3 relative -bottom-2">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-amber-500/10 border-4 border-amber-500 flex items-center justify-center relative shadow-inner">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full border border-dashed border-amber-500 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-10 sm:h-10 fill-amber-500">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  </div>
                  {/* Ленточки печати */}
                  <div className="absolute -bottom-4 left-3 w-3.5 h-8 bg-amber-500 rotate-12 -z-10 origin-top rounded-b" />
                  <div className="absolute -bottom-4 right-3 w-3.5 h-8 bg-amber-500 -rotate-12 -z-10 origin-top rounded-b" />
                </div>
              </div>

              {/* Подпись */}
              <div className="text-center w-1/3 flex flex-col items-center">
                <p className="font-[cursive] text-lg sm:text-2xl text-primary leading-none h-7">Mentoria Hub</p>
                <p className="font-bold text-slate-700 border-t border-slate-300 pt-1.5 text-[10px] sm:text-xs uppercase tracking-wider inline-block px-4">
                  {t('cert.schoolSignature')}
                </p>
              </div>
              
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
