'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  User,
  Lightbulb,
  TreePine,
  Car,
  ChevronDown,
  ChevronUp,
  Calculator,
  HelpCircle,
  Check,
  Copy,
} from 'lucide-react';
import {
  ChatMessage,
  TEMPLATE_QUESTIONS,
  getLocalEcoBotResponse,
} from '@/lib/eco-bot-knowledge';
import { ChatMessageContent } from '@/components/chat-message-content';

export function EcoGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'calculator'>('chat');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);

  // Carbon Simulator State
  const [co2Input, setCo2Input] = useState<number>(5);
  const treesEquivalent = (co2Input / 2.5).toFixed(1);
  const lightHours = Math.round(co2Input * 80);
  const carKm = Math.round(co2Input / 0.192);

  // Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: `Hai! Saya **Si Eco** 🐱🌱, asisten cerdas ramah lingkunganmu di EcoTrace.\n\nAda yang ingin kamu tanyakan seputar **emisi karbon**, **tips hemat energi**, atau **cara mengurangi jejak iklim**? Pilih topik di bawah atau ketik pertanyaanmu sendiri ya! ✨`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        'Berapa emisi motor vs bus/KRL per km?',
        'Kenapa daging sapi menghasilkan emisi sangat tinggi?',
        'Tips hemat listrik & AC untuk anak kos?',
        'Bagaimana cara kerja perhitungan emisi di EcoTrace?',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isOpen, activeTab, isLoading]);

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      inputRef.current?.focus();
    }
  }, [isOpen, activeTab]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error('API server response not ok');
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Maaf, Si Eco sedang kesulitan menjawab. Coba tanyakan kembali ya!',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: data.suggestions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.warn('Fallback to local knowledge:', err);
      const fallback = getLocalEcoBotResponse(query);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: fallback.reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: fallback.suggestions,
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-msg-${Date.now()}`,
        sender: 'bot',
        text: `Hai kembali! Obrolan telah direset. Mau tanya apa lagi tentang lingkungan atau emisi hari ini? 🌱`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: [
          'Berapa emisi motor vs bus/KRL per km?',
          'Tips mobilitas ramah lingkungan di kampus?',
          'Berapa target jejak karbon ideal per hari?',
        ],
      },
    ]);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4.5 py-3 gradient-eco text-white font-bold rounded-full shadow-2xl shadow-emerald-700/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-300/30"
          title="Tanya Si Eco (Bot AI Ramah Lingkungan)"
        >
          <span className="text-xl animate-bounce">🐱🌱</span>
          <div className="text-left">
            <p className="text-xs font-extrabold leading-tight flex items-center gap-1">
              <span>Tanya Si Eco</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            </p>
            <p className="text-[10px] text-emerald-100 font-medium">Asisten AI EcoTrace</p>
          </div>
        </button>
      )}

      {/* Main Chatbot Window */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100/80 w-[92vw] sm:w-[410px] h-[560px] max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md text-xl flex items-center justify-center border border-white/30 shadow-inner">
                🐱🌱
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight">Si Eco • Asisten AI</h3>
                  <span className="px-1.5 py-0.2 bg-emerald-400/30 text-emerald-100 text-[9px] font-bold rounded-full border border-emerald-300/40">
                    Free AI
                  </span>
                </div>
                <p className="text-[10px] text-emerald-100/90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
                  Online & Siap Membantu
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Reset Obrolan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Tutup Obrolan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs (Chat vs Simulator) */}
          <div className="flex border-b border-slate-100 bg-slate-50/70 p-1 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tanya Jawab AI</span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-teal-600" />
              <span>Simulator Emisi</span>
            </button>
          </div>

          {/* Tab Content: Chat Stream */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/40">
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 text-xs">
                {messages.map((msg) => {
                  const isBot = msg.sender === 'bot';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in`}
                    >
                      {isBot && (
                        <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          🐱
                        </div>
                      )}

                      <div className={`max-w-[85%] space-y-1.5 ${isBot ? 'items-start' : 'items-end'}`}>
                        <div
                          className={`p-3 rounded-2xl ${
                            isBot
                              ? 'bg-white text-slate-800 border border-slate-100 shadow-sm rounded-tl-sm'
                              : 'gradient-eco text-white shadow-sm rounded-tr-sm'
                          }`}
                        >
                          <ChatMessageContent content={msg.text} isBot={isBot} />
                        </div>

                        {/* Message Metadata & Copy Button */}
                        <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                          <span>{msg.timestamp}</span>
                          {isBot && (
                            <button
                              onClick={() => handleCopyText(msg.text, msg.id)}
                              className="hover:text-slate-600 flex items-center gap-0.5 cursor-pointer"
                              title="Salin jawaban"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Suggested Follow-up Questions Chips */}
                        {isBot && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              Topik Terkait:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.suggestedQuestions.map((sug, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => handleSendMessage(sug)}
                                  disabled={isLoading}
                                  className="text-left text-[11px] font-semibold bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 px-2.5 py-1 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {!isBot && (
                        <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading / Typing Indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 justify-start animate-in fade-in">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs flex-shrink-0">
                      🐱
                    </div>
                    <div className="bg-white border border-slate-100 shadow-sm p-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[11px] text-slate-400 ml-1 font-medium">Si Eco sedang berpikir...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Template Question Explorer Accordion */}
              <div className="border-t border-slate-200/60 bg-white/90 p-2.5 space-y-1.5 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Template Pertanyaan Populer:
                  </span>
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer"
                  >
                    {showTemplates ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                  </button>
                </div>

                {showTemplates && (
                  <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
                    {TEMPLATE_QUESTIONS.map((cat, cIdx) => (
                      <div key={cIdx} className="space-y-1">
                        <div className="text-[10px] font-bold text-slate-400">{cat.category}</div>
                        <div className="flex flex-wrap gap-1">
                          {cat.questions.map((q, qIdx) => (
                            <button
                              key={qIdx}
                              onClick={() => handleSendMessage(q)}
                              disabled={isLoading}
                              className="text-[10.5px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200/70 transition-colors text-left cursor-pointer disabled:opacity-50"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 flex-shrink-0">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ketik pertanyaan untuk Si Eco..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  disabled={isLoading}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all disabled:opacity-60"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 gradient-eco text-white rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  title="Kirim pesan"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab Content: Simulator Tool */}
          {activeTab === 'calculator' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs bg-slate-50/50">
              <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <label className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Kalkulator Dampak: Apa Arti Angka Karbon?</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={co2Input}
                    onChange={(e) => setCo2Input(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    className="w-24 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-center text-sm text-slate-800"
                  />
                  <span className="font-bold text-slate-600 text-xs">kg CO₂e setara dengan:</span>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <TreePine className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>🌳 Menanam <strong>{treesEquivalent} pohon</strong> selama 1 minggu</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span>💡 Menyalakan lampu LED selama <strong>{lightHours} jam</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-blue-900 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                    <Car className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>🚗 Menyetir mobil sejauh <strong>{carKm} km</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-1.5">
                <p className="font-bold text-emerald-900 flex items-center gap-1">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  Tips Si Eco Hari Ini:
                </p>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Untuk jarak di bawah 2 km di lingkungan kampus IPB, biasakan berjalan kaki atau gowes sepeda. Emisi yang dihasilkan adalah <strong>0 kg CO₂e</strong> dan tubuh menjadi lebih bugar! 🎉
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('chat');
                  handleSendMessage(`Berapa target jejak karbon ideal per hari jika saat ini emisiku ${co2Input} kg?`);
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Tanyakan Lebih Lanjut ke Si Eco AI</span>
                <Send className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
