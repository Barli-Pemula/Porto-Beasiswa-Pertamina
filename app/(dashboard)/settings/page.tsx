'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getStoredActivities } from '@/lib/storage';
import {
  Settings,
  Bell,
  Globe,
  Download,
  LogOut,
  CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [weeklyBrief, setWeeklyBrief] = useState(true);
  const [distUnit, setDistUnit] = useState<'km' | 'mi'>('km');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleExportData = () => {
    const activities = getStoredActivities();
    const jsonStr = JSON.stringify(activities, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecotrace_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
          Pengaturan Aplikasi EcoTrace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Kelola preferensi notifikasi, unit pengukuran emisi, dan privasi akun Anda.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pengaturan Anda berhasil diperbarui!</span>
        </div>
      )}

      {/* 1. Preferensi Notifikasi */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Notifikasi & Pengingat</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">Atur pesan pengingat pencatatan harian dan progres tantangan</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <div>
              <p className="font-semibold text-slate-800">Notifikasi Email</p>
              <p className="text-[11px] text-slate-500">Kirim laporan rangkuman mingguan ke email IPB Anda</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={(e) => setEmailNotif(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <div>
              <p className="font-semibold text-slate-800">Pengingat Catat Emisi Harian</p>
              <p className="text-[11px] text-slate-500">Notifikasi jam 19.00 WIB jika Anda belum mencatat aktivitas hari ini</p>
            </div>
            <input
              type="checkbox"
              checked={pushNotif}
              onChange={(e) => setPushNotif(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-1.5">
            <div>
              <p className="font-semibold text-slate-800">Rangkuman Dampak Komunitas (Weekly Briefing)</p>
              <p className="text-[11px] text-slate-500">Informasi posisi peringkat Anda di papan skor kampus</p>
            </div>
            <input
              type="checkbox"
              checked={weeklyBrief}
              onChange={(e) => setWeeklyBrief(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 2. Preferensi Unit Pengukuran */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Unit Satuan Pengukuran</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">Pilih format unit yang digunakan di form logger</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Satuan Jarak Transportasi</label>
            <select
              value={distUnit}
              onChange={(e) => setDistUnit(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs"
            >
              <option value="km">Kilometer (km)</option>
              <option value="mi">Miles (mi)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Satuan Berat Sampah / Makanan</label>
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-xs"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="lb">Pounds (lb)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Export Data & Session Actions */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Ekspor Data & Akun</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">Unduh riwayat aktivitas atau keluar dari sesi aplikasi</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleExportData}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Ekspor Semua Data (JSON)</span>
          </button>

          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Dari Aplikasi</span>
          </button>
        </div>
      </div>

      <div className="pt-1 text-center">
        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 gradient-eco text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 hover:opacity-95 transition-opacity cursor-pointer"
        >
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}
