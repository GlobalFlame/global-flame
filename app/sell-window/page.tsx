'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { uploadFile } from '@/lib/storage';
import { trackEvent } from '@/lib/analytics';
import { FlameLoader } from '@/components/FlameLoader';
import { useRealtimeTips } from '@/hooks/useRealtimeTips';

export default function SellWindow() {
  const { t } = useTranslation('common');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('general');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { tips, userImpact } = useRealtimeTips(category);
  const router = useRouter();

  useEffect(() => {
    trackEvent('page_view', { page: 'sell-window' });
  }, []);

  const handleVoiceInput = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert(t('errors.no_voice_support'));
      return;
    }
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      setTitle(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert(t('errors.no_file'));
    if (!price || parseFloat(price) > 20 || parseFloat(price) <= 0) {
      return alert(t('errors.invalid_price'));
    }

    setLoading(true);
    try {
      const filePath = await uploadFile(file, category);
      const res = await fetch('/api/v1/sell-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'flame-token',
        },
        body: JSON.stringify({
          user_id: 'TEST_USER_UUID',
          category,
          title,
          file_path: filePath,
          price: parseFloat(price),
        }),
      });

      if (res.ok) {
        trackEvent('upload_success', { category, title });
        alert(t('success.upload'));
        router.push('/market');
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
    <main className="min-h-screen bg-gradient-to-b from-black to-purple-900 text-white p-6 flex flex-col items-center justify-center font-sans">
      <h1 className="text-5xl font-bold mb-6 text-center text-pink-400 animate-[pulse_2s_infinite]">
        ?? {t('sell_window.title')}
      </h1>
      <p className="text-center max-w-xl mb-8 text-gray-200">
        {t('sell_window.description', { userImpact })}
      </p>
      <div className="mb-8 text-center text-purple-300">
        {t('sell_window.live_tips', { count: tips })}
      </div>
      {navigator.onLine ? null : (
        <div className="mb-4 text-center text-yellow-400">
          {t('sell_window.offline_banner')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <select
          className="w-full p-4 border border-pink-400 bg-black/50 rounded text-white focus:ring-2 focus:ring-pink-500 transition duration-300"
          value={category}
          onChange={e => setCategory(e.target.value)}
          disabled={loading}
        >
          <option value="general">{t('sell_window.categories.general')}</option>
          <option value="book">{t('sell_window.categories.book')}</option>
          <option value="music">{t('sell_window.categories.music')}</option>
          <option value="video">{t('sell_window.categories.video')}</option>
          <option value="guide">{t('sell_window.categories.guide')}</option>
        </select>
        <div className="flex gap-2">
          <input
            className="flex-grow p-4 border border-pink-400 bg-black/50 rounded text-white placeholder-pink-300 focus:ring-2 focus:ring-pink-500 transition duration-300"
            placeholder={t('sell_window.title_placeholder', { category })}
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            className="p-4 bg-pink-600 hover:bg-pink-500 rounded text-white disabled:opacity-50"
            onClick={handleVoiceInput}
            disabled={loading || isListening}
          >
            {isListening ? '???' : '???'}
          </button>
        </div>
        <input
          type="file"
          accept={category === 'book' || category === 'guide' ? 'application/pdf' : category === 'music' ? 'audio/*' : category === 'video' ? 'video/*' : '*/*'}
          className="w-full p-4 border border-pink-400 bg-black/50 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-pink-600 file:text-white hover:file:bg-pink-500 transition duration-300"
          onChange={e => setFile(e.target.files?.[0] || null)}
          required
          disabled={loading}
        />
        <input
          type="number"
          step="0.01"
          max="20"
          min="0.01"
          className="w-full p-4 border border-pink-400 bg-black/50 rounded text-white placeholder-pink-300 focus:ring-2 focus:ring-pink-500 transition duration-300"
          placeholder={t('sell_window.price_placeholder')}
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
          disabled={loading}
        />
        <button
          className="w-full bg-pink-600 hover:bg-pink-500 transition text-white p-4 rounded disabled:opacity-50 flex items-center justify-center gap-2"
          type="submit"
          disabled={loading}
        >
          {loading ? <FlameLoader /> : t('sell_window.submit_button')}
        </button>
      </form>
    </main>
  );
}
