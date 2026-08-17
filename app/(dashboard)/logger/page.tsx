'use client';

import React, { useState } from 'react';
import { EMISSION_FACTORS, calculateCO2 } from '@/lib/emission-factors';
import { addActivity } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { EcoGuide } from '@/components/eco-guide';
import { CsvImportModal } from '@/components/csv-import-modal';
import Link from 'next/link';
import {
  Car,
  Zap,
  UtensilsCrossed,
  Recycle,
  CheckCircle2,
  Plus,
  Sparkles,
  ArrowRight,
  Info,
  TreePine,
  Lightbulb,
  FileSpreadsheet,
  Upload,
} from 'lucide-react';

type CategoryType = 'transport' | 'energy' | 'food' | 'waste';

export default function CarbonLoggerPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('transport');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('transport-motor');
  const [valueInput, setValueInput] = useState<number>(5);
  const [notesInput, setNotesInput] = useState<string>('');
  const [submittedData, setSubmittedData] = useState<{ co2: number; label: string } | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importNotification, setImportNotification] = useState<{ count: number; totalCO2: number } | null>(null);

  const availableFactors = Object.values(EMISSION_FACTORS).filter(
    (item) => item.category === selectedCategory
  );

  const currentFactor = EMISSION_FACTORS[selectedTypeId] || availableFactors[0];
  const calculatedCO2 = currentFactor ? calculateCO2(currentFactor.id, valueInput) : 0;

  const treesEquiv = (calculatedCO2 / 2.5).toFixed(1);
  const lightHours = Math.round(calculatedCO2 * 80);

  const handleCategoryChange = (cat: CategoryType) => {
    setSelectedCategory(cat);
    const firstFactor = Object.values(EMISSION_FACTORS).find((f) => f.category === cat);
    if (firstFactor) {
      setSelectedTypeId(firstFactor.id);
      setValueInput(firstFactor.defaultUnitValue);
    }
  };

  const handleTypeChange = (typeId: string) => {
    setSelectedTypeId(typeId);
    const factorObj = EMISSION_FACTORS[typeId];
    if (factorObj) {
      setValueInput(factorObj.defaultUnitValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFactor || valueInput <= 0) return;

    const co2 = calculateCO2(currentFactor.id, valueInput);

    addActivity({
      userId: user ? user.id : 'user-1',
      activityType: currentFactor.id,
      category: selectedCategory,
      value: valueInput,
      unit: currentFactor.unit,
      co2Equivalent: co2,
      timestamp: new Date().toISOString(),
      notes: notesInput || undefined,
    });

    setSubmittedData({
      co2,
      label: currentFactor.label,
    });
  };

  const handleReset = () => {
    setSubmittedData(null);
    setNotesInput('');
  };

  const handleImportSuccess = (count: number, totalCO2: number) => {
    setImportNotification({ count, totalCO2 });
    setTimeout(() => {
      setImportNotification(null);
    }, 5000);
  };

  const categoriesConfig = [
    {
      id: 'transport',
      label: 'Transportasi',
      icon: Car,
      activeBg: 'bg-blue-50 border-blue-500 text-blue-800',
    },
    {
      id: 'energy',
      label: 'Energi',
      icon: Zap,
      activeBg: 'bg-amber-50 border-amber-500 text-amber-800',
    },
    {
      id: 'food',
      label: 'Makanan',
      icon: UtensilsCrossed,
      activeBg: 'bg-emerald-50 border-emerald-500 text-emerald-800',
    },
    {
      id: 'waste',
      label: 'Sampah',
      icon: Recycle,
      activeBg: 'bg-teal-50 border-teal-500 text-teal-800',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1 text-left">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Catat Emisi Karbon Harian
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pilih aktivitas harian Anda. Form ini dirancang agar mudah digunakan oleh siapa saja dalam 30 detik!
          </p>
        </div>

        <button
          onClick={() => setIsImportModalOpen(true)}
          className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4 text-emerald-600" />
          <span>Impor Banyak Data (Excel/CSV)</span>
        </button>
      </div>

      {importNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-xs sm:text-sm">Batch Import Berhasil!</p>
              <p className="text-[11px] sm:text-xs text-emerald-700">
                Berhasil mengimpor <strong>{importNotification.count}</strong> data aktivitas (total <strong>+{importNotification.totalCO2.toFixed(2)} kg CO₂e</strong>).
              </p>
            </div>
          </div>
          <Link
            href="/activities"
            className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
          >
            Lihat di Riwayat
          </Link>
        </div>
      )}

      {submittedData ? (
        /* Success Celebration State */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="space-y-1.5">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-[11px] sm:text-xs rounded-full">
              Pencatatan Berhasil Disimpan 🎉
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              +{submittedData.co2} <span className="text-xs sm:text-sm text-slate-500 font-normal">kg CO₂e</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Aktivitas <span className="font-bold text-slate-900">{submittedData.label}</span> tersimpan di akun Anda.
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-sm mx-auto text-xs text-emerald-800 space-y-1">
            <p className="font-bold">🌳 Dampak Baik Anda:</p>
            <p>Emisi ini berhasil terpantau untuk dikendalikan menuju target penurunan 10% minggu ini!</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 gradient-eco text-white font-bold rounded-xl text-xs shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Catat Aktivitas Lain
            </button>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors text-center"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      ) : (
        /* Form State */
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-6 sm:space-y-8">
          {/* Step 1: Category Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">1</span>
                Pilih Kategori Emisi
              </label>
              <span className="text-[11px] text-slate-400">4 Kategori Utama</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categoriesConfig.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id as CategoryType)}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? `${cat.activeBg} font-bold shadow-md shadow-slate-100 scale-[1.02]`
                        : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Activity Types Option List */}
          <div className="space-y-2.5">
            <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">2</span>
              Pilih Jenis Aktivitas
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableFactors.map((item) => {
                const isSelected = selectedTypeId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTypeChange(item.id)}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                        : 'border-slate-200/80 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${isSelected ? 'font-bold text-emerald-900' : 'font-semibold text-slate-800'}`}>
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Input Quantity & Live Calculation Box */}
          <form onSubmit={handleSubmit} className="space-y-5 pt-2 border-t border-slate-100">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">3</span>
                Jumlah Pemakaian / Durasi ({currentFactor?.unit})
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  value={valueInput}
                  onChange={(e) => setValueInput(parseFloat(e.target.value) || 0)}
                  className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  placeholder="0"
                  required
                />
                <span className="px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs uppercase tracking-wider">
                  {currentFactor?.unit}
                </span>
              </div>
            </div>

            {/* Live Instant Carbon Calculation Card */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                      Estimasi Emisi Karbon Terhitung
                    </p>
                    <p className="text-lg sm:text-xl font-extrabold text-emerald-950">
                      {calculatedCO2} <span className="text-xs font-semibold text-emerald-700">kg CO₂e</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                  EPA / IPCC
                </span>
              </div>

              {/* Friendly Metaphor Explanation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs pt-2 border-t border-emerald-200/40">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <TreePine className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Setara menanam <strong>{treesEquiv} pohon</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-800">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Setara <strong>{lightHours} jam</strong> daya lampu</span>
                </div>
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Catatan Tambahan (Opsional)</label>
              <textarea
                rows={2}
                placeholder="Contoh: Perjalanan dari Kos ke Kampus IPB Dramaga"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={valueInput <= 0}
              className="w-full py-3 px-5 gradient-eco hover:opacity-95 text-white font-extrabold rounded-xl text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>Simpan Catatan Emisi Karbon</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Csv & Excel Import Modal */}
      <CsvImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        userId={user ? user.id : 'user-1'}
        onImportSuccess={handleImportSuccess}
      />

      {/* Floating Interactive Eco Assistant */}
      <EcoGuide />
    </div>
  );
}
