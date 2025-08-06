
import React from 'react';
import { ArrowLeft, Clock, MapPin, Users, Calendar, DollarSign, CheckCircle } from 'lucide-react';

interface Campaign {
  id: number;
  title: string;
  agency: string;
  description: string;
  deadline: string;
  timeLeft: string;
  requirements: {
    ageRange: string;
    height: string;
    gender: string;
    location: string;
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
  const timeLeftDays = parseInt(campaign.timeLeft.split(' ')[0]);
  const isUrgent = timeLeftDays <= 5;

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
          <h1 className="text-xl font-bold text-slate-900 ml-4 flex-1">Dettagli Campagna</h1>
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
                <span className="text-sm font-medium text-slate-700">Budget</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{campaign.budget}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-slate-700">Candidati</span>
              </div>
              <div className="text-xl font-bold text-slate-900">{campaign.applicants}</div>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-slate-600 mr-3" />
              <span className="font-medium text-slate-700">Scadenza Candidature</span>
            </div>
            <span className="font-bold text-slate-900">{campaign.deadline}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Descrizione Campagna</h3>
          <p className="text-slate-700 leading-relaxed mb-6">{campaign.description}</p>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Cosa cerchiamo:</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Esperienza professionale nel modeling o hosting eventi</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Eccellenti capacità di comunicazione e presentazione</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Aspetto professionale e etica del lavoro affidabile</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700">Disponibile per l'intera durata della campagna</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Requisiti</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">Fascia di Età</span>
              <span className="font-semibold text-slate-900">{campaign.requirements.ageRange} anni</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">Requisiti di Altezza</span>
              <span className="font-semibold text-slate-900">{campaign.requirements.height}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">Genere</span>
              <span className="font-semibold text-slate-900">{campaign.requirements.gender}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <span className="font-medium text-slate-700">Località</span>
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
            Candidati per questa Campagna
          </button>
          <p className="text-xs text-slate-500 text-center mt-3">
            La tua candidatura sarà revisionata entro 24-48 ore
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailScreen;
