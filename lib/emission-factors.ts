export interface EmissionFactorItem {
  id: string;
  name: string;
  label: string;
  category: 'transport' | 'energy' | 'food' | 'waste';
  unit: string;
  factor: number; // kg CO2e per unit
  icon: string;
  description: string;
  defaultUnitValue: number;
}

export const EMISSION_FACTORS: Record<string, EmissionFactorItem> = {
  // Transport (per km)
  'transport-bus': {
    id: 'transport-bus',
    name: 'bus',
    label: 'Bus / Angkutan Umum',
    category: 'transport',
    unit: 'km',
    factor: 0.086,
    icon: '🚌',
    description: 'Perjalanan dengan bus publik atau angkot kampus',
    defaultUnitValue: 8,
  },
  'transport-motor': {
    id: 'transport-motor',
    name: 'motor',
    label: 'Sepeda Motor (125cc)',
    category: 'transport',
    unit: 'km',
    factor: 0.195,
    icon: '🛵',
    description: 'Perjalanan sepeda motor pribadi/ojek online',
    defaultUnitValue: 5,
  },
  'transport-car': {
    id: 'transport-car',
    name: 'car',
    label: 'Mobil Pribadi (1.5L)',
    category: 'transport',
    unit: 'km',
    factor: 0.192,
    icon: '🚗',
    description: 'Perjalanan mobil pribadi solo/ride-share',
    defaultUnitValue: 12,
  },
  'transport-train': {
    id: 'transport-train',
    name: 'train',
    label: 'KRL / MRT / Kereta',
    category: 'transport',
    unit: 'km',
    factor: 0.041,
    icon: '🚆',
    description: 'Perjalanan dengan kereta komuter atau MRT',
    defaultUnitValue: 20,
  },
  'transport-bike': {
    id: 'transport-bike',
    name: 'bike',
    label: 'Sepeda / Berjalan Kaki',
    category: 'transport',
    unit: 'km',
    factor: 0.0,
    icon: '🚶',
    description: 'Mobilitas aktif bebas emisi karbon',
    defaultUnitValue: 2,
  },

  // Food (per portion / serving)
  'food-beef': {
    id: 'food-beef',
    name: 'beef',
    label: 'Makanan Olahan Daging Sapi (200g)',
    category: 'food',
    unit: 'porsi',
    factor: 4.2,
    icon: '🥩',
    description: 'Rendang, bakso, atau steak sapi',
    defaultUnitValue: 1,
  },
  'food-chicken': {
    id: 'food-chicken',
    name: 'chicken',
    label: 'Makanan Unggas / Ayam (200g)',
    category: 'food',
    unit: 'porsi',
    factor: 0.66,
    icon: '🍗',
    description: 'Ayam geprek, goreng, atau bakar',
    defaultUnitValue: 1,
  },
  'food-veg': {
    id: 'food-veg',
    name: 'veg',
    label: 'Makanan Vegetaris / Nabati (400g)',
    category: 'food',
    unit: 'porsi',
    factor: 0.25,
    icon: '🥗',
    description: 'Gado-gado, tahu/tempe, pecel, sayuran',
    defaultUnitValue: 1,
  },
  'food-dairy': {
    id: 'food-dairy',
    name: 'dairy',
    label: 'Produk Olahan Susu / Dairy (250ml)',
    category: 'food',
    unit: 'porsi',
    factor: 0.28,
    icon: '🥛',
    description: 'Susu cair, keju, atau olahan dairy',
    defaultUnitValue: 1,
  },

  // Energy (per hour / event)
  'energy-ac': {
    id: 'energy-ac',
    name: 'ac',
    label: 'Air Conditioner (1000W)',
    category: 'energy',
    unit: 'jam',
    factor: 0.84,
    icon: '❄️',
    description: 'Penggunaan AC di kamar kos / ruang kuliah',
    defaultUnitValue: 4,
  },
  'energy-led': {
    id: 'energy-led',
    name: 'led',
    label: 'Lampu LED (8 Jam)',
    category: 'energy',
    unit: 'sesi',
    factor: 0.013,
    icon: '💡',
    description: 'Penerangan kamar kos malam hari',
    defaultUnitValue: 1,
  },
  'energy-fan': {
    id: 'energy-fan',
    name: 'fan',
    label: 'Kipas Angin (45W)',
    category: 'energy',
    unit: 'jam',
    factor: 0.084,
    icon: '🌀',
    description: 'Kipas angin meja atau gantung',
    defaultUnitValue: 6,
  },
  'energy-laptop': {
    id: 'energy-laptop',
    name: 'laptop',
    label: 'Pengisian Daya Laptop',
    category: 'energy',
    unit: 'charge',
    factor: 0.05,
    icon: '💻',
    description: 'Isi ulang baterai laptop full charge',
    defaultUnitValue: 2,
  },

  // Waste (per kg)
  'waste-plastic': {
    id: 'waste-plastic',
    name: 'plastic',
    label: 'Sampah Plastik Sekali Pakai',
    category: 'waste',
    unit: 'kg',
    factor: 0.5,
    icon: '🥤',
    description: 'Botol plastik, sedotan, kantong kresek',
    defaultUnitValue: 0.5,
  },
  'waste-food': {
    id: 'waste-food',
    name: 'food_waste',
    label: 'Sampah Makanan (Sisa Makanan)',
    category: 'waste',
    unit: 'kg',
    factor: 1.9,
    icon: '🗑️',
    description: 'Sisa makanan organik tidak terolah',
    defaultUnitValue: 0.3,
  },
  'waste-recycle': {
    id: 'waste-recycle',
    name: 'recycled',
    label: 'Sampah Didaur Ulang (Kertas/Kardus)',
    category: 'waste',
    unit: 'kg',
    factor: 0.2,
    icon: '♻️',
    description: 'Kertas, dus, dan botol yang terpilah',
    defaultUnitValue: 1.0,
  },
};

export function calculateCO2(typeId: string, value: number): number {
  const factorItem = EMISSION_FACTORS[typeId];
  if (!factorItem) return 0;
  return Number((factorItem.factor * value).toFixed(3));
}
