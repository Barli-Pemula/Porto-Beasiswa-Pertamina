import { EMISSION_FACTORS, calculateCO2 } from './emission-factors';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  cohort: string; // e.g. "2024", "2023", "2022"
  department: string; // e.g. "Ilmu Komputer", "Pertanian", "Manajemen"
  isAnonymous: boolean;
  privacyLevel: 'public' | 'friends' | 'private';
  createdAt: string;
  avatarUrl: string;
  points: number;
}

export interface MockActivity {
  id: string;
  userId: string;
  activityType: string; // key of EMISSION_FACTORS
  category: 'transport' | 'energy' | 'food' | 'waste';
  value: number;
  unit: string;
  co2Equivalent: number;
  timestamp: string; // ISO string
  notes?: string;
}

export interface MockChallenge {
  id: string;
  title: string;
  description: string;
  category: 'reduction' | 'adoption' | 'community';
  activityCategory: 'transport' | 'energy' | 'food' | 'waste' | 'all';
  difficulty: 'easy' | 'medium' | 'hard';
  startDate: string;
  endDate: string;
  targetReduction: number; // e.g., 20 (%)
  rewardPoints: number;
  icon: string;
  imageUrl: string;
  participantsCount: number;
}

export interface ChallengeParticipation {
  id: string;
  userId: string;
  challengeId: string;
  progress: number; // 0 to 100
  status: 'active' | 'completed';
  joinedAt: string;
}

// 16 Users
export const MOCK_USERS: MockUser[] = [
  {
    id: 'user-1',
    email: 'barlian@apps.ipb.ac.id',
    name: 'Barlian Athallah Dyu',
    cohort: '2024',
    department: 'Ilmu Komputer',
    isAnonymous: false,
    privacyLevel: 'public',
    createdAt: '2026-05-10T08:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    points: 340,
  },
  {
    id: 'user-2',
    email: 'sarah.dewi@apps.ipb.ac.id',
    name: 'Sarah Dewi',
    cohort: '2023',
    department: 'Agronomi & Hortikultura',
    isAnonymous: false,
    privacyLevel: 'public',
    createdAt: '2026-05-12T09:30:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    points: 410,
  },
  {
    id: 'user-3',
    email: 'muhammad.faiz@apps.ipb.ac.id',
    name: 'Muhammad Faiz',
    cohort: '2022',
    department: 'Manajemen',
    isAnonymous: true,
    privacyLevel: 'private',
    createdAt: '2026-05-15T10:15:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    points: 290,
  },
  {
    id: 'user-4',
    email: 'annisa.n@apps.ipb.ac.id',
    name: 'Annisa Nurul',
    cohort: '2024',
    department: 'Kedokteran Hewan',
    isAnonymous: false,
    privacyLevel: 'public',
    createdAt: '2026-05-20T11:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80',
    points: 520,
  },
  {
    id: 'user-5',
    email: 'rizky.pratama@apps.ipb.ac.id',
    name: 'Rizky Pratama',
    cohort: '2023',
    department: 'Teknik Sipil & Lingkungan',
    isAnonymous: true,
    privacyLevel: 'friends',
    createdAt: '2026-05-22T14:20:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    points: 180,
  },
  {
    id: 'user-6',
    email: 'dian.sastro@apps.ipb.ac.id',
    name: 'Dian Sastrowardoyo',
    cohort: '2022',
    department: 'Teknologi Pangan',
    isAnonymous: false,
    privacyLevel: 'public',
    createdAt: '2026-06-01T08:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    points: 390,
  },
  {
    id: 'user-7',
    email: 'fajar.ramadhan@apps.ipb.ac.id',
    name: 'Fajar Ramadhan',
    cohort: '2024',
    department: 'Ekonomi Pembangunan',
    isAnonymous: true,
    privacyLevel: 'private',
    createdAt: '2026-06-05T09:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
    points: 210,
  },
  {
    id: 'user-8',
    email: 'citra.kirana@apps.ipb.ac.id',
    name: 'Citra Kirana',
    cohort: '2023',
    department: 'Statistika & Sains Data',
    isAnonymous: false,
    privacyLevel: 'public',
    createdAt: '2026-06-10T12:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    points: 480,
  },
  {
    id: 'user-9',
    email: 'kevin.sanjava@apps.ipb.ac.id',
    name: 'Kevin Sanjaya',
    cohort: '2022',
    department: 'Arsitektur Lansekap',
    isAnonymous: true,
    privacyLevel: 'private',
    createdAt: '2026-06-12T15:30:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
    points: 150,
  },
  {
    id: 'user-10',
    email: 'maya.nirmala@apps.ipb.ac.id',
    name: 'Maya Nirmala',
    cohort: '2024',
    department: 'Biologi',
    isAnonymous: false,
    privacyLevel: 'public',
    createdAt: '2026-06-15T16:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=250&q=80',
    points: 310,
  },
  {
    id: 'user-11',
    email: 'ahmad.zaki@apps.ipb.ac.id',
    name: 'Ahmad Zaki',
    cohort: '2023',
    department: 'Ilmu Komputer',
    isAnonymous: false,
    privacyLevel: 'public',
    createdAt: '2026-06-18T10:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80',
    points: 270,
  },
  {
    id: 'user-12',
    email: 'putri.utami@apps.ipb.ac.id',
    name: 'Putri Utami',
    cohort: '2022',
    department: 'Silvikultur',
    isAnonymous: false,
    privacyLevel: 'public',
    createdAt: '2026-06-20T11:45:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    points: 360,
  },
  {
    id: 'user-13',
    email: 'bintang.samudra@apps.ipb.ac.id',
    name: 'Bintang Samudra',
    cohort: '2024',
    department: 'Teknologi Hasil Perairan',
    isAnonymous: true,
    privacyLevel: 'private',
    createdAt: '2026-06-25T13:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
    points: 190,
  },
  {
    id: 'user-14',
    email: 'dinda.lestari@apps.ipb.ac.id',
    name: 'Dinda Lestari',
    cohort: '2023',
    department: 'Komunikasi & Pengembangan Masyarakat',
    isAnonymous: false,
    privacyLevel: 'public',
    createdAt: '2026-07-01T09:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=250&q=80',
    points: 440,
  },
  {
    id: 'user-15',
    email: 'gilang.persada@apps.ipb.ac.id',
    name: 'Gilang Persada',
    cohort: '2022',
    department: 'Kimia',
    isAnonymous: true,
    privacyLevel: 'private',
    createdAt: '2026-07-05T14:10:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=250&q=80',
    points: 220,
  },
  {
    id: 'user-16',
    email: 'hannah.alrasyid@apps.ipb.ac.id',
    name: 'Hannah Al Rasyid',
    cohort: '2024',
    department: 'Fisika',
    isAnonymous: false,
    privacyLevel: 'public',
    createdAt: '2026-07-10T10:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=250&q=80',
    points: 300,
  },
];

