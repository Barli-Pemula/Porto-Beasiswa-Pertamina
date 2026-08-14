'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Trophy, Target, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  // Hide on auth pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const items = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Catat', href: '/logger', icon: PlusCircle },
    { label: 'Komunitas', href: '/community', icon: Trophy },
    { label: 'Tantangan', href: '/challenges', icon: Target },
    { label: 'Profil', href: '/profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
                isActive ? 'text-emerald-600 font-semibold scale-105' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
