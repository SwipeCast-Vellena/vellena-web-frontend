import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Video, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { createOrUpdateAgencyProfile, getAgencyProfile} from '../services/createOrUpdateAgencyProfile';

interface ProfileEditScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

const ProfileEditScreenAgency: React.FC<ProfileEditScreenProps> = ({ onBack, onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    operating_years: '',
    no_of_employees: '',
    location: '',
    professional_bio: '',
    website: ''
  });
  
  const { t } = useLanguage();

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getAgencyProfile(); // fetch from backend
        if (profile) {
          setFormData({
            name: profile.name || '',
            operating_years: profile.operating_years?.toString() || '',
            no_of_employees: profile.no_of_employees?.toString() || '',
            location: profile.location || '',
            professional_bio: profile.professional_bio || '',
            website: profile.website || ''
          });
          
        }
      } catch (error: any) {
        console.error(t('profileCreation.errorSaving'), error.message);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createOrUpdateAgencyProfile({
        name: formData.name,
        operating_years: Number(formData.operating_years),
        no_of_employees: Number(formData.no_of_employees),
        location: formData.location,
        professional_bio: formData.professional_bio,
        website: formData.website || null,
      });

      alert(t('settings.profileUpdated'));
      onComplete();

    } catch (error: any) {
      alert(error.message || t('settings.profileUpdateError'));
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
          <h1 className="text-2xl font-bold text-slate-900 ml-4">{t('Edit your Profile')}</h1>
        </div>
        <p className="text-slate-600">{t('Agency')}</p>
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.location')}</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.bio')}</label>
              <textarea
                value={formData.professional_bio}
                onChange={(e) => setFormData({...formData, professional_bio: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 h-24 resize-none"
                required
              />
            </div>
          </div>
        </div>

          

        {/* Submit Button */}
        <div className="pt-4 pb-10">
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors"
          >
            {t('Save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditScreenAgency;
