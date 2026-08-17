'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Download,
  Info,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  parseActivitiesSpreadsheet,
  downloadTemplateExcel,
  downloadTemplateCSV,
  ParsedImportResult,
  ParsedActivityRow,
} from '@/lib/excel-utils';
import { addMultipleActivities } from '@/lib/storage';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onImportSuccess: (count: number, totalCO2: number) => void;
}

export function CsvImportModal({ isOpen, onClose, userId, onImportSuccess }: CsvImportModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedImportResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    const validExts = ['.xlsx', '.xls', '.csv'];
    const hasValidExt = validExts.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setErrorMessage('Format file tidak didukung. Harap pilih file Microsoft Excel (.xlsx, .xls) atau CSV (.csv).');
      setSelectedFile(null);
      setParsedData(null);
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await parseActivitiesSpreadsheet(file);
      setParsedData(result);
    } catch (err: any) {
      console.error('Spreadsheet parse error:', err);
      setErrorMessage(err.message || 'Gagal membaca isi file spreadsheet. Pastikan format kolom sesuai dengan template.');
      setParsedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (!parsedData || parsedData.validCount === 0) return;

    setIsSaving(true);
    try {
      const validRows = parsedData.rows.filter((r) => r.isValid);
      const activitiesToSave = validRows.map((r) => ({
        userId,
        activityType: r.activityType,
        category: r.category,
        value: r.value,
        unit: r.unit,
        co2Equivalent: r.co2Equivalent,
        timestamp: r.date,
        notes: r.notes ? r.notes.trim() : undefined,
      }));

      addMultipleActivities(activitiesToSave);
      onImportSuccess(validRows.length, parsedData.totalCO2);
      handleResetAndClose();
    } catch (err: any) {
      console.error('Import save error:', err);
      setErrorMessage('Terjadi kesalahan saat menyimpan data ke penyimpanan lokal.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetAndClose = () => {
    setSelectedFile(null);
    setParsedData(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Impor Data Aktivitas (Excel & CSV)
              </h2>
              <p className="text-xs text-slate-500">
                Unggah file catatan emisi historis secara massal dengan format tabel rapi
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Template Download Helpers */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50/60 border border-emerald-200/70 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Format File yang Sesuai</span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-800">
                Gunakan template spreadsheet kami agar seluruh kolom, formula, dan jenis aktivitas terbaca akurat.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={downloadTemplateExcel}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Template Excel (.xlsx)</span>
              </button>
              <button
                onClick={downloadTemplateCSV}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Template CSV (.csv)</span>
              </button>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                : 'border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">
                  {selectedFile ? selectedFile.name : 'Pilih atau Seret File Excel / CSV ke Sini'}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Mendukung file Microsoft Excel (.xlsx, .xls) dan CSV (.csv) hingga 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Gagal Membaca File</p>
                <p className="text-[11px] text-rose-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="text-center py-6 space-y-2">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-600 font-medium">Menganalisis dan memvalidasi kolom spreadsheet...</p>
            </div>
          )}

          {/* Preview Table & Metrics */}
          {parsedData && !isLoading && (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <p className="text-[11px] text-slate-500 font-medium">Total Baris Ditemukan</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">
                    {parsedData.rows.length} Baris
                  </p>
                </div>
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
                  <p className="text-[11px] text-emerald-700 font-medium">Baris Valid Siap Diimpor</p>
                  <p className="text-base font-bold text-emerald-800 mt-0.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {parsedData.validCount} Baris
                  </p>
                </div>
                <div className="p-3.5 bg-teal-50/80 border border-teal-200 rounded-2xl">
                  <p className="text-[11px] text-teal-700 font-medium">Estimasi Emisi Karbon Batch</p>
                  <p className="text-base font-bold text-teal-900 mt-0.5">
                    +{parsedData.totalCO2.toFixed(2)} kg CO₂e
                  </p>
                </div>
              </div>

              {/* Table Preview */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-xs">
                    Pratinjau Data Tabel ({parsedData.rows.length} Baris)
                  </span>
                  {parsedData.invalidCount > 0 && (
                    <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      ⚠️ {parsedData.invalidCount} baris memiliki kesalahan & akan dilewati
                    </span>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">Tanggal / Waktu</th>
                        <th className="py-2 px-3">Kategori</th>
                        <th className="py-2 px-3">Jenis Aktivitas</th>
                        <th className="py-2 px-3">Jumlah</th>
                        <th className="py-2 px-3">Emisi (CO₂e)</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedData.rows.map((row) => (
                        <tr
                          key={row.index}
                          className={
                            row.isValid
                              ? 'hover:bg-slate-50/60'
                              : 'bg-rose-50/40 hover:bg-rose-50/70'
                          }
                        >
                          <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{row.index}</td>
                          <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                            {new Date(row.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-2.5 px-3 capitalize text-slate-600 font-medium">
                            {row.categoryLabel}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-slate-800">{row.activityLabel}</span>
                            {row.notes && <p className="text-[10px] text-slate-400 italic line-clamp-1">{row.notes}</p>}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                            {row.value} {row.unit}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {row.isValid ? (
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                                +{row.co2Equivalent} kg
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {row.isValid ? (
                              row.warning ? (
                                <span
                                  className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[10px] font-medium"
                                  title={row.warning}
                                >
                                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                                  Disesuaikan
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-semibold">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Siap
                                </span>
                              )
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 text-[10px] font-medium"
                                title={row.error}
                              >
                                <AlertCircle className="w-3 h-3 text-rose-600" />
                                {row.error || 'Invalid'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleResetAndClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>

          {parsedData && parsedData.validCount > 0 && (
            <button
              onClick={handleConfirmImport}
              disabled={isSaving}
              className="px-5 py-2.5 gradient-eco text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan ke Riwayat...</span>
                </>
              ) : (
                <>
                  <span>Simpan & Impor {parsedData.validCount} Data Aktivitas</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
