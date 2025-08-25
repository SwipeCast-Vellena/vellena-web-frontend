// ChatScreen.tsx (uses singular /api/chat/... endpoints)
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Phone, Video, MoreVertical } from "lucide-react";

type ServerMessage = {
  id: string;
  text: string;
  senderUid?: string;
  senderBackendId?: number;
  type?: "text" | "image" | "file";
  attachmentUrl?: string | null;
  createdAt?: { seconds: number; nanoseconds: number } | string | null;
  readBy?: string[];
};

type MessageView = { id: string; text: string; isMe: boolean; timestamp: string };

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;


function formatTimestamp(createdAt: any) {
  if (!createdAt) return "";
  if (typeof createdAt === "object" && createdAt.seconds != null) {
    const d = new Date(createdAt.seconds * 1000 + (createdAt.nanoseconds || 0) / 1e6);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (typeof createdAt === "string") {
    const d = new Date(createdAt);
    if (!isNaN(d.getTime())) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  try { const d = new Date(createdAt); return !isNaN(d.getTime()) ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""; } catch { return ""; }
}

export default function ChatScreen({ onBack }: { onBack?: () => void }) {
  
  const { chatId: chatIdParam } = useParams<{ chatId?: string }>();
  const chatId = chatIdParam || "";
  const navigate = useNavigate();

  const [messages, setMessages] = useState<MessageView[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [title, setTitle] = useState<string>("Chat");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const token = localStorage.getItem("token") || "";
  

  const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } as Record<string,string>;

  const toViewMessage = (m: ServerMessage): MessageView => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  
    const isMe =
      (typeof m.senderBackendId === "number" && m.senderBackendId === currentUser.id) ||
      (typeof m.senderUid === "string" && m.senderUid === `u${currentUser.id}`);
  
    return {
      id: m.id,
      text: m.text || (m.attachmentUrl ? "(attachment)" : ""),
      isMe,
      timestamp: formatTimestamp(m.createdAt),
    };
  };

  async function safeParse(res: Response) {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      try { return { ok: true, json: await res.json(), text: null }; } catch (err) { return { ok: false, json: null, text: await res.text() }; }
    } else {
      const text = await res.text();
      return { ok: false, json: null, text };
    }
  }

  // fetch ONCE on mount, no polling
const fetchMessages = async () => {
  if (!chatId) return;
  try {
    setLoading(true);
    const url = `${API_BASE}/api/chat/${encodeURIComponent(chatId)}/messages`;
    const res = await fetch(url, { headers });
    const parsed = await safeParse(res);

    if (!res.ok || !parsed.ok || !parsed.json) {
      console.error("fetchMessages error:", parsed);
      setLoading(false);
      return;
    }

    const j = parsed.json;
    if (!j.success || !Array.isArray(j.messages)) {
      console.error("fetchMessages bad shape:", j);
      setLoading(false);
      return;
    }

    if (j.title) setTitle(j.title);
    setMessages(j.messages.map((m: ServerMessage) => toViewMessage(m)));
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
  } catch (err) {
    console.error("fetchMessages error:", err);
    setLoading(false);
  }
};

useEffect(() => {
  if (!chatId) return;
  void fetchMessages();
}, [chatId]);

// ==== sendMessage with optimistic update ====
const sendMessage = async () => {
  const text = newMessage.trim();
  if (!text) return;

  // create optimistic tmp msg
  const tmpId = `tmp-${Date.now()}`;
  const optimisticMsg: MessageView = {
    id: tmpId,
    text,
    isMe: true,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
  setMessages(prev => [...prev, optimisticMsg]);
  setNewMessage("");
  setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);

  try {
    const url = `${API_BASE}/api/chat/${encodeURIComponent(chatId)}/message`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ text, type: "text" }),
    });

    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const j = await res.json();
      if (res.ok && j && j.ok) {
        // replace optimistic msg with real one
        const newMsg: MessageView = {
          id: j.messageId,
          text,
          isMe: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages(prev => prev.map(m => (m.id === tmpId ? newMsg : m)));
      } else {
        console.error("sendMessage failed:", j);
        setMessages(prev => prev.filter(m => m.id !== tmpId)); // remove optimistic
      }
    } else {
      const body = await res.text();
      console.error("sendMessage non-json:", res.status, body.slice(0, 200));
      setMessages(prev => prev.filter(m => m.id !== tmpId));
    }
  } catch (err) {
    console.error("sendMessage error:", err);
    setMessages(prev => prev.filter(m => m.id !== tmpId));
  }
};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage(); }
  };

  const back = () => { if (onBack) onBack(); else navigate(-1); };

  return (
    // ... (UI same as previous snippet) ...
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-16 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={back} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-slate-200 rounded-xl overflow-hidden mr-3">
                <img src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" alt="Chat avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">{title}</h1>
                <p className="text-sm text-green-600 font-medium">Online ora</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"><Phone className="w-5 h-5 text-slate-700" /></button>
            <button className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"><Video className="w-5 h-5 text-slate-700" /></button>
            <button className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"><MoreVertical className="w-5 h-5 text-slate-700" /></button>
          </div>
        </div>
      </div>

      {/* Professional Notice */}
      <div className="px-6 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 text-center"><strong>Chat Professionale:</strong> Questa conversazione è esclusivamente per scopi professionali.</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
        {loading && <p className="text-center text-sm text-slate-500">Loading messages…</p>}
        {messages.map((msg) => (
          
          <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${msg.isMe ? "bg-slate-900 text-white" : "bg-white text-slate-900 border border-slate-200"}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-xs mt-2 ${msg.isMe ? "text-slate-300" : "text-slate-500"}`}>{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 px-6 py-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Scrivi il tuo messaggio professionale..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-slate-900" rows={1} style={{ minHeight: 48, maxHeight: 120 }} />
          </div>
          <button onClick={() => void sendMessage()} disabled={!newMessage.trim()} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 disabled:bg-slate-300">
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3"><p className="text-xs text-slate-500 text-center">Mantieni le comunicazioni professionali • Segnala comportamenti inappropriati</p></div>
      </div>
    </div>
  );
}


