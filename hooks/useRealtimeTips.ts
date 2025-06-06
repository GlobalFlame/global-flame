// hooks/useRealtimeTips.ts
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useRealtimeTips(wall: string) {
  const [tips, setTips] = useState(0);
  const [hearts, setHearts] = useState(0);

  useEffect(() => {
    // first load
    supabase
      .from(`${wall}_posts`)
      .select('tip_amount')
      .then(({ data }) =>
        setTips(data?.reduce((s, p) => s + Number(p.tip_amount ?? 0), 0) || 0)
      );

    // realtime channel
    const ch = supabase
      .channel(`tips:${wall}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: `${wall}_posts` },
        payload => {
          setTips(t => t + Number(payload.new.tip_amount ?? 0));
          setHearts(h => h + 1);
        }
      )
      .subscribe();

    return () => void supabase.removeChannel(ch);
  }, [wall]);

  return { tips, hearts };
}
