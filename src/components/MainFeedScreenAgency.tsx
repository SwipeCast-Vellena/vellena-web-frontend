
import React, { useState } from 'react';
import { Heart, X, MessageCircle, MapPin, Calendar, Play, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  bio: string;
  videoThumbnail: string;
  profession: string;
  category: 'model' | 'hostess' | 'agency';
}

interface MainFeedScreenProps {
  onMatch: () => void;
  onOpenChat: () => void;
  onUserSelect?: (userId: number) => void;
}

const MainFeedScreenAgency: React.FC<MainFeedScreenProps> = ({ onMatch, onOpenChat, onUserSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | 'model' | 'hostess' | 'agency'>('all');
  
  const allProfiles: Profile[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 24,
      location: "Milano, Italia",
      bio: "Modella professionale con oltre 3 anni di esperienza in moda e lavori commerciali",
      videoThumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      profession: "Modella di Moda",
      category: 'model'
    },
    {
      id: 2,
      name: "Emma Davis",
      age: 26,
      location: "Roma, Italia",
      bio: "Hostess per eventi specializzata in eventi aziendali e lanci di prodotti",
      videoThumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      profession: "Hostess per Eventi",
      category: 'hostess'
    },
    {
      id: 3,
      name: "Marketing Plus Agency",
      age: 0,
      location: "Napoli, Italia",
      bio: "Agenzia di talenti di primo livello alla ricerca di modelle per campagne fashion week",
      videoThumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      profession: "Agenzia di Talenti",
      category: 'agency'
    },
    {
      id: 4,
      name: "Jessica Miller",
      age: 23,
      location: "Torino, Italia",
      bio: "Modella professionale per passerelle e spot commerciali specializzata in beauty e lifestyle",
      videoThumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      profession: "Modella Commerciale",
      category: 'model'
    },
    {
      id: 5,
      name: "Alex Thompson",
      age: 28,
      location: "Firenze, Italia",
      bio: "Host professionale per fiere, conferenze ed eventi di lusso",
      videoThumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      profession: "Host per Eventi",
      category: 'hostess'
    }
  ];

  const filteredProfiles = activeCategory === 'all' 
    ? allProfiles 
    : allProfiles.filter(profile => profile.category === activeCategory);

  const currentProfile = filteredProfiles[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      onMatch();
    }
    
    setCurrentIndex((prev) => 
      prev === filteredProfiles.length - 1 ? 0 : prev + 1
    );
  };

  const handleCategoryChange = (category: 'all' | 'model' | 'hostess' | 'agency') => {
    setActiveCategory(category);
    setCurrentIndex(0);
  };

  const handleNameClick = () => {
    if (onUserSelect && currentProfile) {
      onUserSelect(currentProfile.id);
    }
  };

  if (!currentProfile) return null;

  const categories = [
    { id: 'all', label: 'Tutti' },
    { id: 'model', label: 'Modelle' },
    { id: 'hostess', label: 'Hostess' },
    { id: 'agency', label: 'Agenzie' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Video/Image Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${currentProfile.videoThumbnail})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-12 pb-2">
        <div>
          <h1 className="text-xl font-bold text-white">yo_work</h1>
        </div>
        <button
          onClick={onOpenChat}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Profile Card */}
      <div className="absolute bottom-20 left-0 right-0 p-6 z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 mb-6">
          {/* Video Preview */}
          <div className="relative w-full h-48 bg-slate-200 rounded-2xl overflow-hidden mb-4">
            <img 
              src={currentProfile.videoThumbnail}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                <Play className="w-8 h-8 text-slate-900 ml-1" fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <button
                onClick={handleNameClick}
                className="text-left hover:underline transition-all"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-1 hover:text-slate-700">
                  {currentProfile.name}
                  {currentProfile.age > 0 && (
                    <span className="text-slate-600 font-normal">, {currentProfile.age}</span>
                  )}
                </h2>
              </button>
              <div className="flex items-center text-slate-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{currentProfile.location}</span>
              </div>
              <div className="bg-slate-100 px-3 py-1 rounded-full inline-block">
                <span className="text-xs font-medium text-slate-700">{currentProfile.profession}</span>
              </div>
            </div>
          </div>
          
          <p className="text-slate-700 leading-relaxed mb-4">{currentProfile.bio}</p>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-white text-slate-900'
                    : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-8">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            <X className="w-8 h-8 text-slate-600" />
          </button>
          
          <button
            onClick={() => handleSwipe('right')}
            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            <Heart className="w-10 h-10 text-white" fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Profile Counter */}
      <div className="absolute top-20 right-6 z-10 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
        <span className="text-white text-sm font-medium">
          {currentIndex + 1} / {filteredProfiles.length}
        </span>
      </div>
    </div>
  );
};

export default MainFeedScreenAgency;