// 8 Challenges
export const MOCK_CHALLENGES: MockChallenge[] = [
  {
    id: 'challenge-1',
    title: 'No Motor Monday',
    description: 'Gunakan angkutan umum, sepeda, atau jalan kaki setiap hari Senin.',
    category: 'reduction',
    activityCategory: 'transport',
    difficulty: 'medium',
    startDate: '2026-08-01T00:00:00Z',
    endDate: '2026-08-31T23:59:59Z',
    targetReduction: 25,
    rewardPoints: 30,
    icon: '🛵',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    participantsCount: 84,
  },
  {
    id: 'challenge-2',
    title: 'Meatless Tuesday',
    description: 'Pilih hidangan vegetarian 2 hari seminggu untuk mengurangi emisi ternak.',
    category: 'reduction',
    activityCategory: 'food',
    difficulty: 'easy',
    startDate: '2026-08-01T00:00:00Z',
    endDate: '2026-08-31T23:59:59Z',
    targetReduction: 30,
    rewardPoints: 20,
    icon: '🥗',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    participantsCount: 112,
  },
  {
    id: 'challenge-3',
    title: 'Plastic-Free Week',
    description: 'Hindari penggunaan plastik sekali pakai selama 7 hari berturut-turut.',
    category: 'reduction',
    activityCategory: 'waste',
    difficulty: 'hard',
    startDate: '2026-08-10T00:00:00Z',
    endDate: '2026-08-25T23:59:59Z',
    targetReduction: 40,
    rewardPoints: 50,
    icon: '🥤',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    participantsCount: 65,
  },
  {
    id: 'challenge-4',
    title: 'Energy Conscious Kos',
    description: 'Matikan AC & lampu ruang belajar saat ditinggal lebih dari 30 menit.',
    category: 'adoption',
    activityCategory: 'energy',
    difficulty: 'easy',
    startDate: '2026-08-05T00:00:00Z',
    endDate: '2026-08-28T23:59:59Z',
    targetReduction: 20,
    rewardPoints: 25,
    icon: '💡',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=600&q=80',
    participantsCount: 97,
  },
  {
    id: 'challenge-5',
    title: 'Green Commute Hero',
    description: 'Kumpulkan minimal 50 km perjalanan sepeda / KRL / bus dalam kurun 2 minggu.',
    category: 'adoption',
    activityCategory: 'transport',
    difficulty: 'medium',
    startDate: '2026-08-01T00:00:00Z',
    endDate: '2026-08-20T23:59:59Z',
    targetReduction: 35,
    rewardPoints: 35,
    icon: '🚌',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    participantsCount: 78,
  },
  {
    id: 'challenge-6',
    title: 'Campus Carbon Cup 2026',
    description: 'Kompetisi kolektif antar angkatan & jurusan dengan akumulasi pengurangan CO2 terbanyak.',
    category: 'community',
    activityCategory: 'all',
    difficulty: 'hard',
    startDate: '2026-08-01T00:00:00Z',
    endDate: '2026-09-15T23:59:59Z',
    targetReduction: 50,
    rewardPoints: 100,
    icon: '🏆',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    participantsCount: 145,
  },
  {
    id: 'challenge-7',
    title: 'Zero Food Waste Challenge',
    description: 'Habiskan setiap makanan tanpa meninggalkan sisa sisa organik selama 5 hari.',
    category: 'reduction',
    activityCategory: 'food',
    difficulty: 'medium',
    startDate: '2026-08-12T00:00:00Z',
    endDate: '2026-08-27T23:59:59Z',
    targetReduction: 30,
    rewardPoints: 30,
    icon: '🍱',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
    participantsCount: 56,
  },
  {
    id: 'challenge-8',
    title: 'Kipas Sebagai Ganti AC',
    description: 'Gunakan kipas angin sebagai pengganti pendingin udara AC di siang hari.',
    category: 'adoption',
    activityCategory: 'energy',
    difficulty: 'easy',
    startDate: '2026-08-15T00:00:00Z',
    endDate: '2026-08-30T23:59:59Z',
    targetReduction: 15,
    rewardPoints: 20,
    icon: '🌀',
    imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80',
    participantsCount: 42,
  },
];

