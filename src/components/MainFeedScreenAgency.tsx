import React, { useState, useEffect } from 'react';
import { Heart, X, MessageCircle, MapPin, Play, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

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
  onMatch?: () => void;
  onOpenChat?: () => void;
  onUserSelect?: (userId: number) => void;
}

const MainFeedScreenAgency: React.FC<MainFeedScreenProps> = ({ onMatch, onOpenChat, onUserSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<'all' | 'model' | 'hostess' | 'agency'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const allProfiles: Profile[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 24,
      location: "Milano, Italia",
      bio: "Professional model with 3+ years of experience in fashion and commercial work",
      videoThumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=1200&fit=crop",
      profession: "Fashion Model",
      category: 'model'
    },
    {
      id: 2,
      name: "Emma Davis",
      age: 26,
      location: "Roma, Italia",
      bio: "Event hostess specializing in corporate events and product launches",
      videoThumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=1200&fit=crop",
      profession: "Event Hostess",
      category: 'hostess'
    },
    {
      id: 3,
      name: "Marketing Plus",
      age: 0,
      location: "Napoli, Italia",
      bio: "Premier talent agency seeking models for fashion week campaigns",
      videoThumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=1200&fit=crop",
      profession: "Talent Agency",
      category: 'agency'
    },
    {
      id: 4,
      name: "Jessica Miller",
      age: 23,
      location: "Torino, Italia",
      bio: "Commercial model for runway and advertising, specializing in beauty and lifestyle",
      videoThumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1200&fit=crop",
      profession: "Commercial Model",
      category: 'model'
    },
    {
      id: 5,
      name: "Alex Thompson",
      age: 28,
      location: "Firenze, Italia",
      bio: "Professional host for trade shows, conferences, and luxury events",
      videoThumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop",
      profession: "Event Host",
      category: 'hostess'
    }
  ];

  const filteredProfiles = activeCategory === 'all' 
    ? allProfiles 
    : allProfiles.filter(profile => profile.category === activeCategory);

  const currentProfile = filteredProfiles[currentIndex];

  const categories = [
    { id: 'all', label: 'All', count: allProfiles.length },
    { id: 'model', label: 'Models', count: allProfiles.filter(p => p.category === 'model').length },
    { id: 'hostess', label: 'Hostess', count: allProfiles.filter(p => p.category === 'hostess').length },
    { id: 'agency', label: 'Agencies', count: allProfiles.filter(p => p.category === 'agency').length }
  ];

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleSwipe('left');
    }
    if (isRightSwipe) {
      handleSwipe('right');
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (direction === 'right' && prev > 0) {
          return prev - 1;
        } else if (direction === 'left' && prev < filteredProfiles.length - 1) {
          return prev + 1;
        }
        return prev;
      });
      setIsAnimating(false);
    }, 150);
  };

  const handleCategoryChange = (category: 'all' | 'model' | 'hostess' | 'agency') => {
    setActiveCategory(category);
    setCurrentIndex(0);
    setShowFilters(false);
  };

  const handleAction = (action: 'pass' | 'like') => {
    if (action === 'like' && onMatch) {
      onMatch();
    }
    
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => 
        prev === filteredProfiles.length - 1 ? 0 : prev + 1
      );
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    if (currentIndex >= filteredProfiles.length && filteredProfiles.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredProfiles.length, currentIndex]);

  if (!currentProfile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div 
        className={`absolute inset-0 transition-all duration-700 ease-out ${isAnimating ? 'scale-110 blur-sm' : 'scale-100'}`}
        style={{ backgroundImage: `url(${currentProfile.videoThumbnail})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6 pt-6">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <h1 className="text-xl font-light text-white tracking-wide">discover</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-11 h-11 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <Filter className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={onOpenChat}
            className="w-11 h-11 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Filters Overlay */}
      {showFilters && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 transform transition-transform duration-300">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Filter by category</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id as any)}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-black text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{category.label}</div>
                  <div className="text-sm opacity-70">{category.count} profiles</div>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowFilters(false)}
              className="w-full mt-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={() => handleSwipe('right')}
          disabled={currentIndex === 0}
          className={`w-12 h-12 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${
            currentIndex === 0
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={() => handleSwipe('left')}
          disabled={currentIndex === filteredProfiles.length - 1}
          className={`w-12 h-12 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${
            currentIndex === filteredProfiles.length - 1
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110'
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Main Card */}
      <div 
        className="absolute bottom-0 left-14 right-14 p-6 z-20"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className={`bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-500 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100'}`}>
          {/* Video Preview */}
          <div className="relative h-96 overflow-hidden bg-black">
            <img 
              src={currentProfile.videoThumbnail}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>
            
            {/* Category Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                {currentProfile.profession}
              </span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <button
                  onClick={() => onUserSelect && onUserSelect(currentProfile.id)}
                  className="text-left hover:underline transition-all"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-1 hover:text-gray-700">
                    {currentProfile.name}
                    {currentProfile.age > 0 && (
                      <span className="text-gray-500 font-normal">, {currentProfile.age}</span>
                    )}
                  </h2>
                </button>
                <div className="flex items-center text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{currentProfile.location}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-6 text-sm">{currentProfile.bio}</p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={() => handleAction('pass')}
                className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
              
              <button
                onClick={() => handleAction('like')}
                className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-xl"
              >
                <Heart className="w-7 h-7 text-white" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {filteredProfiles.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-8 h-2 bg-white rounded-full' 
                  : 'w-2 h-2 bg-white/30 rounded-full hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="text-center mt-4">
          <span className="text-white/70 text-sm font-light">
            {currentIndex + 1} of {filteredProfiles.length}
          </span>
        </div>
      </div>
    </div>
  );
}
export default MainFeedScreenAgency;