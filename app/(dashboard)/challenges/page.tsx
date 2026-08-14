'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_CHALLENGES, MockChallenge } from '@/lib/mock-data';
import { getStoredParticipations, joinChallenge, leaveChallenge } from '@/lib/storage';
import {
  Target,
  Search,
  Filter,
  Flame,
  Award,
  Users,
  Clock,
  CheckCircle2,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function ChallengesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'reduction' | 'adoption' | 'community'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [activeTab, setActiveTab] = useState<'browse' | 'my-active' | 'my-completed'>('browse');

  const [participations, setParticipations] = useState(() => getStoredParticipations());
  const [selectedChallenge, setSelectedChallenge] = useState<MockChallenge | null>(null);

  const userId = user ? user.id : 'user-1';

  const handleJoin = (challengeId: string) => {
    joinChallenge(userId, challengeId);
    setParticipations(getStoredParticipations());
  };

  const handleLeave = (challengeId: string) => {
    leaveChallenge(userId, challengeId);
    setParticipations(getStoredParticipations());
  };

  const getParticipationForUser = (challengeId: string) => {
    return participations.find((p) => p.userId === userId && p.challengeId === challengeId);
  };

  const filteredChallenges = MOCK_CHALLENGES.filter((ch) => {
    const matchesSearch = ch.title.toLowerCase().includes(searchTerm.toLowerCase()) || ch.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || ch.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || ch.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const activeMyChallenges = MOCK_CHALLENGES.filter((ch) => {
    const p = getParticipationForUser(ch.id);
    return p && p.status === 'active';
  });

  const completedMyChallenges = MOCK_CHALLENGES.filter((ch) => {
    const p = getParticipationForUser(ch.id);
    return p && p.status === 'completed';
  });

  const difficultyColors = {
    easy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    hard: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  const difficultyLabels = {
    easy: 'Mudah',
    medium: 'Sedang',
    hard: 'Tantangan Berat',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            Pusat Tantangan Sustainability (Eco-Challenge)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Ikuti tantangan mingguan terukur untuk mengumpulkan poin dan membentuk kebiasaan ramah lingkungan.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1 bg-slate-200/70 rounded-2xl text-[11px] sm:text-xs font-semibold self-start lg:self-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'browse' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jelajah ({MOCK_CHALLENGES.length})
          </button>
          <button
            onClick={() => setActiveTab('my-active')}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'my-active' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tantangan Saya ({activeMyChallenges.length})
          </button>
          <button
            onClick={() => setActiveTab('my-completed')}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'my-completed' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selesai ({completedMyChallenges.length})
          </button>
        </div>
      </div>

      {activeTab === 'browse' && (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama tantangan, kata kunci..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              {/* Difficulty Dropdown */}
              <div className="w-full sm:w-48">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="all">Semua Tingkat</option>
                  <option value="easy">Mudah</option>
                  <option value="medium">Sedang</option>
                  <option value="hard">Tantangan Berat</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs font-semibold pt-1">
              {[
                { id: 'all', label: 'Semua Kategori' },
                { id: 'reduction', label: '🌱 Pengurangan' },
                { id: 'adoption', label: '💡 Adopsi' },
                { id: 'community', label: '🏆 Kolektif' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setCategoryFilter(pill.id as any)}
                  className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    categoryFilter === pill.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Challenge Cards Grid (Tablet uses 1-col like mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredChallenges.map((ch) => {
              const part = getParticipationForUser(ch.id);
              const isJoinedBool = !!part;

              return (
                <div
                  key={ch.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition-all duration-200"
                >
                  {/* Card Header Image */}
                  <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-slate-100">
                    <img src={ch.imageUrl} alt={ch.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    <span className="absolute top-3 left-3 text-xl sm:text-2xl bg-white/90 backdrop-blur-md w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shadow-md">
                      {ch.icon}
                    </span>
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        difficultyColors[ch.difficulty]
                      }`}
                    >
                      {difficultyLabels[ch.difficulty]}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-extrabold text-sm sm:text-base leading-tight drop-shadow-xs">{ch.title}</h3>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ch.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        <span>{ch.participantsCount} Peserta</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-600 font-bold justify-end text-[11px]">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>+{ch.rewardPoints} Pts</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-1">
                      {isJoinedBool ? (
                        <button
                          onClick={() => setSelectedChallenge(ch)}
                          className="w-full py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Diikuti • Lihat Detail</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoin(ch.id)}
                          className="w-full py-2 gradient-eco text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Ikuti Tantangan</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* My Active Challenges Tab */}
      {activeTab === 'my-active' && (
        <div className="space-y-6">
          {activeMyChallenges.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-100 shadow-sm space-y-3">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 mx-auto" />
              <p className="text-sm sm:text-base font-bold text-slate-800">Anda belum mengikuti tantangan apapun</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Buka tab Jelajah di atas dan pilih tantangan pertama Anda untuk mulai mengumpulkan poin reward!
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="mt-2 px-4 py-2 gradient-eco text-white text-xs font-semibold rounded-xl"
              >
                Jelajah Tantangan Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              {activeMyChallenges.map((ch) => {
                const p = getParticipationForUser(ch.id);
                const progress = p ? p.progress : 25;
                return (
                  <div key={ch.id} className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xl shadow-slate-200/50 space-y-3.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl sm:text-3xl">{ch.icon}</span>
                        <div>
                          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{ch.title}</h3>
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Aktif Berkembang
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        +{ch.rewardPoints} Pts
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{ch.description}</p>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>Progres Tantangan</span>
                        <span className="text-emerald-600">{progress}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedChallenge(ch)}
                        className="text-xs font-semibold text-emerald-600 hover:underline"
                      >
                        Lihat Detail
                      </button>
                      <button
                        onClick={() => handleLeave(ch.id)}
                        className="text-xs font-medium text-rose-500 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Batalkan
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* My Completed Challenges Tab */}
      {activeTab === 'my-completed' && (
        <div className="space-y-6">
          {completedMyChallenges.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-100 shadow-sm space-y-3">
              <Award className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 mx-auto" />
              <p className="text-sm sm:text-base font-bold text-slate-800">Belum ada tantangan yang diselesaikan</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Selesaikan tantangan aktif Anda untuk membuka lencana prestasi dan poin tambahan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              {completedMyChallenges.map((ch) => (
                <div key={ch.id} className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl sm:text-3xl">{ch.icon}</span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{ch.title}</h3>
                        <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          Selesai & Diklaim 🎉
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      +{ch.rewardPoints} Pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{ch.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="relative h-44 sm:h-48 w-full bg-slate-100">
              <img src={selectedChallenge.imageUrl} alt={selectedChallenge.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              <button
                onClick={() => setSelectedChallenge(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-xl sm:text-2xl">{selectedChallenge.icon}</span>
                <h3 className="text-lg sm:text-xl font-extrabold">{selectedChallenge.title}</h3>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold uppercase text-slate-400">Deskripsi & Aturan Tantangan</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedChallenge.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <p className="text-slate-400 text-[11px]">Target Pengurangan</p>
                  <p className="font-bold text-slate-800">{selectedChallenge.targetReduction}% Emisi CO₂</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Hadiah Poin</p>
                  <p className="font-bold text-amber-600">+{selectedChallenge.rewardPoints} Pts</p>
                </div>
              </div>

              {getParticipationForUser(selectedChallenge.id) && (
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-emerald-900">
                    <span>Progres Anda Saat Ini</span>
                    <span>{getParticipationForUser(selectedChallenge.id)?.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-emerald-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${getParticipationForUser(selectedChallenge.id)?.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                {getParticipationForUser(selectedChallenge.id) ? (
                  <button
                    onClick={() => {
                      handleLeave(selectedChallenge.id);
                      setSelectedChallenge(null);
                    }}
                    className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Tinggalkan Tantangan
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleJoin(selectedChallenge.id);
                      setSelectedChallenge(null);
                    }}
                    className="flex-1 py-2.5 gradient-eco text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    Ikuti Tantangan Ini
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
