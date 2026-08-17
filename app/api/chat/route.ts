import { NextRequest, NextResponse } from 'next/server';
import { getLocalEcoBotResponse } from '@/lib/eco-bot-knowledge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    const trimmed = message.trim();
    const systemPrompt = `Kamu adalah "Si Eco", maskot dan asisten AI ramah lingkungan di platform EcoTrace (aplikasi pelacak jejak karbon personal mahasiswa IPB University).
Karakteristikmu:
- Sangat ramah, ceria, edukatif, solutif, dan menggunakan emoji alam (🌱, 🌿, 💡, 🚗, 🍽️, 🔋, 🌳).
- Berikan jawaban yang praktis, ringkas, mudah dipahami mahasiswa, dalam Bahasa Indonesia yang santun dan akrab.
- Jika ditanya angka emisi, gunakan standar faktor emisi (Motor: 0.195 kg/km, Mobil: 0.192 kg/km, Bus: 0.086 kg/km, KRL: 0.041 kg/km, Sepeda/Jalan: 0 kg, Daging Sapi: 4.2 kg/porsi, Daging Ayam: 0.66 kg/porsi, Sayur/Nabati: 0.25 kg/porsi, AC 1000W: 0.84 kg/jam, Laptop: 0.05 kg/charge).
- Format jawaban dengan rapi menggunakan markdown (bullet points, bold).`;

    // Attempt to call Free AI text API with 8-second timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const endpoint = `https://text.pollinations.ai/${encodeURIComponent(trimmed)}?model=openai&system=${encodeURIComponent(systemPrompt)}`;
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 10) {
          const fallback = getLocalEcoBotResponse(trimmed);
          return NextResponse.json({
            reply: text.trim(),
            suggestions: fallback.suggestions,
            source: 'free_ai_api',
          });
        }
      }
    } catch (apiErr) {
      console.warn('Free AI API unavailable or timed out, using local smart knowledge base:', apiErr);
    }

    // Graceful fallback to smart local knowledge base
    const fallbackResponse = getLocalEcoBotResponse(trimmed);
    return NextResponse.json({
      reply: fallbackResponse.reply,
      suggestions: fallbackResponse.suggestions,
      source: 'local_knowledge',
    });
  } catch (error: any) {
    console.error('Chat API Route Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat memproses pertanyaan.' },
      { status: 500 }
    );
  }
}
