'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getStoredActivities, deleteActivity } from '@/lib/storage';
import { EMISSION_FACTORS } from '@/lib/emission-factors';
import { MockActivity } from '@/lib/mock-data';
import { exportActivitiesToExcel, exportActivitiesToCSV } from '@/lib/excel-utils';
import { CsvImportModal } from '@/components/csv-import-modal';
import {
  History,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Calendar,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function ActivityHistoryPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importNotification, setImportNotification] = useState<{ count: number; totalCO2: number } | null>(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const [activities, setActivities] = useState(() => getStoredActivities());

  const userId = user ? user.id : 'user-1';
  const userActivities = activities.filter((a) => a.userId === userId);

  const filteredList = userActivities.filter((act) => {
    const factorObj = EMISSION_FACTORS[act.activityType];
    const label = factorObj?.label || act.activityType;
    const notes = act.notes || '';

    const matchesSearch =
      label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notes.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || act.category === categoryFilter;

    let matchesPeriod = true;
    const now = new Date('2026-08-14T23:59:59Z').getTime();
    const actTime = new Date(act.timestamp).getTime();
    const daysDiff = (now - actTime) / (1000 * 60 * 60 * 24);

    if (periodFilter === '7days') matchesPeriod = daysDiff <= 7;
    else if (periodFilter === '30days') matchesPeriod = daysDiff <= 30;
    else if (periodFilter === '90days') matchesPeriod = daysDiff <= 90;

    return matchesSearch && matchesCategory && matchesPeriod;
  });

  const handleDelete = (id: string) => {
    deleteActivity(id);
    setActivities(getStoredActivities());
  };

  const handleExportExcel = () => {
    exportActivitiesToExcel(filteredList);
    setExportDropdownOpen(false);
  };

  const handleExportCSV = () => {
    exportActivitiesToCSV(filteredList);
    setExportDropdownOpen(false);
  };

  const handleImportSuccess = (count: number, totalCO2: number) => {
    setActivities(getStoredActivities());
    setImportNotification({ count, totalCO2 });
    setTimeout(() => {
      setImportNotification(null);
    }, 5000);
  };

  const totalCO2Filtered = filteredList.reduce((acc, a) => acc + a.co2Equivalent, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            Riwayat Aktivitas Emisi Karbon
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar lengkap seluruh aktivitas yang pernah Anda catat di platform EcoTrace.
          </p>
        </div>

        {/* Action Buttons: Import & Export */}
        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          {/* Import Button */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-2xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Impor Data (Excel / CSV)</span>
          </button>

          {/* Export Dropdown Group */}
          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-2xl flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Tabel</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {exportDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setExportDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Format Spreadsheet
                  </div>
                  <button
                    onClick={handleExportExcel}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-semibold">Excel (.xlsx)</p>
                      <p className="text-[10px] text-slate-400">Tabel rapi & formula siap pakai (Rekomendasi)</p>
                    </div>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-semibold">CSV (.csv)</p>
                      <p className="text-[10px] text-slate-400">Kompatibel Excel dengan UTF-8 BOM</p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification after Import */}
      {importNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-xs sm:text-sm">Impor Aktivitas Berhasil Disimpan!</p>
              <p className="text-[11px] sm:text-xs text-emerald-700">
                Berhasil menambahkan <strong>{importNotification.count}</strong> aktivitas dengan total estimasi emisi <strong>+{importNotification.totalCO2.toFixed(2)} kg CO₂e</strong> ke akun Anda.
              </p>
            </div>
          </div>
          <button
            onClick={() => setImportNotification(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Filter & Search Controls */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari aktivitas, catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Category Selector */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value="all">Semua Kategori</option>
              <option value="transport">Transportasi 🚗</option>
              <option value="food">Makanan 🍽️</option>
              <option value="energy">Energi 🔌</option>
              <option value="waste">Sampah ♻️</option>
            </select>
          </div>

          {/* Period Selector */}
          <div>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value="all">Semua Waktu</option>
              <option value="7days">7 Hari Terakhir</option>
              <option value="30days">30 Hari Terakhir</option>
              <option value="90days">90 Hari Terakhir</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Menampilkan <strong className="text-slate-800">{filteredList.length}</strong> aktivitas</span>
          <span>Emisi: <strong className="text-emerald-700 font-bold">{totalCO2Filtered.toFixed(2)} kg CO₂e</strong></span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
        {filteredList.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs sm:text-sm font-bold text-slate-800">Tidak ada data aktivitas yang sesuai</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Coba ubah kata kunci pencarian, atau impor catatan aktivitas historis Anda dari file Excel / CSV.
            </p>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer mt-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Impor Data Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs min-w-[500px] sm:min-w-full">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px] sm:text-[11px]">
                  <th className="pb-3 px-2">Waktu Pencatatan</th>
                  <th className="pb-3 px-2">Kategori</th>
                  <th className="pb-3 px-2">Jenis Aktivitas</th>
                  <th className="pb-3 px-2">Jumlah Unit</th>
                  <th className="pb-3 px-2">Emisi Karbon</th>
                  <th className="pb-3 px-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((act) => {
                  const factorObj = EMISSION_FACTORS[act.activityType];
                  return (
                    <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-2 text-slate-600 font-medium text-[11px] sm:text-xs whitespace-nowrap">
                        {new Date(act.timestamp).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[10px] sm:text-xs">
                          {act.category}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base flex-shrink-0">{factorObj?.icon || '🌱'}</span>
                          <div>
                            <p className="font-bold text-slate-800 text-xs">{factorObj?.label || act.activityType}</p>
                            {act.notes && <p className="text-[10px] text-slate-400 italic line-clamp-1">{act.notes}</p>}
                          </div>
                        </div>
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
                        <button
                          onClick={() => handleDelete(act.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CSV & Excel Import Modal */}
      <CsvImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        userId={userId}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}
