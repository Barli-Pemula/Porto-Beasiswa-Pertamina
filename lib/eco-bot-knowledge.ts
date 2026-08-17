import { EMISSION_FACTORS } from './emission-factors';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
}

export const TEMPLATE_QUESTIONS = [
  {
    category: '🚗 Transportasi',
    questions: [
      'Berapa emisi motor vs bus/KRL per km?',
      'Tips mobilitas ramah lingkungan di kampus?',
      'Seberapa besar dampak naik sepeda atau jalan kaki?',
    ],
  },
  {
    category: '🍽️ Makanan',
    questions: [
      'Kenapa daging sapi menghasilkan emisi sangat tinggi?',
      'Bagaimana menu makan ramah iklim bagi mahasiswa?',
      'Berapa emisi dari sampah sisa makanan?',
    ],
  },
  {
    category: '🔌 Energi & Kos',
    questions: [
      'Tips hemat listrik & AC untuk anak kos?',
      'Berapa emisi pemakaian laptop dan lampu seharian?',
      'Apakah mencabut colokan charger mengurangi emisi?',
    ],
  },
  {
    category: '📊 Seputar EcoTrace',
    questions: [
      'Bagaimana cara kerja perhitungan emisi di EcoTrace?',
      'Berapa target jejak karbon ideal per hari?',
      'Bagaimana cara ikut challenge dan naik peringkat?',
    ],
  },
];

/**
 * Smart Fallback Knowledge Engine when external API is unreachable or offline
 */
