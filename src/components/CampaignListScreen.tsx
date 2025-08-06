
import React from 'react';
import { ArrowLeft, Clock, MapPin, Users, Calendar, Plus } from 'lucide-react';

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

interface CampaignListScreenProps {
  onBack: () => void;
  onCampaignSelect: (campaign: Campaign) => void;
  onCreateCampaign?: () => void;
}

const CampaignListScreen: React.FC<CampaignListScreenProps> = ({ onBack, onCampaignSelect, onCreateCampaign }) => {
  const campaigns: Campaign[] = [
    {
      id: 1,
      title: "Fashion Week Estate 2024",
      agency: "Elite Fashion Agency",
      description: "Cerchiamo modelle professionali per sfilate e servizi fotografici di alta moda per la fashion week.",
      deadline: "15 Marzo 2024",
      timeLeft: "5 giorni rimasti",
      requirements: {
        ageRange: "18-28",
        height: "1,72m - 1,83m",
        gender: "Femminile",
        location: "Milano, Italia"
      },
      budget: "€2.500 - €5.000",
      applicants: 47
    },
    {
      id: 2,
      title: "Evento Lancio Prodotto Tech",
      agency: "Corporate Events Pro",
      description: "Hostess professionali necessarie per evento di lancio prodotto e networking di importante azienda tech.",
      deadline: "20 Marzo 2024",
      timeLeft: "10 giorni rimasti",
      requirements: {
        ageRange: "22-35",
        height: "1,65m - 1,78m",
        gender: "Qualsiasi",
        location: "Roma, Italia"
      },
      budget: "€800 - €1.200",
      applicants: 23
    },
    {
      id: 3,
      title: "Brand Ambassador Lusso",
      agency: "Premium Marketing Group",
      description: "Brand ambassador per campagna gioielli di lusso inclusi servizi fotografici ed eventi promozionali.",
      deadline: "25 Marzo 2024",
      timeLeft: "15 giorni rimasti",
      requirements: {
        ageRange: "25-35",
        height: "1,68m - 1,80m",
        gender: "Femminile",
        location: "Firenze, Italia"
      },
      budget: "€3.000 - €7.500",
      applicants: 31
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-12 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Campagne</h1>
          </div>
          <button
            onClick={onCreateCampaign}
            className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Campaign List */}
      <div className="px-6 py-4 space-y-4">
        {campaigns.map((campaign) => (
          <div 
            key={campaign.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onCampaignSelect(campaign)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{campaign.title}</h3>
                <p className="text-slate-600 font-medium">{campaign.agency}</p>
              </div>
              <div className="text-right">
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  {campaign.timeLeft}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-700 mb-4 leading-relaxed">{campaign.description}</p>

            {/* Requirements Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-slate-600">
                <Users className="w-4 h-4 mr-2" />
                <span>Età: {campaign.requirements.ageRange}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <span className="w-4 h-4 mr-2 text-center">📏</span>
                <span>Altezza: {campaign.requirements.height}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <span className="w-4 h-4 mr-2 text-center">👤</span>
                <span>{campaign.requirements.gender}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{campaign.requirements.location}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Scadenza: {campaign.deadline}</span>
                </div>
                <div className="text-sm text-slate-600">
                  {campaign.applicants} candidati
                </div>
              </div>
              <div className="text-lg font-bold text-slate-900">
                {campaign.budget}
              </div>
            </div>

            {/* Apply Button */}
            <button className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors">
              Candidati Ora
            </button>
          </div>
        ))}
      </div>

      {/* Filter/Sort Options */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-slate-700 font-medium">Filtra e Ordina</span>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                Località
              </button>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                Budget
              </button>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                Scadenza
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignListScreen;
