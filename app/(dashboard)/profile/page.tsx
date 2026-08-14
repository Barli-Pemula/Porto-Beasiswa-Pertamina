'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getStoredActivities, getStoredParticipations } from '@/lib/storage';
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  Award,
  Shield,
  CheckCircle2,
  Edit2,
  Save,
  Sparkles,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || 'Barlian Athallah Dyu');
  const [cohortInput, setCohortInput] = useState(user?.cohort || '2026');
  const [deptInput, setDeptInput] = useState(user?.department || 'Ilmu Komputer');

  const userActivities = getStoredActivities().filter((a) => a.userId === user?.id);
  const userParticipations = getStoredParticipations().filter((p) => p.userId === user?.id);

  const totalCO2 = userActivities.reduce((sum, a) => sum + a.co2Equivalent, 0);

  const handleSave = () => {
    updateProfile({
      name: nameInput,
      cohort: cohortInput,
      department: deptInput,
    });
    setIsEditing(false);
  };

  const badges = [
    { title: 'Pencatat Karbon Perdana', icon: '🌱', desc: 'Mencatat aktivitas emisi pertama kali', unlocked: true },
    { title: 'Pejuang Angkutan Umum', icon: '🚌', desc: 'Melakukan 10 perjalanan bus/KRL', unlocked: true },
    { title: 'Hemat Energi Kos', icon: '💡', desc: 'Mengurangi pemakaian AC 20%', unlocked: true },
    { title: 'Diet Nabati Hero', icon: '🥗', desc: 'Menyelesaikan tantangan Meatless Tuesday', unlocked: true },
    { title: 'Top 5 Kampus Emitter', icon: '🏆', desc: 'Masuk 5 besar emisi terendah minggu ini', unlocked: false },
    { title: 'Juara Kampus Carbon Cup', icon: '🥇', desc: 'Memenangkan kompetisi antar departemen', unlocked: false },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        {/* Sleek Compact Header Banner */}
        <div className="h-20 sm:h-24 gradient-eco px-6 py-4 flex items-center justify-between">
          <span className="text-[11px] font-bold bg-white/20 text-white backdrop-blur-md px-3 py-1 rounded-full">
            Profil Mahasiswa Kampus IPB
          </span>
        </div>

        {/* User Content Area */}
        <div className="p-6 sm:p-8 pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-10 sm:-mt-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              {/* Avatar */}
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={user?.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-white flex-shrink-0"
              />
              {/* User Details (Clear, No Overlap) */}
              <div className="space-y-1 pt-2 sm:pt-0">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {user?.name || 'Barlian Athallah Dyu'}
                </h1>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    IPB {user?.department || 'Ilmu Komputer'}
                  </span>
                  <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    Angkatan {user?.cohort || '2026'}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile Action */}
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="px-4 py-2.5 gradient-eco text-white text-xs font-semibold rounded-xl shadow-md hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer self-stretch sm:self-auto justify-center"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profil</span>
                </>
              )}
            </button>
          </div>

          {/* Editable Form Drawer */}
          {isEditing && (
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
              <h3 className="text-xs font-bold text-slate-800 uppercase">Ubah Data Diri</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Nama Lengkap</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Angkatan</label>
                  <select
                    value={cohortInput}
                    onChange={(e) => setCohortInput(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021 & Sebelum</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Departemen</label>
                  <input
                    type="text"
                    value={deptInput}
                    onChange={(e) => setDeptInput(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center space-y-1">
          <p className="text-xs font-medium text-slate-500">Total Aktivitas</p>
          <p className="text-2xl font-black text-slate-900">{userActivities.length}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center space-y-1">
          <p className="text-xs font-medium text-slate-500">Total Emisi CO₂e</p>
          <p className="text-2xl font-black text-emerald-600">{totalCO2.toFixed(1)} kg</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center space-y-1">
          <p className="text-xs font-medium text-slate-500">Tantangan Diikuti</p>
          <p className="text-2xl font-black text-blue-600">{userParticipations.length}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-center space-y-1">
          <p className="text-xs font-medium text-slate-500">Poin Peringkat</p>
          <p className="text-2xl font-black text-amber-600">{user?.points || 340} Pts</p>
        </div>
      </div>

      {/* Badges & Achievements Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Lencana Prestasi Hijau (Badges)
          </h2>
          <p className="text-xs text-slate-500">Pencapaian dan komitmen gaya hidup rendah karbon Anda</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                b.unlocked
                  ? 'bg-slate-50/80 border-slate-200 shadow-xs'
                  : 'bg-slate-50/30 border-slate-100 opacity-50 grayscale'
              }`}
            >
              <span className="text-3xl p-2 bg-white rounded-2xl shadow-xs">{b.icon}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900">{b.title}</h3>
                  {b.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
