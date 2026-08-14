'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingTour } from '@/components/onboarding-tour';
import {
  Leaf,
  LayoutDashboard,
  PlusCircle,
  Trophy,
  Target,
  History,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Award,
  HelpCircle,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Catat Emisi', href: '/logger', icon: PlusCircle },
    { label: 'Komunitas', href: '/community', icon: Trophy },
    { label: 'Tantangan', href: '/challenges', icon: Target },
    { label: 'Riwayat', href: '/activities', icon: History },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl gradient-eco flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 fill-white/20" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight">Eco<span className="text-emerald-600">Trace</span></span>
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">IPB</span>
                </div>
                <p className="text-[10px] text-slate-500 hidden lg:block">Pelacak Karbon Ramah Keluarga & Kampus</p>
              </div>
            </Link>

            {/* Desktop Navigation Links (Only >= 1024px) */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 shadow-xs'
                        : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right User Area */}
            <div className="flex items-center gap-2">
              {/* Tour / Help Button */}
              <button
                onClick={() => setTourOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Panduan Cara Penggunaan"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Cara Pakai</span>
              </button>

              {user ? (
                <>
                  {/* Points Badge */}
                  <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{user.points || 120} Pts</span>
                  </div>

                  {/* User Menu Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-1.5 p-1 rounded-2xl hover:bg-slate-100 transition-colors focus:outline-hidden"
                    >
                      <img
                        src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500"
                      />
                      <div className="hidden lg:block text-left">
                        <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                        <p className="text-[10px] text-slate-500">{user.department || 'IPB Student'}</p>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                    </button>

                    {dropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                        onMouseLeave={() => setDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{user.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        </div>

                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Profil Pengguna</span>
                        </Link>

                        <Link
                          href="/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-400" />
                          <span>Pengaturan</span>
                        </Link>

                        <div className="border-t border-slate-100 my-1"></div>

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                            router.push('/login');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Keluar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/signup"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white gradient-eco shadow-xs hover:opacity-90 transition-opacity"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <OnboardingTour isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </>
  );
}
