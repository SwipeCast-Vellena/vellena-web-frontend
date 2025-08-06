
import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthScreenProps {
  isLogin: boolean;
  onBack: () => void;
  onSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ isLogin, onBack, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center px-6 pt-16 pb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 ml-4">
          {isLogin ? t('auth.login') : t('auth.signUp')}
        </h1>
      </div>

      <div className="flex-1 px-6">
        <div className="max-w-md mx-auto">
          <p className="text-slate-600 mb-8">
            {isLogin 
              ? 'Accedi per accedere alla tua rete professionale'
              : 'Unisciti alla piattaforma professionale per il matching di talenti'
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="Inserisci il tuo nome completo"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Indirizzo Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Inserisci la tua email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent pr-12"
                  placeholder="Inserisci la tua password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                  required
                />
                <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
                  Accetto i Termini di Servizio e l'Informativa sulla Privacy, e confermo che questo account è esclusivamente per uso professionale.
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors"
            >
              {isLogin ? 'Accedi' : 'Crea Account'}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-50 text-slate-500">O continua con</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full bg-white border border-slate-200 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Google
              </button>
              <button className="w-full bg-white border border-slate-200 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Apple ID
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              {isLogin ? "Non hai un account? " : "Hai già un account? "}
              <button
                onClick={onBack}
                className="font-semibold text-slate-900 hover:underline"
              >
                {isLogin ? 'Registrati' : 'Accedi'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
