'use client';

import React, { useState } from 'react';
import { Leaf, PlusCircle, Trophy, Target, Sparkles, X, ChevronRight, Check } from 'lucide-react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Selamat Datang di EcoTrace! 👋',
      subtitle: 'Aplikasi Pelacak Jejak Karbon yang Mudah & Seru untuk Semua Orang',
      icon: Leaf,
      color: 'bg-emerald-500 text-white',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            Setiap aktivitas harian kita—seperti naik kendaraan, makan, atau menyalakan AC—menghasilkan <strong className="text-slate-800">emisi karbon (CO₂)</strong>.
          </p>
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 font-medium flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>EcoTrace membantu Anda mencatat dan mengurangi karbon secara otomatis dengan cara yang sangat sederhana!</span>
          </div>
        </div>
      ),
    },
    {
      title: '1. Catat Aktivitas Harian 1-Klik 🚗⚡',
      subtitle: 'Cukup 30 detik sehari tanpa perlu ribet',
      icon: PlusCircle,
      color: 'bg-blue-500 text-white',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            Pilih ikon aktivitas Anda (seperti <span className="font-semibold text-slate-800">🚌 Naik Bus</span>, <span className="font-semibold text-slate-800">🥗 Makan Sayur</span>, atau <span className="font-semibold text-slate-800">💡 Matikan AC</span>).
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold pt-1">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
              <span className="text-lg">🛵</span>
              <span>Jarak Motor (km)</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
              <span className="text-lg">🥩</span>
              <span>Porsi Makanan</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic">Sistem akan menghitung jejak karbon Anda secara otomatis!</p>
        </div>
      ),
    },
    {
      title: '2. Kumpulkan Poin & Lencana Hijau 🏆⭐',
      subtitle: 'Tingkatkan peringkat Anda di kampus',
      icon: Trophy,
      color: 'bg-amber-500 text-white',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            Setiap kali Anda menekan emisi karbon atau mengikuti <strong className="text-slate-800">Tantangan Mingguan</strong>, Anda akan mendapatkan poin dan lencana bintang!
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-amber-800 font-bold">
            <span>Level 1: Pemula Hijau 🌱</span>
            <span>+50 Pts Poin</span>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${currentStep.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{currentStep.title}</h3>
              <p className="text-xs text-slate-500">{currentStep.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Body */}
        <div className="py-2">{currentStep.content}</div>

        {/* Step Indicator dots & Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === i ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-3.5 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Kembali
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 gradient-eco text-white font-semibold rounded-xl text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1 hover:opacity-95 transition-opacity cursor-pointer"
              >
                <span>Lanjut</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 gradient-eco text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1 hover:opacity-95 transition-opacity cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mulai Gunakan!</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
