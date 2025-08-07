
import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { registerUser, RegisterFormData } from '../services/registerUser';
import { loginUser, LoginFormData } from '../services/loginUser';

interface AuthScreenProps {
  isLogin: boolean;
  onBack: () => void;
  onSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ isLogin, onBack, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const loginData: LoginFormData = {
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        const res = await loginUser(loginData);
        console.log('Logged in:', res);

        // Maybe store token in localStorage or context
        // localStorage.setItem('token', res.token);

      } else {
        const registerData: RegisterFormData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        };

        const res = await registerUser(registerData);
        console.log('Registered:', res);
      }

      onSuccess(); // navigate or show success
    } catch (err: any) {
    const errorMsg = err.message || 'Something went wrong';
    setError(errorMsg);
    console.error(errorMsg);
  }
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

      <div className="absolute top-8 right-6 z-10">
        <LanguageSelector />
      </div>

      <div className="flex-1 px-6 mt-[-50px]">
        <div className="max-w-md mx-auto">
        <p className="font-bold text-slate-900 mb-8">
          {isLogin 
            ? t('auth.title.2')
            : t('auth.title.1')
          }
        </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('auth.joinAs')}
              </label>

              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-4 pr-10 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent appearance-none"
                required
              >
                <option value="">{t('auth.selectRole')}</option>
                <option value="model">{t('auth.role.model')}</option>
                <option value="agency">{t('auth.role.agency')}</option>
              </select>

              {/* Custom Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-5 top-7 flex items-center">
                <svg
                  className="w-5 h-5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>



            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('auth.fullName')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder={t('auth.name.placeholder')}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('auth.email') }
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder={t('auth.email.placeholder')}
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
                  placeholder={t('auth.password.placeholder')}
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
                  {t('auth.term')}
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors"
            >
              {isLogin ? t('auth.login') : t('auth.create')}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-50 text-slate-500">{t('auth.continue')}</span>
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
              {isLogin ? "Non hai un account? " : t('auth.haveAccount')}
              <button
                onClick={onBack}
                className="font-semibold text-slate-900 hover:underline"
              >
                {isLogin ? t('auth.signUp') : t('auth.login')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