export function getLocalEcoBotResponse(userQuery: string): { reply: string; suggestions: string[] } {
  const query = userQuery.toLowerCase().trim();

  if (query.includes('motor') || query.includes('mobil') || query.includes('bus') || query.includes('transport') || query.includes('krl') || query.includes('sepeda')) {
    return {
      reply: `🚗 **Perbandingan Emisi Transportasi (Faktor Emisi EcoTrace):**
- **Sepeda Motor:** ~0.195 kg CO₂e / km
- **Mobil Pribadi (1.5L):** ~0.192 kg CO₂e / km
- **Bus / Angkutan Umum:** ~0.086 kg CO₂e / km *(Lebih hemat 55%!)*
- **KRL / Kereta Listrik:** ~0.041 kg CO₂e / km *(Paling efisien!)*
- **Jalan Kaki & Sepeda:** 0 kg CO₂e *(Bebas Emisi 🎉)*

💡 **Tips Si Eco:** Jika jarak perjalananmu kurang dari 2 km di area kampus IPB, biasakan berjalan kaki atau gowes sepeda. Selain tubuh lebih sehat, kamu menghemat ~0.4 kg emisi setiap hari!`,
      suggestions: [
        'Kenapa daging sapi menghasilkan emisi sangat tinggi?',
        'Tips hemat listrik & AC untuk anak kos?',
        'Berapa target jejak karbon ideal per hari?',
      ],
    };
  }

  if (query.includes('daging') || query.includes('sapi') || query.includes('makan') || query.includes('ayam') || query.includes('sayur') || query.includes('food') || query.includes('nabati')) {
    return {
      reply: `🍽️ **Jejak Karbon Pilihan Makanan Harian:**
- **Daging Sapi (200g):** ~4.20 kg CO₂e / porsi
- **Daging Ayam (200g):** ~0.66 kg CO₂e / porsi
- **Makanan Nabati / Sayuran:** ~0.25 kg CO₂e / porsi *(Hemat 94% emisi dibanding sapi!)*
- **Produk Susu / Dairy (250ml):** ~0.28 kg CO₂e / porsi

🐄 **Kenapa sapi tinggi emisi?** Sapi adalah hewan ruminansia yang menghasilkan gas metana (CH₄) dalam proses pencernaannya. Gas metana memiliki potensi pemanasan global 28x lebih kuat dibanding CO₂!

🌱 **Tips Si Eco:** Kamu tidak harus langsung vegetarian penuh. Coba terapkan *"Meatless Monday"* (1 hari tanpa daging merah seminggu) untuk memangkas hingga 15 kg emisi per bulan!`,
      suggestions: [
        'Berapa emisi dari sampah sisa makanan?',
        'Tips hemat listrik & AC untuk anak kos?',
        'Bagaimana cara kerja perhitungan emisi di EcoTrace?',
      ],
    };
  }

  if (query.includes('ac') || query.includes('listrik') || query.includes('energi') || query.includes('lampu') || query.includes('laptop') || query.includes('kos')) {
    return {
      reply: `🔌 **Jejak Karbon Penggunaan Energi Listrik:**
- **Air Conditioner (1000W):** ~0.840 kg CO₂e / jam
- **Kipas Angin (45W):** ~0.084 kg CO₂e / jam *(10x lebih hemat dari AC!)*
- **Lampu LED (8 Jam):** ~0.013 kg CO₂e / sesi
- **Charge Laptop Penuh:** ~0.050 kg CO₂e / charge

💡 **Tips Hemat Energi untuk Mahasiswa & Anak Kos:**
- **Atur Suhu AC di 24°C - 26°C:** Setiap kenaikan 1°C menghemat 6-10% konsumsi listrik.
- **Gunakan Timer AC:** Pasang timer mati otomatis 1 jam sebelum bangun tidur saat udara masih sejuk.
- **Cabut Colokan Charger:** Perangkat dalam mode standby (*phantom load*) tetap memakan 5-10% daya.`,
      suggestions: [
        'Berapa emisi motor vs bus/KRL per km?',
        'Kenapa daging sapi menghasilkan emisi sangat tinggi?',
        'Berapa target jejak karbon ideal per hari?',
      ],
    };
  }

  if (query.includes('sampah') || query.includes('plastik') || query.includes('daur ulang') || query.includes('waste') || query.includes('kresek')) {
    return {
      reply: `♻️ **Dampak Emisi Pengelolaan Sampah:**
- **Sampah Makanan (Food Waste):** ~1.90 kg CO₂e / kg *(Menghasilkan metana saat membusuk di TPA)*
- **Sampah Plastik Sekali Pakai:** ~0.50 kg CO₂e / kg
- **Sampah Didaur Ulang (Kertas/Kardus):** ~0.20 kg CO₂e / kg

🌱 **Aksi Nyata yang Bisa Dilakukan:**
- Bawa tumbler dan tempat makan sendiri saat jajan di kantin kampus.
- Habiskan porsi makanmu agar tidak menjadi sampah makanan di TPA.
- Pilah sampah plastik bersih untuk disetorkan ke bank sampah terdekat!`,
      suggestions: [
        'Bagaimana cara ikut challenge dan naik peringkat?',
        'Tips mobilitas ramah lingkungan di kampus?',
        'Bagaimana cara kerja perhitungan emisi di EcoTrace?',
      ],
    };
  }

  if (query.includes('target') || query.includes('ideal') || query.includes('rata-rata') || query.includes('berapa')) {
    return {
      reply: `📊 **Target Jejak Karbon Personal Ideal:**
- **Rata-rata Mahasiswa Saat Ini:** ~3.5 - 5.5 kg CO₂e / hari
- **Target Aman Iklim (Paris Agreement 1.5°C):** di bawah 2.0 - 2.5 kg CO₂e / hari
- **Benchmark Platform EcoTrace:** 2.80 kg CO₂e / hari

🎯 **Di EcoTrace:** Kamu bisa memantau grafik tren harian di Dashboard untuk memastikan emisimu berada di bawah batas aman hijau!`,
      suggestions: [
        'Bagaimana cara kerja perhitungan emisi di EcoTrace?',
        'Tips hemat listrik & AC untuk anak kos?',
        'Berapa emisi motor vs bus/KRL per km?',
      ],
    };
  }

  if (query.includes('ecotrace') || query.includes('hitung') || query.includes('cara kerja') || query.includes('rumus')) {
    return {
      reply: `🌿 **Cara Kerja Perhitungan Emisi di EcoTrace:**
EcoTrace menggunakan standar metodologi internasional **IPCC & EPA (Emissions Factor Database)**:

**Rumus Utama:**
Emisi (kg CO₂e) = Volume / Jarak × Faktor Emisi Aktivitas

**Contoh Perhitungan:**
- **Naik Motor 10 km:** 10 × 0.195 = 1.95 kg CO₂e
- **Menyalakan AC 4 Jam:** 4 × 0.840 = 3.36 kg CO₂e

💡 **Tips Si Eco:** Seluruh data catatanmu tersimpan otomatis dan bisa diekspor ke Excel (.xlsx) dengan tabel berkolom rapi atau diimpor secara massal!`,
      suggestions: [
        'Bagaimana cara ikut challenge dan naik peringkat?',
        'Berapa target jejak karbon ideal per hari?',
        'Kenapa daging sapi menghasilkan emisi sangat tinggi?',
      ],
    };
  }

  if (query.includes('challenge') || query.includes('tantangan') || query.includes('poin') || query.includes('peringkat') || query.includes('komunitas')) {
    return {
      reply: `🏆 **Tantangan & Papan Skor Komunitas EcoTrace:**
- **Langkah 1:** Buka menu **Tantangan** di navigasi utama.
- **Langkah 2:** Pilih tantangan iklim (misal: *Green Commute*, *Plant Power*, *AC Saver*).
- **Langkah 3:** Klik **Ikuti Tantangan** dan catat aktivitas harianmu di menu Logger.
- **Langkah 4:** Kumpulkan **EcoPoints** untuk menaikkan peringkatmu di Papan Skor Kampus! 🎉`,
      suggestions: [
        'Berapa target jejak karbon ideal per hari?',
        'Tips mobilitas ramah lingkungan di kampus?',
        'Kenapa daging sapi menghasilkan emisi sangat tinggi?',
      ],
    };
  }

  // General default helpful response
  return {
    reply: `Halo! Saya **Si Eco** 🐱🌱, asisten cerdas ramah lingkunganmu di EcoTrace.

Saya siap membantumu seputar:
- **Transportasi:** Perbandingan emisi motor, mobil, bus, KRL, dan sepeda.
- **Makanan:** Emisi daging sapi, ayam, sayuran, dan sampah makanan.
- **Energi:** Tips hemat listrik AC, laptop, dan lampu kamar kos.
- **Fitur EcoTrace:** Rumus hitung emisi, tantangan kampus, dan ekspor data ke Excel.

Silakan pilih template pertanyaan di bawah atau ketik pertanyaanmu sendiri ya! 👇`,
    suggestions: [
      'Berapa emisi motor vs bus/KRL per km?',
      'Kenapa daging sapi menghasilkan emisi sangat tinggi?',
      'Tips hemat listrik & AC untuk anak kos?',
      'Bagaimana cara kerja perhitungan emisi di EcoTrace?',
    ],
  };
}
