import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import { DEMO_PACKAGES, DEMO_DESTINATIONS } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, userContext } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Graceful fallback if no Gemini API key configured
    if (!apiKey) {
      const lower = message.toLowerCase();
      let fallbackReply = `Namaste! As your luxury travel concierge at The Tour Vision Pune, I am delighted to help you explore our tailor-made journeys. `;

      if (lower.includes('kashmir') || lower.includes('gulmarg') || lower.includes('srinagar')) {
        fallbackReply += `Kashmir is breathtaking right now! We offer our signature 7-Day Kashmir Paradise Odyssey featuring luxury Dal Lake houseboat stays, Gulmarg Gondola Phase 2 access, and Lidder riverside walks in Pahalgam starting from ₹31,999/person. Would you like our Pune team to send you an itemized itinerary?`;
      } else if (lower.includes('swiss') || lower.includes('switzerland') || lower.includes('alps')) {
        fallbackReply += `Switzerland is our hallmark European luxury experience. Our 7-Day Majestic Swiss Alpine tour includes 4-star superior hotels, Jungfraujoch Top of Europe, Mount Titlis, and an 8-day Swiss Travel Pass starting from ₹1,64,999/person. Flights can be smoothly routed ex-Mumbai with private airport transfers from Pune.`;
      } else if (lower.includes('bali') || lower.includes('indonesia')) {
        fallbackReply += `For Bali, we specialize in private pool ocean villas in Seminyak combined with jungle retreats in Ubud, inclusive of private chauffeurs and couples spa rituals starting from ₹46,500/person.`;
      } else if (lower.includes('rajasthan') || lower.includes('udaipur') || lower.includes('jaipur')) {
        fallbackReply += `Our Royal Rajasthan Heritage package features 5-star palace hotels in Jaipur, Jodhpur, and Udaipur, complete with private Lake Pichola golden-hour cruises starting from ₹42,999/person.`;
      } else {
        fallbackReply += `Whether you are planning a romantic honeymoon, an alpine retreat, or a multi-generational family holiday, our Pune travel specialists curate every detail with private chauffeur transfers, 4-to-5 star stays, and personalized care. Feel free to use our Smart Trip Planner or click the WhatsApp button to chat directly with our Pune desk!`;
      }

      return NextResponse.json({
        reply: fallbackReply,
        source: 'curated_knowledge_engine',
        suggestions: [
          'Royal Rajasthan Heritage Experience',
          'Kashmir Paradise Odyssey',
          'Swiss Alpine Dreams',
          'Bali Private Pool Villa Retreat',
        ],
      });
    }

    // Call real Google Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are the elite AI Travel Concierge for "The Tour Vision", a premier travel agency based in Pune, Maharashtra, India.
Agency Identity:
- Business: The Tour Vision
- Location: Pune, Maharashtra (Serving travelers across Pune, Mumbai, and India)
- Specialty: Curated luxury holidays, European alpine rail tours, Indian royal palace heritage stays, private pool honeymoon villas, and customized family getaways.
- Currency: Indian Rupee (INR - ₹)
- Key destinations: Kashmir (from ₹31,999), Rajasthan (from ₹42,999), Kerala (from ₹28,500), Switzerland (from ₹1,64,999), Bali (from ₹46,500), Dubai (from ₹48,000).

Strict Rules:
1. Always maintain a warm, sophisticated, professional luxury travel advisor tone ("Namaste", "Discerning traveler").
2. DO NOT fabricate verified hotel availability, fake flight tickets, or guaranteed immediate bookings. Always specify that all itineraries are customized and subject to final seasonal verification by The Tour Vision's Pune travel advisors.
3. Recommend submitting an inquiry through the Smart Trip Planner or contacting the Pune desk via WhatsApp (+91 98220 12345).
4. Provide structured, evocative day-wise highlights when asked for an itinerary.`;

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am ready to serve as the elite travel concierge for The Tour Vision Pune, providing refined, authentic recommendations.' }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // Optionally record to Supabase if client/session is present
    try {
      const supabase = await createClient();
      if (conversationId) {
        await supabase.from('ai_messages').insert({
          conversation_id: conversationId,
          role: 'user',
          content: message,
        });
        await supabase.from('ai_messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: responseText,
        });
      }
    } catch {
      // Continue even if logging is unavailable
    }

    return NextResponse.json({
      reply: responseText,
      source: 'gemini_ai',
    });
  } catch (error: any) {
    console.error('AI Concierge error:', error);
    return NextResponse.json(
      {
        reply: 'Thank you for reaching out to The Tour Vision Pune! Our luxury concierge is momentarily busy reviewing itineraries. Please submit an inquiry via our Trip Planner or click the WhatsApp button to connect directly with our travel specialists in Pune.',
        source: 'error_fallback',
      },
      { status: 200 }
    );
  }
}
