'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getLeaderboardData, getStoredParticipations, joinChallenge } from '@/lib/storage';
import { MOCK_CHALLENGES } from '@/lib/mock-data';
import {
  Trophy,
  Award,
  Users,
  TrendingDown,
  Activity,
  Flame,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

export default function CommunityDashboardPage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'lowest' | 'improved' | 'engaged'>('lowest');
  const [participations, setParticipations] = useState(() => getStoredParticipations());

  const leaderboardEntries = getLeaderboardData(activeTab);

  const stats = [
    { label: 'Total Anggota Kampus', value: '42 Mahasiswa', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Rata-rata Emisi Mingguan', value: '18.4 kg CO₂e', icon: TrendingDown, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Total Emisi Berhasil Ditekan', value: '125.4 Ton', icon: Trophy, color: 'text-amber-600 bg-amber-50' },
    { label: 'Tantangan Aktif Minggu Ini', value: `${MOCK_CHALLENGES.length} Tantangan`, icon: Flame, color: 'text-rose-600 bg-rose-50' },
  ];

  const trendingChallenges = MOCK_CHALLENGES.slice(0, 3);

  const handleJoin = (challengeId: string) => {
    const userId = user ? user.id : 'user-1';
    joinChallenge(userId, challengeId);
    setParticipations(getStoredParticipations());
  };

  const isJoined = (challengeId: string) => {
    const userId = user ? user.id : 'user-1';
    return participations.some((p) => p.userId === userId && p.challengeId === challengeId);
  };

  const toggleAnonymous = () => {
    if (user) {
      updateProfile({ isAnonymous: !user.isAnonymous });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Komunitas Dampak Karbon
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Visualisasi emisi kolektif dan papan peringkat mahasiswa IPB University.
          </p>
        </div>

        {/* Anonymous Privacy Toggle */}
        <button
          onClick={toggleAnonymous}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-[11px] sm:text-xs font-semibold border transition-all cursor-pointer ${
            user?.isAnonymous
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {user?.isAnonymous ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-amber-600" />
              <span>Status: Anonim di Papan Skor</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status: Tampilkan Nama Publik</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Community Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center gap-3.5">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500">{item.label}</p>
                <p className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              Papan Peringkat Komunitas IPB
            </h2>
            <p className="text-xs text-slate-500">Mendorong aksi nyata lewat kompetisi positif berbasis norma sosial</p>
          </div>

          {/* 3 Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl text-[11px] sm:text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('lowest')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'lowest' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Emisi Terendah
            </button>
            <button
              onClick={() => setActiveTab('improved')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'improved' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paling Meningkat
            </button>
            <button
              onClick={() => setActiveTab('engaged')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'engaged' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Teraktif
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-left text-xs min-w-[500px] sm:min-w-full">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3 px-2 w-14">Peringkat</th>
                <th className="pb-3 px-2">Mahasiswa Kampus</th>
                <th className="pb-3 px-2">Departemen & Angkatan</th>
                <th className="pb-3 px-2 text-right">
                  {activeTab === 'lowest' ? 'Emisi Minggu Ini' : activeTab === 'improved' ? 'Pengurangan (%)' : 'Jumlah Catatan'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboardEntries.slice(0, 15).map((entry) => {
                const isCurrentUser = user && entry.user.id === user.id;
                return (
                  <tr
                    key={entry.user.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isCurrentUser ? 'bg-emerald-50/60 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-2">
                      {entry.rank === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-black flex items-center justify-center text-[11px] shadow-xs border border-amber-300">
                          🥇 1
                        </span>
                      ) : entry.rank === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black flex items-center justify-center text-[11px] border border-slate-300">
                          🥈 2
                        </span>
                      ) : entry.rank === 3 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-700/10 text-amber-800 font-black flex items-center justify-center text-[11px] border border-amber-700/30">
                          🥉 3
                        </span>
                      ) : (
                        <span className="text-slate-500 font-bold px-1 text-[11px]">#{entry.rank}</span>
                      )}
                    </td>

                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={entry.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                          alt={entry.displayName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1 text-xs">
                            <span>{entry.displayName}</span>
                            {isCurrentUser && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded-sm font-semibold">
                                Anda
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-2 text-slate-600 text-[11px] whitespace-nowrap">
                      {entry.user.department || 'IPB Student'} • {entry.user.cohort || '2026'}
                    </td>

                    <td className="py-3 px-2 text-right font-bold text-slate-900 text-[11px] whitespace-nowrap">
                      {activeTab === 'lowest' ? (
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full border border-slate-200">
                          {entry.emission} kg CO₂e
                        </span>
                      ) : activeTab === 'improved' ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                          -{entry.changePercent}%
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                          {entry.activityCount} Log
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Community vs Personal & Trending Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Category Comparison (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Perbandingan Distribusi Kategori Emisi</h2>
            <p className="text-xs text-slate-500">Perbandingan rata-rata emisi komunitas IPB vs Aktivitas Pribadi Anda</p>
          </div>

          <div className="space-y-3.5">
            {[
              { category: 'Transportasi', community: 45, personal: 38, color: 'bg-blue-500' },
              { category: 'Makanan', community: 28, personal: 32, color: 'bg-emerald-500' },
              { category: 'Energi', community: 18, personal: 20, color: 'bg-amber-500' },
              { category: 'Sampah & Limbah', community: 9, personal: 10, color: 'bg-teal-500' },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{cat.category}</span>
                  <span className="text-[11px]">Komunitas: {cat.community}% | Anda: {cat.personal}%</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} opacity-80`} style={{ width: `${cat.community}%` }} />
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color}`} style={{ width: `${cat.personal}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400 opacity-80" />
              <span>Rata-Rata Komunitas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 font-bold" />
              <span>Aktivitas Anda</span>
            </div>
          </div>
        </div>

        {/* Trending Challenges Widget (1 Col) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                Tantangan Populer
              </h2>
              <Link href="/challenges" className="text-xs font-semibold text-emerald-600 hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-2.5">
              {trendingChallenges.map((ch) => {
                const joined = isJoined(ch.id);
                return (
                  <div key={ch.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-base">{ch.icon}</span>
                        <h3 className="text-xs font-bold text-slate-900 leading-tight mt-0.5">{ch.title}</h3>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{ch.description}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex-shrink-0">
                        +{ch.rewardPoints} Pts
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-500">{ch.participantsCount} Peserta</span>
                      {joined ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Diikuti
                        </span>
                      ) : (
                        <button
                          onClick={() => handleJoin(ch.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Ikuti Tantangan
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
