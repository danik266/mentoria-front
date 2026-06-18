import { useState, useRef, useEffect } from 'react'
import Icon from './Icon'
import { getProfile } from '../utils/storage'

const API_KEY = import.meta.env.REACT_APP_ANTHROPIC_API_KEY
const MODEL = 'claude-fable-5'

function buildSystemPrompt() {
  const p = getProfile()
  const profileText = p
    ? `${p.grade} класс, интересы: ${(p.interests || []).join(', ') || '—'}, цели: ${(p.goals || []).join(', ') || '—'}`
    : 'профиль не заполнен'
  return `Ты AI-помощник образовательной платформы Mentoria Hub для школьников Казахстана.
Профиль ученика: {${profileText}}.
Помогай находить подходящие образовательные возможности и курсы.
Отвечай кратко, по делу, на русском языке.`
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Здравствуйте! Я помощник Mentoria Hub. Спросите меня про олимпиады, курсы или поступление.',
    },
  ])
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    if (!API_KEY) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            'API-ключ не настроен. Добавьте REACT_APP_ANTHROPIC_API_KEY в файл .env, чтобы включить ответы ассистента. А пока — загляни в раздел «Возможности» и «Курсы»!',
        },
      ])
      setLoading(false)
      return
    }

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1024,
          system: buildSystemPrompt(),
          messages: nextMessages
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const reply = data?.content?.[0]?.text || 'Извините, не удалось получить ответ.'
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            'Не удалось связаться с ассистентом. Проверьте API-ключ и подключение к интернету.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Плавающая кнопка */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="no-print fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg grid place-items-center transition-transform hover:scale-105"
        aria-label="AI-ассистент"
      >
        <Icon name={open ? 'close' : 'smart_toy'} className="text-[26px]" filled />
      </button>

      {/* Окно чата */}
      {open && (
        <div className="no-print fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-96 h-[28rem] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
          {/* Шапка */}
          <div className="bg-primary text-white px-4 py-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-white/20 grid place-items-center">
              <Icon name="smart_toy" className="text-[20px]" filled />
            </span>
            <div>
              <p className="font-semibold text-sm leading-tight">AI-помощник</p>
              <p className="text-xs text-white/80 leading-tight">Mentoria Hub</p>
            </div>
          </div>

          {/* Сообщения */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-800/60">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 px-3 py-2 rounded-2xl text-sm">
                  печатает…
                </div>
              </div>
            )}
          </div>

          {/* Ввод */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Напишите сообщение…"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              onClick={send}
              disabled={loading}
              className="w-10 h-10 rounded-xl bg-primary text-white grid place-items-center hover:bg-primary-dark disabled:opacity-50 transition-colors"
              aria-label="Отправить"
            >
              <Icon name="send" className="text-[20px]" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
