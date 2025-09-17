// ChatScreen.tsx (refactored with service)
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Phone, Video, MoreVertical } from "lucide-react";
import { ChatService, MessageView } from "../services/chatService";
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function ChatScreen({ onBack }: { onBack?: () => void }) {
  const { t } = useLanguage();
  const { chatId: chatIdParam } = useParams<{ chatId?: string }>();
  const chatId = chatIdParam || "";
  const navigate = useNavigate();

  const [messages, setMessages] = useState<MessageView[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [title, setTitle] = useState<string>(t('chat.title'));
  const [loading, setLoading] = useState(false);
  const [agencyInfo, setAgencyInfo] = useState<any>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
  };

  // fetch ONCE on mount, no polling
  const fetchMessages = async () => {
    if (!chatId) return;
    
    setLoading(true);
    const result = await ChatService.fetchMessages(chatId);
    setLoading(false);

      console.log("Chat fetch result:", result);

    if (result.success) {
      if (result.title) setTitle(result.title);
      if (result.messages) setMessages(result.messages);
      if (result.agencyInfo) setAgencyInfo(result.agencyInfo); // <- add this
      scrollToBottom();
    } else {
      console.error("Failed to fetch messages:", result.error);
    }
  };

  useEffect(() => {
    if (!chatId) return;
    void fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;
    const stopRef = { current: false };
  
    ChatService.pollMessages(chatId, (msgs) => {
      setMessages(msgs);
      scrollToBottom();
    }, stopRef);
  
    return () => { stopRef.current = true };
  }, [chatId]);
  

  // ==== sendMessage with optimistic update ====
  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text) return;

    // create optimistic tmp msg
    const optimisticMsg = ChatService.createOptimisticMessage(text);
    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage("");
    scrollToBottom();

    const result = await ChatService.sendMessage(chatId, text);

    if (result.success) {
      // replace optimistic msg with real one
      const newMsg: MessageView = {
        id: result.messageId!,
        text,
        isMe: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => prev.map(m => (m.id === optimisticMsg.id ? newMsg : m)));
    } else {
      console.error("Failed to send message:", result.error);
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id)); // remove optimistic
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { 
      e.preventDefault(); 
      void sendMessage(); 
    }
  };

  const back = () => { 
    if (onBack) onBack(); 
    else navigate(-1); 
  };

    // Function to generate a background color based on agency name
  const getAvatarColor = (name: string) => {
    const colors = ["#043584ff", "#73616146", "#895a09ff", "#034f35ff", "#200560ff"];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-16 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={back}
              className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div className="flex items-center">
              <div
                className="w-20 h-20 rounded-lg flex items-center justify-center mr-3 text-white font-semibold"
                style={{ backgroundColor: getAvatarColor(agencyInfo?.name || "") }}
              >
                {agencyInfo?.name?.charAt(0).toUpperCase() || "?"}
              </div>

              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {agencyInfo?.name || t('chat.loading')}
                </h1>
                {agencyInfo && (
                  <p className="text-sm text-slate-500">
                     {title}
                  </p>
                )}
                {agencyInfo && (
                  <p className="text-sm text-slate-500">
                     {agencyInfo?.professional_bio  || t('chat.loading')}
                  </p>
                )}
                <p className="text-sm text-green-600 font-medium">
{t('chat.online')}
                </p>
              </div>

            </div>
          </div>

          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <button className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <MoreVertical className="w-5 h-5 text-slate-700" />
            </button>
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
            <textarea 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              onKeyDown={handleKeyDown}
              placeholder="Scrivi il tuo messaggio professionale..." 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-slate-900" 
              rows={1} 
              style={{ minHeight: 48, maxHeight: 120 }} 
            />
          </div>
          <button 
            onClick={() => void sendMessage()} 
            disabled={!newMessage.trim()} 
            className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 disabled:bg-slate-300"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3">
          <p className="text-xs text-slate-500 text-center">
            Mantieni le comunicazioni professionali • Segnala comportamenti inappropriati
          </p>
        </div>
      </div>
    </div>
  );
}