
import React, { useState } from 'react';
import { ArrowLeft, Upload, Video, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { createOrUpdateAgencyProfile } from '../services/createOrUpdateAgencyProfile'

interface ProfileCreationScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

const ProfileCreationScreenAgency: React.FC<ProfileCreationScreenProps> = ({ onBack, onComplete }) => {
    const [formData, setFormData] = useState({
      name: '',
      operating_years: '',
      no_of_employees: '',
      location: '',
      professional_bio: '',
      website: ''
    });
    const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // start loading
    try {
      await createOrUpdateAgencyProfile({
        name: formData.name,
        operating_years: Number(formData.operating_years),
        no_of_employees: Number(formData.no_of_employees),
        location: formData.location,
        professional_bio: formData.professional_bio,
        website: formData.website || null,
      });

      alert(t('profileCreation.profileSaved'));
      onComplete();
    } catch (error: any) {
      alert(error.message || t('profileCreation.errorSaving'));
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-16 pb-4">
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 ml-4">{t('Page.title')}</h1>
        </div>
        <p className="text-slate-600">{t('page.subtitle')}</p>
      </div>

      <div className="absolute top-8 right-6 z-10">
        <LanguageSelector />
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            {t('page.info')}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.agency.name')}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder={t('profile-creation.agency.name.placeholder')}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.years')}</label>
                <input
                  type="number"
                  value={formData.operating_years}
                  onChange={(e) => setFormData({...formData, operating_years: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="25"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.employee')}</label>
                <input
                  type="text"
                  value={formData.no_of_employees}
                  onChange={(e) => setFormData({...formData, no_of_employees: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="15"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.agency.website')}</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder={t('profile-creation.agency.website.placeholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.location')}</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder={t('modelFeed.defaultCity')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.bio')}</label>
              <textarea
                value={formData.professional_bio}
                onChange={(e) => setFormData({...formData, professional_bio: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 h-24 resize-none"
                placeholder={t('profile-creation.bio.placeholder')}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? t('settings.save') : t('profile-creation.complete')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileCreationScreenAgency;