// Deterministic Pseudo-Random Generator (Seeded) for 100% SSR & Client Hydration Consistency
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 9999 + 1234) * 10000;
  return x - Math.floor(x);
}

// Deterministic Helper to generate activity entries spread over 90 days ending today (2026-08-14)
function generateMockActivities(): MockActivity[] {
  const activities: MockActivity[] = [];
  const now = new Date('2026-08-14T14:00:00Z');

  const transportTypes = ['transport-bus', 'transport-motor', 'transport-car', 'transport-bike', 'transport-train'];
  const foodTypes = ['food-beef', 'food-chicken', 'food-veg', 'food-dairy'];
  const energyTypes = ['energy-ac', 'energy-led', 'energy-fan', 'energy-laptop'];
  const wasteTypes = ['waste-plastic', 'waste-food', 'waste-recycle'];

  let seedCounter = 1;

  for (let dayOffset = 89; dayOffset >= 0; dayOffset--) {
    const dayDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
    const numActivities = dayOffset <= 30 ? (dayOffset % 2 === 0 ? 4 : 3) : (dayOffset % 3 === 0 ? 2 : 1);

    for (let a = 0; a < numActivities; a++) {
      const userIndex = Math.floor(pseudoRandom(seedCounter++) * 4);
      const userId = MOCK_USERS[userIndex].id;

      const randCat = pseudoRandom(seedCounter++);
      let typeId: string;
      let category: 'transport' | 'energy' | 'food' | 'waste';
      let value: number;

      if (randCat < 0.45) {
        category = 'transport';
        typeId = transportTypes[Math.floor(pseudoRandom(seedCounter++) * transportTypes.length)];
        value = typeId === 'transport-bike' ? Math.floor(pseudoRandom(seedCounter++) * 4) + 1 : Math.floor(pseudoRandom(seedCounter++) * 15) + 3;
      } else if (randCat < 0.73) {
        category = 'food';
        typeId = foodTypes[Math.floor(pseudoRandom(seedCounter++) * foodTypes.length)];
        value = 1;
      } else if (randCat < 0.91) {
        category = 'energy';
        typeId = energyTypes[Math.floor(pseudoRandom(seedCounter++) * energyTypes.length)];
        value = typeId === 'energy-ac' ? Math.floor(pseudoRandom(seedCounter++) * 6) + 2 : Math.floor(pseudoRandom(seedCounter++) * 3) + 1;
      } else {
        category = 'waste';
        typeId = wasteTypes[Math.floor(pseudoRandom(seedCounter++) * wasteTypes.length)];
        value = Number((pseudoRandom(seedCounter++) * 1.5 + 0.2).toFixed(1));
      }

      let hour: number;
      const hourSlot = a % 3;
      if (hourSlot === 0) hour = 7 + Math.floor(pseudoRandom(seedCounter++) * 2);
      else if (hourSlot === 1) hour = 12 + Math.floor(pseudoRandom(seedCounter++) * 2);
      else hour = 17 + Math.floor(pseudoRandom(seedCounter++) * 3);

      const timestamp = new Date(dayDate);
      timestamp.setHours(hour, Math.floor(pseudoRandom(seedCounter++) * 60), 0, 0);

      const factorObj = EMISSION_FACTORS[typeId];
      const co2Equivalent = calculateCO2(typeId, value);

      activities.push({
        id: `act-${seedCounter}`,
        userId,
        activityType: typeId,
        category,
        value,
        unit: factorObj ? factorObj.unit : 'unit',
        co2Equivalent,
        timestamp: timestamp.toISOString(),
        notes: category === 'transport' ? 'Perjalanan Kampus IPB Dramaga' : category === 'food' ? 'Makan siang kantin' : undefined,
      });
    }
  }

  for (let u = 4; u < MOCK_USERS.length; u++) {
    const uId = MOCK_USERS[u].id;
    const userCount = Math.floor(pseudoRandom(seedCounter++) * 8) + 6;
    for (let c = 0; c < userCount; c++) {
      const daysBack = Math.floor(pseudoRandom(seedCounter++) * 30);
      const timestamp = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
      timestamp.setHours(8 + Math.floor(pseudoRandom(seedCounter++) * 10), Math.floor(pseudoRandom(seedCounter++) * 60));

      const typeKeys = Object.keys(EMISSION_FACTORS);
      const typeId = typeKeys[Math.floor(pseudoRandom(seedCounter++) * typeKeys.length)];
      const factorObj = EMISSION_FACTORS[typeId];
      const val = factorObj.category === 'transport' ? Math.floor(pseudoRandom(seedCounter++) * 12) + 2 : 1;

      activities.push({
        id: `act-${seedCounter}`,
        userId: uId,
        activityType: typeId,
        category: factorObj.category,
        value: val,
        unit: factorObj.unit,
        co2Equivalent: calculateCO2(typeId, val),
        timestamp: timestamp.toISOString(),
      });
    }
  }

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const MOCK_ACTIVITIES: MockActivity[] = generateMockActivities();

// Initial participations
export const MOCK_PARTICIPATIONS: ChallengeParticipation[] = [
  { id: 'part-1', userId: 'user-1', challengeId: 'challenge-1', progress: 75, status: 'active', joinedAt: '2026-08-02T10:00:00Z' },
  { id: 'part-2', userId: 'user-1', challengeId: 'challenge-2', progress: 100, status: 'completed', joinedAt: '2026-08-01T09:00:00Z' },
  { id: 'part-3', userId: 'user-1', challengeId: 'challenge-6', progress: 40, status: 'active', joinedAt: '2026-08-03T11:00:00Z' },
  { id: 'part-4', userId: 'user-2', challengeId: 'challenge-1', progress: 50, status: 'active', joinedAt: '2026-08-02T14:00:00Z' },
  { id: 'part-5', userId: 'user-2', challengeId: 'challenge-3', progress: 90, status: 'active', joinedAt: '2026-08-11T08:00:00Z' },
];
