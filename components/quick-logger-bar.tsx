'use client';

import React, { useState } from 'react';
import { addActivity } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { EMISSION_FACTORS, calculateCO2 } from '@/lib/emission-factors';
import { Sparkles, CheckCircle2, Zap } from 'lucide-react';

interface QuickLoggerBarProps {
  onActivityAdded?: () => void;
}

export function QuickLoggerBar({ onActivityAdded }: QuickLoggerBarProps) {
  const { user } = useAuth();
  const [lastLogged, setLastLogged] = useState<string | null>(null);

  const presets = [
    {
      id: 'quick-1',
      title: 'Naik Bus Kampus',
      icon: '🚌',
      typeId: 'transport-bus',
      category: 'transport' as const,
      value: 8,
      unit: 'km',
      desc: '8 km',
    },
    {
      id: 'quick-2',
      title: 'Jalan / Sepeda',
      icon: '🚶',
      typeId: 'transport-bike',
      category: 'transport' as const,
      value: 2,
      unit: 'km',
      desc: 'Bebas Emisi 🎉',
    },
    {
      id: 'quick-3',
      title: 'Makan Sayur',
      icon: '🥗',
      typeId: 'food-veg',
      category: 'food' as const,
      value: 1,
      unit: 'porsi',
      desc: '1 Porsi',
    },
    {
      id: 'quick-4',
      title: 'Lampu LED Kos',
      icon: '💡',
      typeId: 'energy-led',
      category: 'energy' as const,
      value: 1,
      unit: 'sesi',
      desc: '1 Sesi Malam',
    },
  ];

  const handleQuickLog = (preset: (typeof presets)[0]) => {
    const factorObj = EMISSION_FACTORS[preset.typeId];
    const co2 = factorObj ? calculateCO2(preset.typeId, preset.value) : 0.5;

    addActivity({
      userId: user ? user.id : 'user-1',
      activityType: preset.typeId,
      category: preset.category,
      value: preset.value,
      unit: preset.unit,
      co2Equivalent: co2,
      timestamp: new Date().toISOString(),
      notes: `Catatan Cepat 1-Klik: ${preset.title}`,
    });

    setLastLogged(`${preset.title} (+${co2} kg CO₂e)`);
    if (onActivityAdded) onActivityAdded();

    setTimeout(() => setLastLogged(null), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Catat Cepat 1-Klik (Quick Log)</h3>
            <p className="text-[11px] text-slate-500">Tekan salah satu tombol di bawah untuk mencatat harian instan</p>
          </div>
        </div>

        {lastLogged && (
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tersimpan: {lastLogged}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => handleQuickLog(p)}
            className="p-3 bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-300 rounded-2xl transition-all cursor-pointer text-left flex items-center gap-3 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{p.icon}</span>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-emerald-800">{p.title}</p>
              <p className="text-[10px] text-slate-500">{p.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
