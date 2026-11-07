'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, Sparkles, Send, Compass, MapPin, 
  ArrowRight, ShieldCheck, MessageCircle, Calendar 
} from 'lucide-react';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

export default function AITravelAssistantPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Namaste and welcome to The Tour Vision AI Travel Studio in Pune! I am your luxury vacation consultant. I can help you discover destinations, suggest day-by-day itineraries, estimate budgets, and connect you with our Pune senior travel planners. What destination are you envisioning?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    'Plan a 7-day romantic honeymoon in Kashmir with houseboat stays',
    'What is the best 8-day itinerary for Switzerland using the Swiss Travel Pass?',
    'Curate a 5-day luxury palace holiday in Rajasthan for a family',
    'Recommend a private pool villa holiday in Bali with Ubud forest excursions',
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
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
    <div className="bg-[#fcfaf7] min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto flex flex-col h-[85vh] min-h-[600px]">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-900 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>AI TRAVEL CONCIERGE STUDIO</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy">
              Intelligent Vacation Planning
            </h1>
            <p className="text-xs text-gray-500">
              Interactive travel advice backed by The Tour Vision’s vetted destination database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <WhatsAppButton
              variant="inline"
              label="Talk to Human Planner"
              className="py-2 px-3 text-xs"
            />
            <Link
              href="/trip-planner"
              className="rounded-lg bg-brand-navy px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Smart Trip Planner
            </Link>
          </div>
        </div>

        {/* Chat Canvas */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex gap-3 max-w-[85%]">
                {m.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-700 shrink-0 mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-brand-navy text-white rounded-br-none'
                      : 'bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%] items-center">
                <div className="h-8 w-8 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-700 shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-500 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500 animate-spin" />
                  <span>Curating personalized travel suggestions...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Prompts */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-400 mr-1">
            Try asking:
          </span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-700 hover:border-amber-400 hover:text-amber-900 transition-colors shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-3 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your travel inquiry (e.g. Kashmir 7 days family budget)..."
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-primary-700 transition-colors shadow-md disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-2 text-center text-[10px] text-gray-400">
          AI suggestions are curated guidelines. Final verified pricing and bookings are handled by The Tour Vision’s certified travel planners in Pune.
        </div>
      </div>
    </div>
  );
}
