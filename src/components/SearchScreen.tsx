import React, { useState, useEffect } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import { getBaseUrl } from "@/services/utils/baseUrl";
import axios from "axios";

interface SearchScreenProps {
  onUserSelect?: (userId: number) => void;
}

interface BackendModel {
  id: number;
  name: string;
  description: string;  // <-- required
  location: string;
  category: string;
  image: string;
}

interface BackendResponse {
  success: boolean;
  count: number;
  models: BackendModel[];
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<"all" | "model" | "hostess" | "agency">("all");
  const [profiles, setProfiles] = useState<BackendModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const baseUrl = await getBaseUrl();
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<BackendResponse>(
          `${baseUrl}/api/agency/model-profiles`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const backendModels = res.data.models;

        setProfiles(
          backendModels.map((m) => ({
            id: m.id,
            name: m.name,
            description: m.description || "N/A",   // ✅ must exist
            location: m.location,
            category: m.category,
            image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
          }))
        );

      } catch (error) {
        console.error("Failed to load profiles", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // 🔍 Apply search & filter
  const filteredResults = profiles.filter((profile) => {
    const matchesFilter =
      activeFilter === "all" || profile.category === activeFilter;
    const matchesSearch =
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleUserClick = (userId: number) => {
    if (onUserSelect) {
      onUserSelect(userId);
    }
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
            { id: "all", label: "Tutti" },
            { id: "model", label: "Modelle" },
            { id: "hostess", label: "Hostess" },
            { id: "agency", label: "Agenzie" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
        ) : filteredResults.length > 0 ? (
          filteredResults.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={result.image}
                  alt={result.name}
                  className="w-16 h-16 rounded-xl object-cover cursor-pointer"
                  onClick={() => handleUserClick(result.id)}
                />
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
        ) : (
          <p className="text-center text-slate-500">Nessun risultato trovato</p>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;
