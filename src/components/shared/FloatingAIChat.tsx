'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MessageSquare, X, Send, Bot, Compass, ArrowRight } from 'lucide-react';

export default function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Namaste! I am your AI Travel Concierge at The Tour Vision Pune. Are you dreaming of a Swiss alpine getaway, a royal palace tour in Rajasthan, or a secluded tropical villa in Bali? Ask me anything!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || 'Thank you for your inquiry. Our Pune travel specialists can craft this exact custom itinerary for you!',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I can certainly assist with this destination! To receive a tailored quotation with hotel recommendations and private chauffeur rates, please submit an inquiry or tap the WhatsApp button.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Travel Concierge"
          className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full border border-amber-400/40 bg-brand-navy px-4 py-2.5 text-xs font-semibold text-amber-200 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-slate-900 focus:outline-none"
        >
          <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>AI Concierge</span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[500px] w-96 flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden sm:right-6">
          {/* Header */}
          <div className="flex items-center justify-between bg-brand-navy p-4 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/30">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">AI Travel Concierge</h4>
                <p className="text-[10px] text-amber-300">The Tour Vision • Pune</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-brand-navy text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white border border-gray-200 p-3 text-gray-500 shadow-sm flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-spin" />
                  <span>Curating personalized travel suggestions...</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <form onSubmit={handleSend} className="border-t border-gray-200 p-3 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Kashmir, Switzerland, Bali..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-brand-navy p-2 text-amber-400 hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* Bottom Link to Full Concierge */}
          <div className="bg-gray-100 px-3 py-1.5 text-center text-[11px] text-gray-600 border-t border-gray-200">
            <Link
              href="/ai-travel-assistant"
              onClick={() => setIsOpen(false)}
              className="text-primary-700 font-semibold hover:underline flex items-center justify-center gap-1"
            >
              <span>Open Fullscreen AI Itinerary Studio</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
