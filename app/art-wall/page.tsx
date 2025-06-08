'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { uploadFile } from '@/lib/storage';
import { trackEvent } from '@/lib/analytics';
import { FlameLoader } from '@/components/FlameLoader';
import { useRealtimeTips } from '@/hooks/useRealtimeTips';

export default function ArtWall() {
  const { t } = useTranslation('common');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { tips, userImpact } = useRealtimeTips('art');
  const router = useRouter();

  useEffect(() => {
    trackEvent('page_view', { page: 'art-wall' });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) { alert(t('errors.no_file')); return; }
    setLoading(true);
    try {
      const filePath = await uploadFile(file);
      const res = await fetch('/api/v1/art-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'TEST_USER_UUID', wall_type: 'art', title, file_path: filePath }),
      });
      if (res.ok) {
        trackEvent('upload_success', { wall: 'art', title });
        alert(t('success.upload', { user: 'Baby' }));
        router.push('/gallery');
      } else {
        const { error } = await res.json();
        alert(error || t('errors.upload_failed'));
      }
    } catch (err) {
      trackEvent('upload_error', { error: err.message });
      alert(t('errors.network', { message: err.message }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-pink-200 to-pink-400 text-pink-800'>
      <h1>{t('art_wall.title')}</h1>
      <p>{t('art_wall.description', { userImpact })}</p>
      <p>{t('art_wall.live_tips', { count: tips })}</p>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('art_wall.title_placeholder')} required disabled={loading} />
        <input type='file' onChange={(e) => setFile(e.target.files?.[0] || null)} required disabled={loading} />
        <button type='submit' disabled={loading}>{loading ? <FlameLoader /> : t('art_wall.submit_button')}</button>
      </form>
    </main>
  );
}
