import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatScreen from "./ChatScreen";
import { getBaseUrl } from "@/services/utils/baseUrl";

export interface ChatSummary {
  chatId: string;
  modelName: string;
  title: string;
  avatarUrl?: string;
  city?: string;
  id?: number;
}

export default function ChatPageAgency() {
  const navigate = useNavigate();
  const { chatId: chatIdParam } = useParams<{ chatId?: string }>();
  const [selectedChat, setSelectedChat] = useState<string>(chatIdParam || "");
  const [chats, setChats] = useState<ChatSummary[]>([]);

  useEffect(() => {
    const fetchRecentMatches = async () => {
      const baseUrl = await getBaseUrl();
      try {
        const res = await fetch(`${baseUrl}/api/agency/approved-matches`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();

         console.log("Full approved-matches response:", data); // <-- check the raw response
        if (data.success) {
          const recentChats: ChatSummary[] = (data.campaigns || []).map((m: any) => ({
            chatId: `chat_${m.id}_${m.modelId}`,
            modelName: m.modelName,
            title: m.title,
            avatarUrl: m.avatarUrl,
            city: m.city,
            id: m.id,
          }));
          setChats(recentChats);
          // If no selectedChat yet, pick the first one
          if (!selectedChat && recentChats.length > 0) {
            setSelectedChat(recentChats[0].chatId);
            navigate(`/agency/chat/${recentChats[0].chatId}`, { replace: true });
          }
        }
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    };

    fetchRecentMatches();
  }, []);

  const handleSelect = (chatId: string) => {
    setSelectedChat(chatId);
    localStorage.setItem('lastChatId', chatId); // store last chat
    navigate(`/agency/chat/${chatId}`);
  };

  const getAvatarColor = (name: string) => {
    const colors = ["#043584ff", "#73616146", "#895a09ff", "#034f35ff", "#200560ff"];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="flex h-screen">
      {/* Left pane */}
      <div className="w-80 border-r border-slate-200 overflow-y-auto">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => handleSelect(chat.chatId)}
              className={`flex items-center p-4 cursor-pointer ${
                selectedChat === chat.chatId ? "bg-slate-100" : ""
              }`}
            >
              {chat.avatarUrl ? (
                <img
                  src={chat.avatarUrl}
                  alt={chat.modelName}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-3 text-white font-semibold"
                  style={{ backgroundColor: getAvatarColor(chat.modelName) }}
                >
                  {chat.modelName?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-slate-900">{chat.modelName}</p>
                <p className="text-l text-slate-400">{chat.title}</p>
                <p className="text-xs text-slate-400">Campaign_id: {chat.id}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-slate-500 p-4">No recent matches</div>
        )}
      </div>

      {/* Right pane */}
      <div className="flex-1">
        {selectedChat ? (
          <ChatScreen key={selectedChat} />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Select a chat to open
          </div>
        )}
      </div>
    </div>
  );
}