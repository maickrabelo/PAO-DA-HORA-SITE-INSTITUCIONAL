import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, ChefHat, Loader2 } from 'lucide-react';
import { sendMessageToBaker } from '../services/geminiService';
import { ChatMessage } from '../types';

const BakerChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Olá! Sou o Padeiro Virtual da Pão da Hora. 🥖 Aceita uma sugestão de pão quentinho ou quer ajuda para montar seu café da manhã?',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToBaker(userText, history);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl w-[350px] sm:w-[400px] h-[500px] flex flex-col mb-4 border border-brand-wheat overflow-hidden transition-all duration-300 transform origin-bottom-right">
          
          {/* Header */}
          <div className="bg-brand-blue p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-brand-wheat p-2 rounded-full">
                <ChefHat size={20} className="text-brand-blue" />
              </div>
              <div>
                <h3 className="font-bold font-serif text-brand-wheat">Padeiro Virtual</h3>
                <p className="text-xs text-brand-beige/80">Online agora</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 p-1 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-brand-beige/30 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-brown text-white rounded-tr-none'
                      : 'bg-white text-brand-blue border border-brand-wheat/30 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm border border-brand-wheat/30 flex items-center gap-2 text-brand-brown">
                  <Loader2 size={16} className="animate-spin text-brand-wheat" />
                  <span className="text-xs font-medium">Consultando o mestre padeiro...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-brand-beige">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Pergunte sobre receitas, pães..."
                className="flex-1 p-2 bg-brand-beige/20 border border-brand-wheat/50 rounded-lg focus:outline-none focus:border-brand-brown text-brand-blue placeholder-brand-brown/40 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-brand-brown text-white rounded-lg hover:bg-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`shadow-xl transition-all duration-300 flex items-center justify-center ${
          isOpen 
            ? 'w-12 h-12 rounded-full bg-brand-blue text-brand-wheat border-2 border-brand-wheat' 
            : 'w-16 h-16 rounded-full bg-brand-brown text-white hover:scale-105 border-4 border-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={32} />}
      </button>
    </div>
  );
};

export default BakerChat;