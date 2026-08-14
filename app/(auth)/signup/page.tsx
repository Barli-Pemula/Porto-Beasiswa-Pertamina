'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Leaf, User, Mail, Lock, GraduationCap, Building2, Check, ArrowRight } from 'lucide-react';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    cohort: z.string().min(1, 'Pilih angkatan'),
    department: z.string().min(1, 'Pilih jurusan / departemen'),
    terms: z.boolean().refine((val) => val === true, 'Anda harus menyetujui Syarat & Ketentuan'),
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      cohort: '2026',
      department: 'Ilmu Komputer',
      terms: true,
    },
  });

  const passwordVal = watch('password') || '';

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(passwordVal);

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await signup({
        name: data.name,
        email: data.email,
        cohort: data.cohort,
        department: data.department,
        isAnonymous: false,
        privacyLevel: 'public',
      });
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-eco text-white shadow-lg shadow-emerald-500/25 mb-1">
            <Leaf className="w-7 h-7 fill-white/20" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daftar Akun <span className="text-emerald-600">EcoTrace</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Bergabung dengan gerakan kampus hijau dan kurangi jejak karbon bersama
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Nama Lengkap</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: Barlian Athallah"
                  {...register('name')}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                    errors.name ? 'border-rose-400' : 'border-slate-200 focus:ring-emerald-500'
                  } rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:bg-white transition-all`}
                />
              </div>
              {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
            </div>

            {/* Email Kampus */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email IPB / Student Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="nama@apps.ipb.ac.id"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                    errors.email ? 'border-rose-400' : 'border-slate-200 focus:ring-emerald-500'
                  } rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:bg-white transition-all`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
            </div>

            {/* Cohort & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Angkatan</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    {...register('cohort')}
                    className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none"
                  >
                    <option value="2026">2026 (MABA)</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021 & Sebelumnya</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Departemen / Jurusan</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    {...register('department')}
                    className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none"
                  >
                    <option value="Ilmu Komputer">Ilmu Komputer</option>
                    <option value="Agronomi & Hortikultura">Agronomi & Hortikultura</option>
                    <option value="Manajemen">Manajemen</option>
                    <option value="Kedokteran Hewan">Kedokteran Hewan</option>
                    <option value="Teknik Sipil & Lingkungan">Teknik Sipil & Lingkungan</option>
                    <option value="Teknologi Pangan">Teknologi Pangan</option>
                    <option value="Statistika & Sains Data">Statistika & Sains Data</option>
                    <option value="Biologi">Biologi</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password Field + Strength Indicator */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Buat password minimal 6 karakter"
                  {...register('password')}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${
                    errors.password ? 'border-rose-400' : 'border-slate-200 focus:ring-emerald-500'
                  } rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:bg-white transition-all`}
                />
              </div>
              {passwordVal.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength === 1
                          ? 'w-1/4 bg-rose-500'
                          : strength === 2
                          ? 'w-2/4 bg-amber-500'
                          : strength === 3
                          ? 'w-3/4 bg-blue-500'
                          : 'w-full bg-emerald-500'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Kekuatan Password:{' '}
                    <span className="font-semibold">
                      {strength <= 1 ? 'Lemah' : strength === 2 ? 'Sedang' : strength === 3 ? 'Kuat' : 'Sangat Kuat'}
                    </span>
                  </p>
                </div>
              )}
              {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
            </div>

            {/* Terms Agreement Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                {...register('terms')}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 leading-snug">
                Saya menyetujui <span className="font-semibold text-slate-800">Syarat & Ketentuan</span> serta komitmen pengurangan emisi kampus.
              </label>
            </div>
            {errors.terms && <p className="text-xs text-rose-500">{errors.terms.message}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 gradient-eco hover:opacity-95 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Membuat Akun...</span>
              ) : (
                <>
                  <span>Buat Akun EcoTrace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
