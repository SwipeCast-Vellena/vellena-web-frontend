// src/screens/CampaignListScreen.tsx
import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Users, Calendar, Plus } from 'lucide-react';
import { getCampaigns } from '../services/getCampaigns';
import { CalendarDays } from "lucide-react";

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
    startDate: string;  // ✅ added
    endDate: string;   
  };
  budget: string;
  applicants: number;
}

interface CampaignListScreenProps {
  onBack: () => void;
  onCampaignSelect: (campaign: Campaign) => void;
  onCreateCampaign?: () => void;
}

const CampaignListScreen: React.FC<CampaignListScreenProps> = ({
  onBack,
  onCampaignSelect,
  onCreateCampaign,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns();
        const mapped = data.map((item: any) => {
          // Calculate time left until deadline
          const deadlineDate = new Date(item.deadline);
          const diffTime = deadlineDate.getTime() - new Date().getTime();
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const timeLeft =
            daysLeft > 0 ? `${daysLeft} giorni rimasti` : 'Scaduto';

          return {
            id: item.id,
            title: item.title,
            agency: item.agency_name,
            description: item.description,
            deadline: item.deadline,
            timeLeft,
            requirements: {
              gender:
                item.gender_preference === 'any'
                  ? 'Qualsiasi'
                  : item.gender_preference === 'women'
                  ? 'Femminile'
                  : 'Maschile',
              location: `${item.city}${item.address ? ', ' + item.address : ''}`,
              startDate: item.start_date,   // ✅ added
              endDate: item.end_date || '', // ✅ added (empty string if null)
            },
            budget: `€${item.compensation}`,
            applicants: item.required_people, // mapped from DB
          };
        });
        setCampaigns(mapped);
      } catch (error) {
        console.error('Failed to load campaigns', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Caricamento campagne...</p>
      </div>
    );
  }

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
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {campaign.title}
                </h3>
                <p className="text-slate-600 font-medium">{campaign.agency}</p>
              </div>
              <div className="text-right">
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  {campaign.timeLeft}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-700 mb-4 leading-relaxed">
              {campaign.description}
            </p>

            {/* Requirements Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-slate-600">
                <span className="w-4 h-4 mr-2 text-center">👤</span>
                <span>{campaign.requirements.gender}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{campaign.requirements.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                  <CalendarDays className="w-5 h-5 text-blue-500" />
                  <span>
                  Start: {new Date(campaign.requirements.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                  <CalendarDays className="w-5 h-5 text-red-500" />
                  <span>
                    End: {new Date(campaign.requirements.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>

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
    </div>
  );
};

export default CampaignListScreen;
