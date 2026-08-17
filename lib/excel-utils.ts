import * as XLSX from 'xlsx';
import { EMISSION_FACTORS, calculateCO2 } from './emission-factors';
import { MockActivity } from './mock-data';

export interface ParsedActivityRow {
  index: number;
  date: string;
  category: 'transport' | 'food' | 'energy' | 'waste';
  categoryLabel: string;
  activityType: string;
  activityLabel: string;
  value: number;
  unit: string;
  co2Equivalent: number;
  notes: string;
  isValid: boolean;
  warning?: string;
  error?: string;
}

export interface ParsedImportResult {
  rows: ParsedActivityRow[];
  validCount: number;
  invalidCount: number;
  totalCO2: number;
}

// Activity type lookup helper (supports ID, label, name, or keywords)
function matchActivityType(input: string, categoryHint?: string): { id: string; category: 'transport' | 'food' | 'energy' | 'waste'; unit: string; factor: number; label: string } | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase();

  // 1. Direct ID match
  if (EMISSION_FACTORS[clean]) {
    const item = EMISSION_FACTORS[clean];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }

  // 2. Search by key, label, name
  for (const key of Object.keys(EMISSION_FACTORS)) {
    const item = EMISSION_FACTORS[key];
    if (
      item.id.toLowerCase() === clean ||
      item.name.toLowerCase() === clean ||
      item.label.toLowerCase() === clean ||
      item.label.toLowerCase().includes(clean) ||
      clean.includes(item.name.toLowerCase())
    ) {
      return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
    }
  }

  // 3. Keyword heuristic match
  if (clean.includes('motor') || clean.includes('ojek') || clean.includes('scooter')) {
    const item = EMISSION_FACTORS['transport-motor'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('mobil') || clean.includes('car') || clean.includes('taksi') || clean.includes('grabcar')) {
    const item = EMISSION_FACTORS['transport-car'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('bus') || clean.includes('angkot') || clean.includes('bis') || clean.includes('transjakarta')) {
    const item = EMISSION_FACTORS['transport-bus'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('kereta') || clean.includes('krl') || clean.includes('mrt') || clean.includes('lrt') || clean.includes('train')) {
    const item = EMISSION_FACTORS['transport-train'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('sepeda') || clean.includes('jalan') || clean.includes('bike') || clean.includes('walk')) {
    const item = EMISSION_FACTORS['transport-bike'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('sapi') || clean.includes('beef') || clean.includes('rendang') || clean.includes('bakso') || clean.includes('steak')) {
    const item = EMISSION_FACTORS['food-beef'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('ayam') || clean.includes('chicken') || clean.includes('unggas') || clean.includes('geprek')) {
    const item = EMISSION_FACTORS['food-chicken'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('sayur') || clean.includes('veg') || clean.includes('salad') || clean.includes('tahu') || clean.includes('tempe') || clean.includes('pecel')) {
    const item = EMISSION_FACTORS['food-veg'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('susu') || clean.includes('dairy') || clean.includes('keju') || clean.includes('milk') || clean.includes('yogurt')) {
    const item = EMISSION_FACTORS['food-dairy'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('ac') || clean.includes('pendingin') || clean.includes('air conditioner')) {
    const item = EMISSION_FACTORS['energy-ac'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('led') || clean.includes('lampu') || clean.includes('light')) {
    const item = EMISSION_FACTORS['energy-led'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('kipas') || clean.includes('fan')) {
    const item = EMISSION_FACTORS['energy-fan'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('laptop') || clean.includes('komputer') || clean.includes('computer')) {
    const item = EMISSION_FACTORS['energy-laptop'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('plastik') || clean.includes('plastic') || clean.includes('kresek') || clean.includes('botol')) {
    const item = EMISSION_FACTORS['waste-plastic'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('sisa makanan') || clean.includes('sampah makanan') || clean.includes('food waste')) {
    const item = EMISSION_FACTORS['waste-food'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }
  if (clean.includes('daur ulang') || clean.includes('kardus') || clean.includes('kertas') || clean.includes('recycled') || clean.includes('recycle')) {
    const item = EMISSION_FACTORS['waste-recycle'];
    return { id: item.id, category: item.category, unit: item.unit, factor: item.factor, label: item.label };
  }

  // Fallback by category hint if provided
  if (categoryHint) {
    const catClean = categoryHint.trim().toLowerCase();
    if (catClean.includes('trans')) return { ...EMISSION_FACTORS['transport-motor'], label: EMISSION_FACTORS['transport-motor'].label };
    if (catClean.includes('mak') || catClean.includes('food')) return { ...EMISSION_FACTORS['food-chicken'], label: EMISSION_FACTORS['food-chicken'].label };
    if (catClean.includes('ener')) return { ...EMISSION_FACTORS['energy-ac'], label: EMISSION_FACTORS['energy-ac'].label };
    if (catClean.includes('samp') || catClean.includes('waste')) return { ...EMISSION_FACTORS['waste-plastic'], label: EMISSION_FACTORS['waste-plastic'].label };
  }

  return null;
}

const CATEGORY_LABELS: Record<string, string> = {
  transport: 'Transportasi',
  food: 'Makanan',
  energy: 'Energi',
  waste: 'Sampah',
};

/**
 * Format activity data into standard spreadsheet rows
 */
function prepareExportRows(activities: MockActivity[]) {
  return activities.map((act) => {
    const factorObj = EMISSION_FACTORS[act.activityType];
    const dateObj = new Date(act.timestamp);
    const formattedDate = isNaN(dateObj.getTime())
      ? act.timestamp
      : `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

    return {
      'ID Aktivitas': act.id,
      'Waktu & Tanggal': formattedDate,
      'Kategori': CATEGORY_LABELS[act.category] || act.category,
      'Jenis Aktivitas': factorObj?.label || act.activityType,
      'Kode Tipe': act.activityType,
      'Jumlah / Nilai': Number(act.value),
      'Satuan': act.unit,
      'Faktor Emisi (kg CO2e)': factorObj?.factor ?? 0,
      'Total Emisi Karbon (kg CO2e)': Number(act.co2Equivalent),
      'Catatan': act.notes || '',
    };
  });
}

/**
 * Export activities directly to real Microsoft Excel (.xlsx) workbook with styled table format & auto-width
 */
export function exportActivitiesToExcel(activities: MockActivity[], customFilename?: string) {
  const data = prepareExportRows(activities);
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set explicit column widths for Excel readability
  worksheet['!cols'] = [
    { wch: 18 }, // ID Aktivitas
    { wch: 19 }, // Waktu & Tanggal
    { wch: 14 }, // Kategori
    { wch: 32 }, // Jenis Aktivitas
    { wch: 16 }, // Kode Tipe
    { wch: 14 }, // Jumlah / Nilai
    { wch: 10 }, // Satuan
    { wch: 22 }, // Faktor Emisi
    { wch: 26 }, // Total Emisi Karbon
    { wch: 35 }, // Catatan
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Emisi Karbon');

  const filename = customFilename || `EcoTrace_Riwayat_Emisi_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

/**
 * Export activities to Excel-friendly CSV with UTF-8 BOM so Excel on Windows opens it with proper column tables
 */
export function exportActivitiesToCSV(activities: MockActivity[], customFilename?: string) {
  const data = prepareExportRows(activities);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet, { FS: ',' });

  // Add UTF-8 BOM (\uFEFF) so Microsoft Excel opens it directly with correct columns
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = customFilename || `EcoTrace_Riwayat_Emisi_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Download sample template as .xlsx
 */
export function downloadTemplateExcel() {
  const sampleData = [
    {
      'Waktu & Tanggal': '2026-08-15 08:30',
      'Kategori': 'Transportasi',
      'Jenis Aktivitas': 'Sepeda Motor (125cc)',
      'Jumlah / Nilai': 5,
      'Satuan': 'km',
      'Catatan': 'Perjalanan ke Kampus IPB Baranangsiang',
    },
    {
      'Waktu & Tanggal': '2026-08-15 12:15',
      'Kategori': 'Makanan',
      'Jenis Aktivitas': 'Makanan Unggas / Ayam (200g)',
      'Jumlah / Nilai': 1,
      'Satuan': 'porsi',
      'Catatan': 'Makan siang ayam bakar di kantin',
    },
    {
      'Waktu & Tanggal': '2026-08-15 14:00',
      'Kategori': 'Energi',
      'Jenis Aktivitas': 'Air Conditioner (1000W)',
      'Jumlah / Nilai': 3,
      'Satuan': 'jam',
      'Catatan': 'Belajar di kamar kos dengan AC',
    },
    {
      'Waktu & Tanggal': '2026-08-15 18:30',
      'Kategori': 'Sampah',
      'Jenis Aktivitas': 'Sampah Plastik Sekali Pakai',
      'Jumlah / Nilai': 0.2,
      'Satuan': 'kg',
      'Catatan': 'Kemasan snack dan botol minuman',
    },
  ];

  const guideData = [
    {
      'Kategori': 'Transportasi (transport)',
      'Pilihan Aktivitas': 'Sepeda Motor (125cc), Mobil Pribadi (1.5L), Bus / Angkutan Umum, KRL / MRT / Kereta, Sepeda / Berjalan Kaki',
      'Satuan Default': 'km',
    },
    {
      'Kategori': 'Makanan (food)',
      'Pilihan Aktivitas': 'Makanan Olahan Daging Sapi (200g), Makanan Unggas / Ayam (200g), Makanan Vegetaris / Nabati (400g), Produk Olahan Susu / Dairy (250ml)',
      'Satuan Default': 'porsi',
    },
    {
      'Kategori': 'Energi (energy)',
      'Pilihan Aktivitas': 'Air Conditioner (1000W), Lampu LED (8 Jam), Kipas Angin (45W), Pengisian Daya Laptop',
      'Satuan Default': 'jam / sesi / charge',
    },
    {
      'Kategori': 'Sampah (waste)',
      'Pilihan Aktivitas': 'Sampah Plastik Sekali Pakai, Sampah Makanan (Sisa Makanan), Sampah Didaur Ulang (Kertas/Kardus)',
      'Satuan Default': 'kg',
    },
  ];

  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(sampleData);
  ws1['!cols'] = [{ wch: 18 }, { wch: 14 }, { wch: 32 }, { wch: 14 }, { wch: 10 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Data_Aktivitas_Import');

  const ws2 = XLSX.utils.json_to_sheet(guideData);
  ws2['!cols'] = [{ wch: 22 }, { wch: 70 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Petunjuk_Kategori');

  XLSX.writeFile(wb, 'EcoTrace_Template_Import_Aktivitas.xlsx');
}

/**
 * Download sample template as .csv
 */
export function downloadTemplateCSV() {
  const sampleData = [
    {
      'Waktu & Tanggal': '2026-08-15 08:30',
      'Kategori': 'Transportasi',
      'Jenis Aktivitas': 'Sepeda Motor (125cc)',
      'Jumlah / Nilai': 5,
      'Satuan': 'km',
      'Catatan': 'Perjalanan ke Kampus IPB Baranangsiang',
    },
    {
      'Waktu & Tanggal': '2026-08-15 12:15',
      'Kategori': 'Makanan',
      'Jenis Aktivitas': 'Makanan Unggas / Ayam (200g)',
      'Jumlah / Nilai': 1,
      'Satuan': 'porsi',
      'Catatan': 'Makan siang ayam bakar di kantin',
    },
    {
      'Waktu & Tanggal': '2026-08-15 14:00',
      'Kategori': 'Energi',
      'Jenis Aktivitas': 'Air Conditioner (1000W)',
      'Jumlah / Nilai': 3,
      'Satuan': 'jam',
      'Catatan': 'Belajar di kamar kos dengan AC',
    },
    {
      'Waktu & Tanggal': '2026-08-15 18:30',
      'Kategori': 'Sampah',
      'Jenis Aktivitas': 'Sampah Plastik Sekali Pakai',
      'Jumlah / Nilai': 0.2,
      'Satuan': 'kg',
      'Catatan': 'Kemasan snack dan botol minuman',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const csv = XLSX.utils.sheet_to_csv(ws, { FS: ',' });
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'EcoTrace_Template_Import_Aktivitas.csv';
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Parse any uploaded Spreadsheet (Excel .xlsx, .xls, or CSV .csv)
 */
export async function parseActivitiesSpreadsheet(file: File): Promise<ParsedImportResult> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('File spreadsheet kosong atau tidak memiliki lembar kerja (sheet).');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

  if (!rawRows || rawRows.length === 0) {
    throw new Error('Tidak ditemukan baris data di dalam file spreadsheet yang diunggah.');
  }

  const parsedRows: ParsedActivityRow[] = [];
  let validCount = 0;
  let invalidCount = 0;
  let totalCO2 = 0;

  rawRows.forEach((row, idx) => {
    // Find keys flexibly
    const keys = Object.keys(row);
    const findVal = (terms: string[]) => {
      const foundKey = keys.find((k) => terms.some((t) => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes(t)));
      return foundKey ? row[foundKey] : undefined;
    };

    const rawDate = findVal(['waktu', 'tanggal', 'date', 'timestamp', 'time']);
    const rawCategory = findVal(['kategori', 'category', 'cat']);
    const rawActivity = findVal(['jenis', 'aktivitas', 'activity', 'tipe', 'type', 'nama']);
    const rawValue = findVal(['jumlah', 'nilai', 'value', 'volume', 'qty', 'kuantitas', 'jarak']);
    const rawUnit = findVal(['satuan', 'unit']);
    const rawNotes = findVal(['catatan', 'notes', 'keterangan', 'note']) || '';

    let dateStr = '';
    if (rawDate instanceof Date) {
      dateStr = rawDate.toISOString();
    } else if (rawDate) {
      const parsedD = new Date(String(rawDate));
      dateStr = isNaN(parsedD.getTime()) ? new Date().toISOString() : parsedD.toISOString();
    } else {
      dateStr = new Date().toISOString();
    }

    const numValue = typeof rawValue === 'number' ? rawValue : parseFloat(String(rawValue || '0').replace(',', '.'));

    const match = matchActivityType(String(rawActivity || ''), String(rawCategory || ''));

    if (!match) {
      invalidCount++;
      parsedRows.push({
        index: idx + 1,
        date: dateStr,
        category: 'transport',
        categoryLabel: rawCategory ? String(rawCategory) : 'Tidak Diketahui',
        activityType: 'unknown',
        activityLabel: rawActivity ? String(rawActivity) : '(Kosong)',
        value: isNaN(numValue) ? 0 : numValue,
        unit: rawUnit ? String(rawUnit) : 'unit',
        co2Equivalent: 0,
        notes: String(rawNotes),
        isValid: false,
        error: `Jenis aktivitas "${rawActivity || '-'}" tidak dikenali dalam basis data faktor emisi.`,
      });
      return;
    }

    if (isNaN(numValue) || numValue <= 0) {
      invalidCount++;
      parsedRows.push({
        index: idx + 1,
        date: dateStr,
        category: match.category,
        categoryLabel: CATEGORY_LABELS[match.category],
        activityType: match.id,
        activityLabel: match.label,
        value: 0,
        unit: match.unit,
        co2Equivalent: 0,
        notes: String(rawNotes),
        isValid: false,
        error: 'Jumlah/nilai aktivitas harus berupa angka positif lebih dari 0.',
      });
      return;
    }

    const co2 = calculateCO2(match.id, numValue);
    validCount++;
    totalCO2 += co2;

    let warning: string | undefined;
    if (rawUnit && String(rawUnit).toLowerCase() !== match.unit.toLowerCase()) {
      warning = `Satuan disesuaikan dari "${rawUnit}" ke "${match.unit}".`;
    }

    parsedRows.push({
      index: idx + 1,
      date: dateStr,
      category: match.category,
      categoryLabel: CATEGORY_LABELS[match.category],
      activityType: match.id,
      activityLabel: match.label,
      value: numValue,
      unit: match.unit,
      co2Equivalent: co2,
      notes: String(rawNotes),
      isValid: true,
      warning,
    });
  });

  return {
    rows: parsedRows,
    validCount,
    invalidCount,
    totalCO2: Number(totalCO2.toFixed(2)),
  };
}
