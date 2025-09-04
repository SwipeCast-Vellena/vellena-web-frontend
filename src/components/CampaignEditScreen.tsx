import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { updateCampaign } from "../services/createCampaign";
import { getBaseUrl } from '@/services/utils/baseUrl';
import axios from 'axios';

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
      alert("Campagna aggiornata con successo!");
      onSave();
    } catch (error: any) {
      console.error(error);
      alert("Errore nella modifica della campagna: " + (error.message || error));
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
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">modifica campagna</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Dettagli Campagna</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Titolo Campagna</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Fashion Week Estate 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Descrizione</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 h-24 resize-none"
                placeholder="Descrivi i requisiti della tua campagna..."
                maxLength={500}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                >
                  <option value="">Seleziona Categoria</option>
                  <option value="Hostess">Hostess</option>
                  <option value="Model">Model</option>
                  <option value="Photographer">Photographer</option>
                  <option value="Promoter">Promoter</option>
                  <option value="Waiter">Waiter</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Scadenza</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Data Inizio</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Data Fine</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Orario Inizio</label>
                <input
                  type="text"
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Orario Fine</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Città</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Milano"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Indirizzo</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Via, CAP, Italia"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Compenso (€)</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Numero Persone Richieste</label>
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
                <label className="text-sm font-medium text-slate-700">Pro profiles only</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Genere Preferito</label>
                <select
                  value={formData.gender_preference}
                  onChange={(e) => setFormData({...formData, gender_preference: e.target.value as 'any' | 'women' | 'men'})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="any">Qualsiasi</option>
                  <option value="women">Femminile</option>
                  <option value="men">Maschile</option>
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
              Salvataggio in corso...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
};

export default CampaignEditScreen;
