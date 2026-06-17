import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, KeyRound, Lock, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Logo from '../components/Logo';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Укажите email');
      return;
    }
    if (code.length < 6) {
      toast.error('Введите 6-значный код восстановления');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Пароль должен состоять минимум из 6 символов');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: code.trim(),
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        toast.success('Пароль успешно изменен! Войдите с новым паролем.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const data = await response.json();
        toast.error(data.detail || 'Неверный код или срок действия кода истек');
      }
    } catch (err) {
      toast.error('Ошибка сети. Проверьте соединение.');
    } finally {
      setLoading(false);
    }
  };

  const field =
    'block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand focus:bg-white dark:focus:bg-slate-800 transition-all';

  const codeField =
    'block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand focus:bg-white dark:focus:bg-slate-800 transition-all text-center tracking-[0.3em] font-mono text-lg';

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <Logo to="/" size="lg" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">Новый пароль</h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Введите полученный код восстановления и новый пароль
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-3xl border border-slate-100 dark:border-slate-800">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!location.state?.email && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email почта</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={field}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            )}

            {location.state?.email && (
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Восстановление для</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{email}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
                Код восстановления
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

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Новый пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={field}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Подтвердите пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={field}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 6 || newPassword.length < 6}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
            >
              {loading ? 'Сбрасываем пароль…' : 'Сохранить и войти'}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800 pt-4">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Изменить email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
