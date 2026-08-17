import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';
import { BottomNav } from '@/components/bottom-nav';
import { EcoGuide } from '@/components/eco-guide';

export const metadata: Metadata = {
  title: 'EcoTrace | Pelacak Jejak Karbon Kampus',
  description: 'Platform Digital Pelacak, Visualisasi, dan Pengurangan Jejak Karbon Personal Mahasiswa IPB University.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 pb-20 lg:pb-8">{children}</main>
          <BottomNav />
          <EcoGuide />
        </Providers>
      </body>
    </html>
  );
}
