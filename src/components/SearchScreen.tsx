
import React, { useState } from 'react';
import { Search, Filter, MapPin, Briefcase } from 'lucide-react';

interface SearchScreenProps {
  onUserSelect?: (userId: number) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'model' | 'hostess' | 'agency'>('all');

  const searchResults = [
    {
      id: 1,
      name: "Sarah Johnson",
      profession: "Modella di Moda",
      location: "Milano, Italia",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      category: 'model'
    },
    {
      id: 2,
      name: "Emma Davis", 
      profession: "Hostess per Eventi",
      location: "Roma, Italia",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      category: 'hostess'
    },
    {
      id: 3,
      name: "Marketing Plus Agency",
      profession: "Agenzia di Talenti",
      location: "Napoli, Italia", 
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      category: 'agency'
    }
  ];

  const filteredResults = activeFilter === 'all' 
    ? searchResults 
    : searchResults.filter(result => result.category === activeFilter);

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
            { id: 'all', label: 'Tutti' },
            { id: 'model', label: 'Modelle' },
            { id: 'hostess', label: 'Hostess' },
            { id: 'agency', label: 'Agenzie' }
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
        {filteredResults.map((result) => (
          <div key={result.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
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
                  <span className="text-sm">{result.profession}</span>
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
        ))}
      </div>
    </div>
  );
};

export default SearchScreen;
