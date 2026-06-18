import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Logo from '../components/Logo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { API_BASE } from '../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success(t('forgot.codeSent'));
        // Wait a brief moment for toast, then redirect to reset page passing the email
        setTimeout(() => {
          navigate('/reset-password', { state: { email } });
        }, 1500);
      } else {
        const data = await response.json();
        toast.error(data.detail || t('forgot.failed'));
      }
    } catch (err) {
      toast.error(t('common.networkErrorShort'));
    } finally {
      setLoading(false);
    }
  };

  const field =
    'block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand focus:bg-white dark:focus:bg-slate-800 transition-all';

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <Logo to="/" size="lg" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">{t('forgot.title')}</h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          {t('forgot.subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-3xl border border-slate-100 dark:border-slate-800">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{t('forgot.emailLabel')}</label>
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

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
            >
              {loading ? t('forgot.submitting') : t('forgot.submit')}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800 pt-4">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> {t('forgot.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
