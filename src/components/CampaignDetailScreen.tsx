
import React from 'react';
import { ArrowLeft, Clock, MapPin, Users, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

interface Campaign {
  id: number;
  title: string;
  agency: string;
  description: string;
  deadline: string;
  timeLeft: string;
  requirements: {
    gender: string;
    location: string;
    startDate: string;
    endDate: string;   
  };
  budget: string;
  applicants: number;
}

interface CampaignDetailScreenProps {
  campaign: Campaign;
  onBack: () => void;
  onApply: () => void;
}

const CampaignDetailScreen: React.FC<CampaignDetailScreenProps> = ({ campaign, onBack, onApply }) => {
  const { t } = useLanguage();
  const timeLeftDays = parseInt(campaign.timeLeft.split(' ')[0]);
  const isUrgent = timeLeftDays <= 5;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-16 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 ml-4">{t('campaignDetail.title')}</h1>
          </div>
          <div className="flex items-center">
            <LanguageSelector />
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Campaign Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{campaign.title}</h2>
              <p className="text-lg text-slate-600 font-medium">{campaign.agency}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-bold ${
              isUrgent ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              <Clock className="w-4 h-4 inline mr-1" />
              {campaign.timeLeft}
            </div>
          </div>

          {/* Budget & Applicants */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-slate-700">{t('campaignDetail.budget')}</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{campaign.budget}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-slate-700">{t('campaignDetail.applicants')}</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{campaign.applicants}</div>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-slate-600 mr-3" />
              <span className="font-medium text-slate-700">{t('campaignDetail.deadline')}</span>
            </div>
            <span className="font-bold text-slate-900">
              {new Date(campaign.deadline).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>

          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">{t('campaignDetail.description')}</h3>
          <p className="text-slate-700 leading-relaxed mb-6">{campaign.description}</p>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">{t('campaignDetail.whatWeLookFor')}</h4>
            <ul className="space-y-2">
              {campaign.description
                .split(".") // split paragraph into sentences
                .map((sentence, index) => {
                  const trimmed = sentence.trim();
                  if (!trimmed) return null; // skip empty parts
                  return (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{trimmed}</span>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>


        {/* Requirements */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-32">
          <h3 className="text-lg font-bold text-slate-900 mb-4">{t('campaignDetail.requirements')}</h3>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">{t('campaignDetail.startDate')}</span>
              <span className="font-semibold text-slate-900">
                {new Date(campaign.requirements.startDate).toLocaleDateString("it-IT")}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">{t('campaignDetail.endDate')}</span>
              <span className="font-semibold text-slate-900">
                {new Date(campaign.requirements.endDate).toLocaleDateString("it-IT")}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">{t('campaignDetail.gender')}</span>
              <span className="font-semibold text-slate-900">{campaign.requirements.gender}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">{t('campaignDetail.location')}</span>
              <span className="font-semibold text-slate-900">{campaign.requirements.location}</span>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-200">
          <button
            onClick={onApply}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors"
          >
{t('campaignDetail.apply')}
          </button>
          <p className="text-xs text-slate-500 text-center mt-3">
{t('campaignDetail.reviewTime')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailScreen;
