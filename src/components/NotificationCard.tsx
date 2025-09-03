import { useEffect, useState } from "react";
import { Bell, CalendarDays, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { getBaseUrl } from "@/services/utils/baseUrl";

export default function NotificationsCard() {
  const [notifyMatches, setNotifyMatches] = useState(true);
  const [matches, setMatches] = useState([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!notifyMatches) return;

    const fetchMatches = async () => {
        const baseUrl = await getBaseUrl();
      try {
        const res = await fetch(`${baseUrl}/api/model/approved-matches`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust for your auth
          },
        });
        const data = await res.json();
        if (data.success) {
          setMatches(data.campaigns);
        }

        // favorites (likes)
        const resFavs = await fetch(`${baseUrl}/api/notifications`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const dataFavs = await resFavs.json();
        if (dataFavs.success) {
          setFavorites(dataFavs.favorites);
        }


      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchMatches();
    const interval = setInterval(fetchMatches, 60000); // poll every 1 minute
    return () => clearInterval(interval);
  }, [notifyMatches]);

  

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-slate-900">Job alerts</div>
          <Switch checked={notifyMatches} onCheckedChange={setNotifyMatches} />
        </div>
        <p className="text-sm text-slate-600">
          Get notified when jobs match your profile or location.
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            Notifications {notifyMatches ? "enabled" : "disabled"}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            You’ll see your approved matches here.
          </div>

          {/* show matches */}
          {
            matches.map((m) => (
                
              <div
                key={m.modelId}
                onClick={() => navigate(`/model/chat/chat_${m.id}_${m.modelId}`)} // 👈 go to chat
                className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
              >
                <Bell className="w-4 h-4 text-amber-600" /> 
                New match: <strong>{m.title || m.name}</strong>
              </div>
            ))
          }
          {/* Favorites (likes) */}
          {favorites.map((f) => (
            <div
              key={`fav-${f.id}`}
              className="flex items-center gap-2 text-pink-600"
            >
              <Heart className="w-4 h-4" />
              <strong>{f.name}</strong> liked your profile
            </div>
          ))}

          {matches.length === 0 && favorites.length === 0 && (
            <div className="text-slate-500">No new notifications yet</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

