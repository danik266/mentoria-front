import { useState, useRef, useEffect } from 'react'
import Icon from './Icon'
import { API_BASE } from '../utils/api'

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
  const [open, setOpen]       = useState(false)
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Здравствуйте! Я помощник Mentoria Hub. Спросите меня про олимпиады, курсы или поступление.',
    },
  ])
  const scrollRef = useRef(null)
  const inputRef  = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, loading])

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: nextMessages
            .filter((m) => m.role === 'user' || m.role === 'assistant')
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `HTTP ${res.status}`)
      }

      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Не удалось получить ответ: ${e.message}`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE])
  }

  return (
    <>
      {/* Floating button */}
      <button
        id="ai-assistant-toggle"
        onClick={() => setOpen((o) => !o)}
        className="no-print fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-xl shadow-brand/30 grid place-items-center transition-all duration-300 hover:scale-110 hover:shadow-brand/50 hover:shadow-2xl"
        aria-label="AI-ассистент"
      >
        <span className={`transition-all duration-300 ${open ? 'rotate-90 scale-75' : ''}`}>
          <Icon name={open ? 'close' : 'smart_toy'} className="text-[26px]" filled />
        </span>
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-brand/40 animate-ping" />
        )}
      </button>

      {/* Chat window */}
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
            {/* Clear button */}
            <button
              onClick={clearChat}
              title="Очистить чат"
              className="p-1.5 rounded-xl hover:bg-white/20 text-white/70 hover:text-white transition-colors"
            >
              <Icon name="refresh" className="text-[18px]" />
            </button>
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 text-white/70 hover:text-white transition-colors"
            >
              <Icon name="close" className="text-[18px]" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)' }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-brand grid place-items-center shrink-0 mt-0.5 shadow-sm">
                    <Icon name="smart_toy" className="text-[14px] text-white" filled />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                    m.role === 'user'
                      ? 'bg-brand text-white rounded-br-sm'
                      : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Quick suggestion chips (shown when only welcome message) */}
            {messages.length === 1 && !loading && (
              <div className="pt-2 pl-9 flex flex-wrap gap-2">
                {[
                  'Что мне изучить дальше?',
                  'Какие олимпиады подходят мне?',
                  'Как подготовиться к поступлению?',
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      setInput(chip)
                      setTimeout(() => send(), 0)
                    }}
                    className="text-xs px-3.5 py-2 rounded-full bg-white dark:bg-slate-800 text-brand hover:bg-brand hover:text-white font-medium transition-all shadow-sm border border-slate-200 dark:border-slate-700 hover:border-brand"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-xl bg-brand grid place-items-center shrink-0 mt-0.5 shadow-sm">
                  <Icon name="smart_toy" className="text-[14px] text-white" filled />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-end gap-2 bg-white dark:bg-slate-900 shrink-0">
            <textarea
              ref={inputRef}
              id="ai-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишите сообщение… (Enter — отправить)"
              rows={1}
              className="flex-1 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none transition-all max-h-24"
              style={{ fieldSizing: 'content' }}
            />
            <button
              id="ai-chat-send"
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-2xl bg-brand text-white grid place-items-center hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-sm shadow-brand/20 shrink-0"
              aria-label="Отправить"
            >
              <Icon name="send" className="text-[18px]" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
