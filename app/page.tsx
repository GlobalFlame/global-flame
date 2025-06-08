'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('sell_window');
  const router = useRouter();

  useEffect(() => {
    router.push('/sell-window');
  }, [router]);

  return (
    <main className='min-h-screen bg-gradient-to-b from-black to-purple-900 text-white flex items-center justify-center'>
      <h1 className='text-4xl font-bold text-pink-400 animate-[pulse_2s_infinite]'>
        ?? {t('title')} - Redirecting...
      </h1>
    </main>
  );
}
