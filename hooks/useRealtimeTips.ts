import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/** Live tip count + impact for a wall category */
export function useRealtimeTips(category: string) {
  const [tips,       setTips]   = useState(0);
  const [userImpact, setImpact] = useState(0);

  useEffect(() => {
    // ── realtime subscription ──────────────────────────
    const channel = supabase
      .channel(`tips:${category}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'market_items' },
        payload => {
          setTips(prev => prev + (payload.new.tip_amount ?? 0));
          setImpact(prev => prev + 1);
        }
      )
      .subscribe();

    // ── initial tally ──────────────────────────────────
    (async () => {
      const { data } = await supabase
        .from('market_items')
        .select('tip_amount');
      if (data)
        setTips(data.reduce((s, r) => s + (r.tip_amount ?? 0), 0));
    })();

    return () => supabase.removeChannel(channel);
  }, [category]);

  return { tips, userImpact };
}
