import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { KeyRound, Mail, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Logo from '../components/Logo';
import { API_BASE } from '../utils/api';

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Try to retrieve email from register state, otherwise default to empty
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Укажите email адрес');
      return;
    }
    if (code.length < 6) {
      toast.error('Код должен состоять из 6 цифр');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/confirm-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: code.trim() }),
      });
      const data = await response.json();

      if (response.ok) {
        login(data.access_token, data.user);
        toast.success('Почта успешно подтверждена!');
        navigate('/onboarding');
      } else {
        toast.error(data.detail || 'Неверный код подтверждения');
      }
    } catch (err) {
      toast.error('Ошибка сети. Проверьте соединение.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Укажите email адрес');
      return;
    }
    setResending(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/resend-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        toast.success('Новый код отправлен на вашу почту!');
        setTimer(60); // Start 60s cooldown
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Не удалось отправить код');
      }
    } catch (err) {
      toast.error('Ошибка сети при повторной отправке');
    } finally {
      setResending(false);
    }
  };

  const field =
    'block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand focus:bg-white dark:focus:bg-slate-800 transition-all text-center tracking-[0.3em] font-mono text-lg';

  const emailField =
    'block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand focus:bg-white dark:focus:bg-slate-800 transition-all';

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <Logo to="/" size="lg" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">Подтверждение почты</h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Мы отправили 6-значный код на вашу почту
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-3xl border border-slate-100 dark:border-slate-800">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {!location.state?.email && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email почта</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={emailField}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            )}

            {location.state?.email && (
              <div className="bg-brand-soft/40 border border-brand-soft rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Код отправлен на</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{email}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
                Код подтверждения
              </label>
              <div className="relative flex justify-center items-center">
                {/* 6 Visual OTP boxes */}
                <div className="flex gap-2 sm:gap-3 justify-center w-full">
                  {Array.from({ length: 6 }).map((_, index) => {
                    const digit = code[index] || '';
                    const isFocused = index === code.length || (index === 5 && code.length === 6);
                    return (
                      <div
                        key={index}
                        className={`w-11 h-14 sm:w-12 sm:h-16 rounded-xl border-2 flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-200 ${
                          isFocused
                            ? 'border-brand bg-brand-soft/20 text-brand shadow-lg shadow-brand/10 scale-105'
                            : digit
                            ? 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400'
                        }`}
                      >
                        {digit || (isFocused ? (
                          <span className="w-1.5 h-5 bg-brand rounded-full animate-pulse" />
                        ) : (
                          '•'
                        ))}
                      </div>
                    );
                  })}
                </div>
                {/* Hidden real input */}
                <input
                  type="text"
                  required
                  maxLength={6}
                  pattern="[0-9]*"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-center"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
            >
              {loading ? 'Проверяем код…' : 'Активировать аккаунт'}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            {timer > 0 ? (
              <p className="text-xs text-slate-400">
                Запросить новый код можно через {timer} сек.
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending || !email}
                className="text-xs font-semibold text-brand hover:text-brand-dark transition-colors disabled:opacity-50"
              >
                {resending ? 'Отправляем…' : 'Отправить код повторно'}
              </button>
            )}

            <button
              onClick={() => navigate('/login')}
              className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" /> Вернуться к входу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
