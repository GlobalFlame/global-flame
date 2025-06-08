'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';

export default function MensWall() {
  const t = useTranslations('towers');
  const [messages, setMessages] = useState<{ id: number; content: string; created_at: string }[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const { data } = await supabase
        .from('daily_walls')
        .select('id, content, created_at')
        .eq('wall_type', 'men')
        .order('created_at', { ascending: false })
        .limit(5);
      setMessages(data || []);
    }
    fetchMessages();

    const channel = supabase
      .channel('daily_walls_men')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'daily_walls', filter: 'wall_type=eq.men' }, (payload) => {
        setMessages((prev) => [payload.new, ...prev.slice(0, 4)]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className='min-h-screen bg-gradient-to-b from-black to-blue-900 text-white p-6 flex flex-col items-center justify-center font-sans'>
      <h1 className='text-5xl font-bold mb-6 text-center text-blue-400 animate-[pulse_2s_infinite]'>
        ?? Men’s Wall of Love
      </h1>
      <div className='w-full max-w-2xl space-y-4'>
        {messages.map((msg) => (
          <div key={msg.id} className='p-4 bg-black/50 border border-blue-400 rounded'>
            <p className='text-lg'>{msg.content}</p>
            <p className='text-sm text-gray-400 mt-2'>{new Date(msg.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
