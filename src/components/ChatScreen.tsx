
import React, { useState } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
}

interface ChatScreenProps {
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Ciao! Ho visto il tuo profilo e sono interessata a discutere potenziali opportunità di collaborazione.",
      sender: 'other',
      timestamp: '10:30'
    },
    {
      id: 2,
      text: "Ciao! Grazie per avermi contattato. Sarei felice di discutere opportunità professionali.",
      sender: 'user',
      timestamp: '10:35'
    },
    {
      id: 3,
      text: "Perfetto! Abbiamo una campagna di moda in arrivo che potrebbe essere perfetta per la tua esperienza. Sei disponibile per una breve chiamata per discutere i dettagli?",
      sender: 'other',
      timestamp: '10:40'
    },
    {
      id: 4,
      text: "Assolutamente! Sono disponibile questo pomeriggio o domani mattina. Cosa funziona meglio per te?",
      sender: 'user',
      timestamp: '10:42'
    }
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 pt-16 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-slate-200 rounded-xl overflow-hidden mr-3">
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" 
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Sarah Johnson</h1>
                <p className="text-sm text-green-600 font-medium">Online ora</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-slate-700" />
            </button>
            <button className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5 text-slate-700" />
            </button>
            <button className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <MoreVertical className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Professional Notice */}
      <div className="px-6 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 text-center">
            <strong>Chat Professionale:</strong> Questa conversazione è esclusivamente per scopi professionali. 
            Mantieni tutte le comunicazioni professionali e relative al lavoro.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-900 border border-slate-200'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-2 ${
                message.sender === 'user' ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-slate-200 px-6 py-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Scrivi il tuo messaggio professionale..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
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
};

export default ChatScreen;
