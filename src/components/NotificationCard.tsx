import { useEffect, useState } from "react";
import { Bell, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { getBaseUrl } from "@/services/utils/baseUrl";

export default function NotificationsCard() {
  const [notifyMatches, setNotifyMatches] = useState(true);
  const [matches, setMatches] = useState([]);
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
      } catch (err) {
        console.error("Error fetching matches:", err);
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
          {matches.length > 0 ? (
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
          ) : (
            <div className="text-slate-500">No new matches yet</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

