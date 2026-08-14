'use client';

import React, { useState } from 'react';
import { Leaf, Sparkles, HelpCircle, X, Lightbulb, TreePine, Car } from 'lucide-react';

export function EcoGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [co2Input, setCo2Input] = useState<number>(5);

  const treesEquivalent = (co2Input / 2.5).toFixed(1);
  const lightHours = Math.round(co2Input * 80);
  const carKm = Math.round(co2Input / 0.192);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 gradient-eco text-white font-bold rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-105 transition-all cursor-pointer animate-bounce"
        >
          <span className="text-xl">🌿</span>
          <span className="text-xs">Tanya Si Eco (Bantuan)</span>
        </button>
      )}

      {/* Popover Card */}
      {isOpen && (
        <div className="bg-white rounded-3xl p-5 shadow-2xl border border-emerald-100 max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-150">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
                🐱🌱
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-xs">Si Eco • Asisten Ramah Lingkungan</h3>
                <p className="text-[10px] text-slate-500">Penerjemah Angka Karbon ke Kehidupan Sehari-hari</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Converter Tool */}
          <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2 text-xs">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulasi: Apa Arti Angka Karbon?</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={co2Input}
                onChange={(e) => setCo2Input(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-20 p-2 bg-white border border-slate-200 rounded-xl font-bold text-center text-xs"
              />
              <span className="font-semibold text-slate-600">kg CO₂e setara dengan:</span>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                <TreePine className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>🌳 Menanam {treesEquivalent} pohon kecil selama seminggu</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>💡 Menyalakan lampu LED selama {lightHours} jam</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-blue-800 bg-blue-50 p-2 rounded-xl border border-blue-200">
                <Car className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>🚗 Menyetir mobil sejauh {carKm} km</span>
              </div>
            </div>
          </div>

          {/* Quick Advice */}
          <div className="space-y-1 text-[11px] text-slate-600">
            <p className="font-bold text-slate-800">💡 Tips Mudah Hari Ini:</p>
            <p>Pilih berjalan kaki atau naik sepeda untuk jarak di bawah 2 km. Selain sehat untuk tubuh, emisi yang dihasilkan adalah **0 kg**! 🎉</p>
          </div>
        </div>
      )}
    </div>
  );
}
