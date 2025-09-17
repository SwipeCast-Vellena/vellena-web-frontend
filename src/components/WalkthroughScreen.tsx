
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Users, Video, CheckCircle, Heart, MessageCircle, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface WalkthroughScreenProps {
  onComplete: () => void;
}

const WalkthroughScreen: React.FC<WalkthroughScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  const slides = [
    {
      icon: Video,
      title: t('walkthrough.welcome.title'),
      description: t('walkthrough.welcome.description'),
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Users,
      title: t('walkthrough.profile.title'),
      description: t('walkthrough.profile.description'),
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Heart,
      title: t('walkthrough.discover.title'),
      description: t('walkthrough.discover.description'),
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      color: "from-pink-500 to-red-600"
    },
    {
      icon: MessageCircle,
      title: t('walkthrough.connect.title'),
      description: t('walkthrough.connect.description'),
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      color: "from-red-500 to-orange-600"
    },
    {
      icon: CheckCircle,
      title: t('walkthrough.verified.title'),
      description: t('walkthrough.verified.description'),
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      color: "from-green-500 to-blue-600"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const skipWalkthrough = () => {
    onComplete();
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentSlideData.image}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.color} opacity-80`}></div>
      </div>

      {/* Skip Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={skipWalkthrough}
          className="text-white/80 text-sm font-medium hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
        >
          {t('walkthrough.skip')}
        </button>
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <img 
          src="/YOWORKS LOGO.png" 
          alt="Yo.Works" 
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSelector variant="overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-sm">
          <currentSlideData.icon className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
          {currentSlideData.title}
        </h1>

        {/* Description */}
        <p className="text-white/90 text-lg leading-relaxed max-w-sm mb-12">
          {currentSlideData.description}
        </p>

        {/* Progress Dots */}
        <div className="flex space-x-3 mb-12">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-6'
                  : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="relative z-10 px-8 pb-8 flex items-center justify-between">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            currentSlide === 0
              ? 'bg-white/10 text-white/30'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next/Get Started Button */}
        <button
          onClick={nextSlide}
          className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-semibold text-lg flex items-center space-x-2 hover:bg-white/90 transition-colors"
        >
          <span>{currentSlide === slides.length - 1 ? t('walkthrough.start') : t('walkthrough.next')}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default WalkthroughScreen;
