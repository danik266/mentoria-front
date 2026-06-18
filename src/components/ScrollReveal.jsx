import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({
  children,
  className = '',
  animation = 'fade-in-up', // fade-in-up, fade-in-left, fade-in-right, scale-in
  delay = 0, // delay in ms
  duration = 800, // duration in ms
  threshold = 0.05,
}) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return true
    }
    return false
  })

  useEffect(() => {
    if (revealed) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold, revealed])

  const getInitialStyles = () => {
    switch (animation) {
      case 'fade-in-up':
        return 'opacity-0 translate-y-8'
      case 'fade-in-left':
        return 'opacity-0 -translate-x-10'
      case 'fade-in-right':
        return 'opacity-0 translate-x-10'
      case 'scale-in':
        return 'opacity-0 scale-95'
      default:
        return 'opacity-0 translate-y-8'
    }
  }

  const getTransitionStyles = () => {
    if (!revealed) return getInitialStyles()
    return 'opacity-100 translate-y-0 translate-x-0 scale-100'
  }

  const delayStyle = delay ? { transitionDelay: `${delay}ms` } : {}
  const durationStyle = duration ? { transitionDuration: `${duration}ms` } : {}

  return (
    <div
      ref={ref}
      style={{
        ...delayStyle,
        ...durationStyle,
      }}
      className={`transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${getTransitionStyles()} ${className}`}
    >
      {children}
    </div>
  )
}
