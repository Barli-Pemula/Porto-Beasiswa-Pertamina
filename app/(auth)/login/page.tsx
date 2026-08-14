'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Leaf, Lock, Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email IPB / Mahasiswa tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'barlian@apps.ipb.ac.id',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const success = await login(data.email);
      if (success) {
        router.push('/dashboard');
      } else {
        setErrorMsg('Email atau password tidak terdaftar.');
      }
    } catch (err) {
      setErrorMsg('Gagal masuk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email: string) => {
    setValue('email', email);
    setValue('password', 'password123');
    handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-eco text-white shadow-lg shadow-emerald-500/25 mb-2">
            <Leaf className="w-7 h-7 fill-white/20" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Selamat Datang di <span className="text-emerald-600">EcoTrace</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Platform Pelacak Jejak Karbon Komunitas Mahasiswa Kampus IPB
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <span className="font-semibold">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email Kampus / IPB</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="nama@apps.ipb.ac.id"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                    errors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-emerald-500'
                  } rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:bg-white transition-all`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-medium text-emerald-600 hover:underline">
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                    errors.password ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-emerald-500'
                  } rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:bg-white transition-all`}
                />
              </div>
              {errors.password && <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 gradient-eco hover:opacity-95 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Memuat...</span>
              ) : (
                <>
                  <span>Masuk Aplikasi</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Akses Cepat Demo:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('barlian@apps.ipb.ac.id')}
                className="p-2.5 text-left bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/60 rounded-xl transition-colors text-xs text-emerald-800"
              >
                <div className="font-semibold flex items-center justify-between">
                  <span>Barlian</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-[10px] text-emerald-600">IPB Komputer 2024</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('sarah.dewi@apps.ipb.ac.id')}
                className="p-2.5 text-left bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/60 rounded-xl transition-colors text-xs text-blue-800"
              >
                <div className="font-semibold flex items-center justify-between">
                  <span>Sarah Dewi</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-[10px] text-blue-600">IPB Pertanian 2023</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Belum punya akun?{' '}
          <Link href="/signup" className="font-semibold text-emerald-600 hover:underline">
            Daftar Akun Baru
          </Link>
        </p>
      </div>
    </div>
  );
}
