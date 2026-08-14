'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { calculateDashboardMetrics, getStoredActivities, deleteActivity } from '@/lib/storage';
import { EMISSION_FACTORS } from '@/lib/emission-factors';
import { MockActivity } from '@/lib/mock-data';
import { QuickLoggerBar } from '@/components/quick-logger-bar';
import { EcoGuide } from '@/components/eco-guide';
import {
  TrendingDown,
  TrendingUp,
  PlusCircle,
  Calendar,
  Trash2,
  Award,
  Sparkles,
  ArrowUpRight,
  Leaf,
  TreePine,
  Lightbulb,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(() => calculateDashboardMetrics('user-1'));
  const [activitiesList, setActivitiesList] = useState<MockActivity[]>([]);
  const [viewMode, setViewMode] = useState<'simple' | 'detail'>('simple');

  const refreshDashboardData = () => {
    const userId = user ? user.id : 'user-1';
    setMetrics(calculateDashboardMetrics(userId));
    const all = getStoredActivities();
    setActivitiesList(all.filter((a) => a.userId === userId).slice(0, 10));
  };

  useEffect(() => {
    refreshDashboardData();
  }, [user]);

  const handleDelete = (id: string) => {
    deleteActivity(id);
    refreshDashboardData();
  };

  const isEditable = (timestamp: string) => {
    const actTime = new Date(timestamp).getTime();
    const now = new Date('2026-08-14T23:59:59Z').getTime();
    return now - actTime < 24 * 60 * 60 * 1000;
  };

  const monthCO2 = metrics.monthCO2 || 45.2;
  const treesSaved = (monthCO2 / 2.5).toFixed(1);
  const lightHours = Math.round(monthCO2 * 80);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner & View Mode Selector */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
            <Leaf className="w-3.5 h-3.5 fill-white" />
            <span>EcoTrace • Kampus & Keluarga Ramah Lingkungan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Halo, {user?.name || 'Mahasiswa IPB'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Hasil aksi hijau Anda bulan ini setara dengan menanam <span className="font-bold underline text-white">{treesSaved} pohon kecil</span> 🌳!
          </p>
        </div>

        {/* Simple vs Detail Mode Toggle (Clean Labels) */}
        <div className="z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="bg-emerald-900/40 p-1 rounded-2xl flex text-xs font-bold border border-white/20">
            <button
              onClick={() => setViewMode('simple')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'simple' ? 'bg-white text-emerald-800 shadow-md' : 'text-emerald-100 hover:text-white'
              }`}
            >
              🌱 Sederhana
            </button>
            <button
              onClick={() => setViewMode('detail')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'detail' ? 'bg-white text-emerald-800 shadow-md' : 'text-emerald-100 hover:text-white'
              }`}
            >
              📊 Detail
            </button>
          </div>
        </div>
      </div>

      {/* 1-Tap Quick Logger Widget */}
      <QuickLoggerBar onActivityAdded={refreshDashboardData} />

      {/* Real-world Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md flex-shrink-0">
            🌳
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Setara Menanam Pohon</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{treesSaved} Pohon</p>
            <p className="text-[10px] sm:text-[11px] text-slate-500">Penyerapan emisi bulan ini</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md flex-shrink-0">
            💡
          </div>
          <div>
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Penerangan Lampu LED</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{lightHours} Jam</p>
            <p className="text-[10px] sm:text-[11px] text-slate-500">Hemat daya energi rumah/kos</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-2xl shadow-md flex-shrink-0">
            ⭐
          </div>
          <div>
            <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Level Aksi Hijau Anda</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900">Pahlawan Bumi</p>
            <p className="text-[10px] sm:text-[11px] text-slate-500">Peringkat 5 Komunitas IPB</p>
          </div>
        </div>
      </div>

      {/* Mode Sederhana View */}
      {viewMode === 'simple' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Rangkuman Emisi Karbon Anda
              </h2>
              <p className="text-xs text-slate-500">Ditampilkan dalam format ringkas yang mudah dipahami</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">Hari Ini</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.todayCO2} <span className="text-xs text-slate-500 font-normal">kg</span></p>
              <p className="text-[11px] text-emerald-700 font-semibold">🌱 5% Lebih Hemat dari Kemarin</p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
              <span className="text-[11px] font-bold text-blue-800 uppercase">Minggu Ini</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.weekCO2} <span className="text-xs text-slate-500 font-normal">kg</span></p>
              <p className="text-[11px] text-blue-700 font-semibold">🚌 Didominasi Bus Kampus</p>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1">
              <span className="text-[11px] font-bold text-indigo-800 uppercase">Bulan Ini</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.monthCO2} <span className="text-xs text-slate-500 font-normal">kg</span></p>
              <p className="text-[11px] text-indigo-700 font-semibold">📉 Berkurang 12.4% vs Bulan Lalu</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase">Tahun Ini</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.yearCO2} <span className="text-xs text-slate-500 font-normal">kg</span></p>
              <p className="text-[11px] text-amber-700 font-semibold">🏆 Target Kampus Terpenuhi</p>
            </div>
          </div>
        </div>
      )}

      {/* Mode Detail View */}
      {viewMode === 'detail' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
          {/* Trend Line Chart (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Tren Emisi Karbon (30 Hari Terakhir)</h2>
                <p className="text-xs text-slate-500">Garis hijau menunjukkan emisi Anda vs target benchmark (2.8 kg CO₂e/hari)</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                Target Max: 2.8 kg/hari
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`${value} kg CO₂e`, 'Emisi Harian']}
                  />
                  <ReferenceLine y={2.8} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Target Max', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#16a34a' }}
                    activeDot={{ r: 6, fill: '#15803d' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown Donut Chart (1 Col) */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-6 flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Distribusi Kategori</h2>
              <p className="text-xs text-slate-500">Persentase emisi 30 hari terakhir</p>
            </div>

            <div className="h-56 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {metrics.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} kg`, 'Emisi']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Details Legend */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              {metrics.categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <div className="truncate">
                    <p className="font-semibold text-slate-800">{cat.name}</p>
                    <p className="text-[11px] text-slate-500">{cat.percentage}% ({cat.value} kg)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities List (Mobile-Optimized Clean Table) */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Aktivitas Terakhir</h2>
            <p className="text-xs text-slate-500">10 pencatatan teranyar Anda di platform EcoTrace</p>
          </div>
          <Link
            href="/activities"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {activitiesList.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Belum ada aktivitas yang dicatat</p>
            <p className="text-xs text-slate-500">Mulai catat perjalanan, konsumsi makanan, atau energi Anda hari ini.</p>
            <Link
              href="/logger"
              className="inline-block mt-2 px-4 py-2 gradient-eco text-white text-xs font-bold rounded-xl shadow-sm"
            >
              + Catat Aktivitas Pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs min-w-[500px] sm:min-w-full">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 px-2">Kategori & Aktivitas</th>
                  <th className="pb-3 px-2">Waktu</th>
                  <th className="pb-3 px-2">Nilai Input</th>
                  <th className="pb-3 px-2">Emisi (CO₂e)</th>
                  <th className="pb-3 px-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activitiesList.map((act) => {
                  const factorObj = EMISSION_FACTORS[act.activityType];
                  const editable = isEditable(act.timestamp);
                  return (
                    <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg sm:text-xl flex-shrink-0">{factorObj?.icon || '🌱'}</span>
                          <div>
                            <p className="font-bold text-slate-800 text-xs sm:text-sm">{factorObj?.label || act.activityType}</p>
                            {act.notes && <p className="text-[10px] text-slate-500 italic line-clamp-1">{act.notes}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-slate-600 text-[11px] sm:text-xs whitespace-nowrap">
                        {new Date(act.timestamp).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-2 font-medium text-slate-700 text-[11px] sm:text-xs whitespace-nowrap">
                        {act.value} {act.unit}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 text-[11px] sm:text-xs">
                          +{act.co2Equivalent} kg
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right whitespace-nowrap">
                        {editable ? (
                          <button
                            onClick={() => handleDelete(act.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Aktivitas (< 24 jam)"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Terkunci</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Interactive Eco Assistant */}
      <EcoGuide />
    </div>
  );
}
