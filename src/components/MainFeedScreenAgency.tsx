import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  X,
  MessageCircle,
  MapPin,
  Play,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchModels,
  Profile,
  getPendingModels,
} from "@/services/modelService";
import { addFavorite } from "@/services/favoriteService";

type Category = "all" | "model" | "hostess" | "agency" | "pending";

// interface Profile {
//   id: number;
//   name: string;
//   age: number;
//   location: string;
//   bio: string;
//   videoThumbnail: string;
//   profession: string;
//   category: 'model' | 'hostess' | 'agency';
// }

interface MainFeedScreenProps {
  onMatch?: () => void;
  onOpenChat?: () => void;
  onUserSelect?: (userId: number) => void;
}

const MainFeedScreenAgency: React.FC<MainFeedScreenProps> = ({
  onMatch,
  onOpenChat,
  onUserSelect,
}) => {
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingProfiles, setPendingProfiles] = useState<Profile[]>([]);
  const [showLikePopup, setShowLikePopup] = useState(false);

  // Pointer swipe state (works for mouse + touch)
  const startX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  // Fetch models via service
  useEffect(() => {
    const loadModels = async () => {
      try {
        const models = await fetchModels();

        setAllProfiles(models);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    const loadPendingModels = async () => {
      try {
        const pending = await getPendingModels();
        console.log("Pending Models:", pending); // 👈 check what you get
        setPendingProfiles(pending);
      } catch (error) {
        console.error("Error fetching pending models:", error);
      }
    };

    loadPendingModels();
  }, []);

  

  const filteredProfiles =
    activeCategory === "all"
      ? allProfiles
      : activeCategory === "pending"
      ? pendingProfiles
      : allProfiles.filter((p) => p.category === activeCategory);

  const currentProfile = filteredProfiles[currentIndex];

  const categories = [
    { id: "all", label: "All", count: allProfiles.length },
    {
      id: "model",
      label: "Models",
      count: allProfiles.filter((p) => p.category === "model").length,
    },
    {
      id: "hostess",
      label: "Hostess",
      count: allProfiles.filter((p) => p.category === "hostess").length,
    },
    {
      id: "photographer",
      label: "Photographer",
      count: allProfiles.filter((p) => p.category === "photographer").length,
    },
    {
      id: "pending",
      label: "Pending Approval",
      count: pendingProfiles.length, // pending models count
    },
  ] as const;

  const handleSwipe = (direction: "left" | "right") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (direction === "right" && prev > 0) return prev - 1;
        if (direction === "left" && prev < filteredProfiles.length - 1)
          return prev + 1;
        return prev;
      });
      setIsAnimating(false);
    }, 150);
  };

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setCurrentIndex(0);
    setShowFilters(false);
  };

  const handleAction = (action: "pass" | "like") => {
    if (action === "like" && onMatch){
      setShowLikePopup(true);
      setTimeout(() => setShowLikePopup(false), 1500);
    } // <-- fixed (no stray dot)
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === filteredProfiles.length - 1 ? 0 : prev + 1
      );
      setIsAnimating(false);
    }, 300);
  };

  const navigate = useNavigate();
  const onChat = () => {
    navigate("/agency/chat");
  };

  // Keep index in range if filter changes
  useEffect(() => {
    if (
      currentIndex >= filteredProfiles.length &&
      filteredProfiles.length > 0
    ) {
      setCurrentIndex(0);
    }
  }, [filteredProfiles.length, currentIndex]);

  if (!currentProfile) return null;

  // Pointer event handlers for swipe
  // const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
  //   startX.current = e.clientX;
  //   (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  // };
  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = () => {
    // optional: add live drag visuals here
  };
  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    // ignore if clicked on a button
    if ((e.target as HTMLElement).closest("button")) return;

    startX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (startX.current == null) return;

    const dist = startX.current - e.clientX;
    if (dist > minSwipeDistance) handleSwipe("left");
    else if (dist < -minSwipeDistance) handleSwipe("right");
    startX.current = null;
  };

  return (
    <div className="h-[100dvh] bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden flex flex-col">

      {/* LIKE POPUP */}
      {showLikePopup && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-xl text-sm font-medium z-50 shadow-lg animate-fadeInOut">
          Liked!
        </div>
      )}
      {/* Animated Background */}
      <div
        className={`pointer-events-none absolute inset-0 transition-all duration-700 ease-out ${
          isAnimating ? "scale-110 blur-sm" : "scale-100"
        }`}
        style={{
          backgroundImage: `url(${currentProfile.videoThumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 lg:px-10 pt-6 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <h1 className="text-xl font-light text-white tracking-wide">
            discover
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-11 h-11 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
            aria-label="Open filters"
          >
            <Filter className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onChat}
            className="w-11 h-11 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
            aria-label="Open chat"
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
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Filter by category
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id as Category)}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 ${
                    activeCategory === category.id
                      ? "bg-black text-white shadow-lg"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium">{category.label}</div>
                  <div className="text-sm opacity-70">
                    {category.count} profiles
                  </div>
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

      {/* Content container (centered, fills remaining viewport height) */}
      <div className="relative z-20 w-[90vw] max-w-full mx-auto px-4 sm:px-6 lg:px-10 pb-4 flex-1 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Middle row: arrows + card */}
        <div className="flex items-stretch justify-between gap-4 mt-4 w-full flex-1 overflow-hidden">
          <button
            onClick={() => handleSwipe("right")}
            disabled={currentIndex === 0}
            className={`w-12 h-12 self-center backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${
              currentIndex === 0
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-white/10 text-white hover:bg-white/20 hover:scale-110"
            }`}
            aria-label="Previous"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Main Card (fills available height; no page scroll) */}
          <div
            className={`flex-1 mx-1 sm:mx-2 bg-white/95 backdrop-blur-xl 
                        rounded-3xl overflow-hidden shadow-2xl border border-white/20 
                        transition-all duration-500 
                        ${isAnimating ? "scale-95 opacity-80" : "scale-100"} 
                        flex flex-col min-h-0`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            {/* Media area takes ~48% of card height */}
            <div className="relative h-[62%] min-h-[220px] overflow-hidden bg-black">
              <video
                src={currentProfile.video_portfolio}
                className="w-full h-full object-cover"
                controls
              />

              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                  {currentProfile.description}
                </span>
              </div>
            </div>

            {/* Info area uses remaining height; can scroll internally on tiny screens */}
            <div className="p-6 h-[52%] overflow-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <button
                    onClick={() =>
                      onUserSelect && onUserSelect(currentProfile.id)
                    }
                    className="text-left hover:underline transition-all"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-1 hover:text-gray-700">
                      {currentProfile.name}
                      {currentProfile.age > 0 && (
                        <span className="text-gray-500 font-normal">
                          , {currentProfile.age}
                        </span>
                      )}
                    </h2>
                  </button>
                  <div className="flex items-center text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{currentProfile.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                {currentProfile.bio}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-center gap-6 shrink-0">
                <button
                  onClick={() => handleAction("pass")}
                  className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation(); // prevent parent swipe from intercepting
                    try {
                      const result = await addFavorite(currentProfile.id);
                      console.log("Favorite response:", result);
                    } catch (err) {
                      console.error("Error liking profile:", err);
                    }
                    handleAction("like");
                  }}
                  className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-xl"
                >
                  <Heart className="w-7 h-7 text-white" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSwipe("left")}
            disabled={currentIndex === filteredProfiles.length - 1}
            className={`w-12 h-12 self-center backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 ${
              currentIndex === filteredProfiles.length - 1
                ? "bg-white/5 text-white/30 cursor-not-allowed"
                : "bg-white/10 text-white hover:bg-white/20 hover:scale-110"
            }`}
            aria-label="Next"
            title="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Dots + Counter (doesn't push page taller) */}
        <div className="shrink-0">
          <div className="flex justify-center mt-4 gap-2">
            {filteredProfiles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 h-2 bg-white rounded-full"
                    : "w-2 h-2 bg-white/30 rounded-full hover:bg-white/50"
                }`}
                aria-label={`Go to ${idx + 1}`}
              />
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-white/70 text-sm font-light">
              {currentIndex + 1} of {filteredProfiles.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeedScreenAgency;
