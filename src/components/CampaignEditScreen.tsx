import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { updateCampaign } from "../services/createCampaign";
import { getBaseUrl } from '@/services/utils/baseUrl';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface CampaignEditScreenProps {
    campaignId: string;
  onBack: () => void;
  onSave: () => void;
}

interface CampaignPayload {
    title: string;
    description: string;
    category: string;
    start_date?: string;
    end_date?: string;       // optional
    start_time?: string;     // optional
    end_time?: string;       // optional
    city: string;
    address: string;        // optional
    compensation: string;
    required_people: number;
    deadline: string;
    pro_only: boolean;
    gender_preference: 'any' | 'women' | 'men';
  }

const CampaignEditScreen: React.FC<CampaignEditScreenProps> = ({ campaignId,onBack, onSave }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    city: '',
    address: '',
    compensation: '',
    required_people: 1,
    deadline: '',
    pro_only: false,
    gender_preference: 'any' as 'any' | 'women' | 'men'
  });

  const [loading, setLoading] = useState(false); // submitting
  const [fetching, setFetching] = useState(true); // fetching initial data

  useEffect(() => {
      const loadCampaign = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const baseUrl = await getBaseUrl();
          const res = await axios.get<CampaignPayload>(`${baseUrl}/api/campaigns/${campaignId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setFormData(res.data);
        } catch (err) {
          console.error("Error loading campaign:", err);
        } finally {
          setFetching(false);
        }
      };

      if (campaignId) loadCampaign();
  }, [campaignId]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      await updateCampaign(campaignId, formData, token);
      alert(t('campaigns.updatedSuccessfully'));
      onSave();
    } catch (error: any) {
      console.error(error);
      alert(t('campaigns.updateError') + ": " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-700" />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-8 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">{t('campaigns.edit')}</h1>
          </div>
          <LanguageSelector />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('campaigns.details')}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('campaigns.name')}</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder={t('campaigns.titlePlaceholder')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('campaigns.description')}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 h-24 resize-none"
                placeholder={t('campaigns.descriptionPlaceholder')}
                maxLength={500}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile-creation.category')}</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                >
                  <option value="">{t('profile-creation.category.select')}</option>
                  <option value="Hostess">{t('profile-creation.category.hostess')}</option>
                  <option value="Model">{t('profile-creation.category.model')}</option>
                  <option value="Photographer">{t('profile-creation.category.photographer')}</option>
                  <option value="Promoter">{t('profile-creation.category.promotar')}</option>
                  <option value="Waiter">{t('profile-creation.category.waiter')}</option>
                  <option value="Other">{t('profile-creation.category.other')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('campaigns.deadline')}</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('campaignDetail.startDate')}</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('campaignDetail.endDate')}</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('campaigns.startTime')}</label>
                <input
                  type="text"
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('campaigns.endTime')}</label>
                <input
                  type="text"
                  value={formData.end_time}
                  onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('campaigns.city')}</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder={t('modelFeed.defaultCity')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('campaigns.address')}</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder={t('campaigns.addressPlaceholder')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('campaigns.compensation')}</label>
                <input
                  type="text"
                  value={formData.compensation}
                  onChange={(e) => setFormData({...formData, compensation: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="80"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('campaigns.requiredPeople')}</label>
                <input
                  type="number"
                  value={formData.required_people}
                  onChange={(e) => setFormData({...formData, required_people: Number(e.target.value)})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  min={1}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.pro_only}
                  onChange={(e) => setFormData({...formData, pro_only: e.target.checked})}
                  className="h-4 w-4"
                />
                <label className="text-sm font-medium text-slate-700">{t('campaigns.proOnly')}</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('campaignDetail.gender')}</label>
                <select
                  value={formData.gender_preference}
                  onChange={(e) => setFormData({...formData, gender_preference: e.target.value as 'any' | 'women' | 'men'})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="any">{t('modelFeed.genderAny')}</option>
                  <option value="women">{t('modelFeed.genderWomen')}</option>
                  <option value="men">{t('modelFeed.genderMen')}</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center bg-slate-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t('campaigns.creating')}
            </>
          ) : (
            t('settings.saveChanges')
          )}
        </button>
      </form>
    </div>
  );
};

export default CampaignEditScreen;
