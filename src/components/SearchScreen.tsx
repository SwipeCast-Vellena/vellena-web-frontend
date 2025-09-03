
import React, { useState,useEffect } from 'react';
import { Search, Filter, MapPin, Briefcase } from 'lucide-react';
import { getBaseUrl } from '@/services/utils/baseUrl';
import axios from 'axios';
import { fetchPhotosByModelId } from '@/services/modelPhotos';

interface SearchScreenProps {
  onUserSelect?: (userId: number) => void;
}

interface BackendModel {
  id: number;
  name: string;
  location: string;
  category: string;
  description: string;
  image:string;
}


interface BackendResponse {
  success: boolean;
  count: number;
  models: BackendModel[];
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'model' | 'hostess' | 'agency'>('all');
  const [profiles, setProfiles] = useState<BackendModel[]>([]);
  const [loading, setLoading] = useState(true);
  

useEffect(() => {
  const fetchProfiles = async () => {
    const baseUrl = await getBaseUrl();
    console.log("Base URL:", baseUrl);

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const res = await axios.get<BackendResponse>(`${baseUrl}/api/agency/model-profiles`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Profiles response:", res.data);

      const backendModels = res.data.models;

      // Initially set profiles without any placeholder image
      const initialProfiles = backendModels.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description || "Modella",
        location: m.location,
        category: m.category.toLowerCase(),
        image: undefined // no image initially
      }));

      console.log("Initial profiles:", initialProfiles);

      setProfiles(initialProfiles);

      // Fetch photos separately without blocking the UI
      backendModels.forEach((m, index) => {
        fetchPhotosByModelId(m.id.toString(), token, (err, data) => {
          if (err) {
            console.error(`Error fetching photos for model ${m.id}:`, err);
            return;
          }

          console.log(`Photos data for model ${m.id}:`, data);

          const urls: string[] = [];
          if (data?.groups) {
            Object.values(data.groups).forEach((group: any) => {
              group.forEach((p: any) => {
                urls.push(`${baseUrl}${p.url}`);
              });
            });
          }

          console.log(`Photo URLs for model ${m.id}:`, urls);

          // Update the profile image if photos exist
          if (urls.length > 0) {
            setProfiles((prev) => {
              const updated = [...prev];
              updated[index] = { ...updated[index], image: urls[0] }; // use first photo
              return updated;
            });
          }
        });
      });

    } catch (error) {
      console.error("Failed to load profiles", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProfiles();
}, []);



  // const searchResults = [
  //   {
  //     id: 1,
  //     name: "Sarah Johnson",
  //     profession: "Modella di Moda",
  //     location: "Milano, Italia",
  //     image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  //     category: 'model'
  //   },
  //   {
  //     id: 2,
  //     name: "Emma Davis", 
  //     profession: "Hostess per Eventi",
  //     location: "Roma, Italia",
  //     image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  //     category: 'hostess'
  //   },
  //   {
  //     id: 3,
  //     name: "Marketing Plus Agency",
  //     profession: "Agenzia di Talenti",
  //     location: "Napoli, Italia", 
  //     image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  //     category: 'agency'
  //   }
  // ];

  // 🔍 Apply search & filter
  const filteredResults = profiles.filter((profile) => {
    const matchesFilter = activeFilter === 'all' || profile.category === activeFilter;
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          profile.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          profile.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // const filteredResults = activeFilter === 'all' 
  //   ? searchResults 
  //   : searchResults.filter(result => result.category === activeFilter);

  const handleUserClick = (userId: number) => {
    if (onUserSelect) {
      onUserSelect(userId);
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = ["#043584ff", "#73616146", "#895a09ff", "#034f35ff", "#200560ff"];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };


  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Cerca</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="Cerca professionisti..."
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'Tutti' },
            { id: 'model', label: 'Modelle' },
            { id: 'hostess', label: 'Hostess' },
            { id: 'photographer', label: 'Fotografo' },
            {id: 'other', label:'Altra'}
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-6 py-6 space-y-4">
        {loading ? (
          <p className="text-center text-slate-500">Caricamento...</p>
        ) : filteredResults.length > 0 ?(filteredResults.map((result) => (
          <div key={result.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center space-x-4">
              {result.image ? (
                <img
                  src={result.image}
                  alt={result.name}
                  className="w-16 h-16 rounded-xl object-cover cursor-pointer"
                  onClick={() => handleUserClick(result.id)}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-semibold cursor-pointer"
                  style={{ backgroundColor: getAvatarColor(result.name) }}
                  onClick={() => handleUserClick(result.id)}
                >
                  {result.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}

              <div className="flex-1">
                <h3 
                  className="text-lg font-semibold text-slate-900 cursor-pointer hover:text-slate-700 transition-colors"
                  onClick={() => handleUserClick(result.id)}
                >
                  {result.name}
                </h3>
                <div className="flex items-center text-slate-600 mb-1">
                  <Briefcase className="w-4 h-4 mr-1" />
                  <span className="text-sm">{result.description}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{result.location}</span>
                </div>
              </div>
              <button 
                onClick={() => handleUserClick(result.id)}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                Visualizza
              </button>
            </div>
          </div>
        ))
      ): (
        <p className="text-center text-slate-500">Nessun risultato trovato</p>
      )}
      </div>
    </div>
  );
};

export default SearchScreen;
