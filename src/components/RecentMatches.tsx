import { useEffect, useState } from "react";
import { MessageSquare, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getBaseUrl } from "@/services/utils/baseUrl";

export default function RecentMatches() {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      const baseUrl = await getBaseUrl();
      try {
        const res = await fetch(`${baseUrl}/api/model/approved-matches`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          // backend sends campaigns, not matches
          setMatches(data.campaigns || []);
        }
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    };

    fetchMatches();
  }, []);

  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-slate-900 flex items-center gap-2">
          <div className="font-semibold text-slate-900 flex items-center gap-2"><MessageSquare className="w-5 h-5"/> Recent Matches</div>
          </div>
          <Button variant="ghost" className="gap-1">
            Open Inbox <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {matches.length > 0 ? (
            matches.map((m) => {
              const chatId = `chat_${m.id}_${m.modelId}`; // campaignId + modelId
              return (
                <div
                  key={chatId}
                  className="flex items-start gap-3 rounded-xl border p-3 bg-white"
                >
                  <img
                    src={m.avatarUrl || "/default-avatar.png"}
                    alt={m.modelName}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-slate-900">
                        {m.modelName}
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      Campaign: {m.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      City: {m.city}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/model/chat/${chatId}`)}
                  >
                    Open
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="text-slate-500">No matches yet</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

