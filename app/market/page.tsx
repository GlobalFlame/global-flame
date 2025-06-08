import { supabase } from '@/lib/supabase';
import { BookPreview } from '@/components/BookPreview';
import { createInvoice } from '@/lib/alby-server';
import { useTranslations } from 'next-intl';

export default async function Market() {
  const t = useTranslations('sell_window');
  const { data: items } = await supabase.from('market_items').select('*');

  return (
    <div className='grid md:grid-cols-3 gap-4 p-4'>
      {items?.map((item) => (
        <div key={item.id} className='p-4 border border-pink-400 rounded'>
          <h2>{item.title}</h2>
          {item.category === 'book' || item.category === 'guide' ? (
            <BookPreview filePath={item.file_path} />
          ) : item.category === 'music' ? (
            <audio controls src={item.file_path} className='w-full' />
          ) : item.category === 'video' ? (
            <video controls src={item.file_path} className='w-full' />
          ) : (
            <img src={item.file_path} alt={item.title} />
          )}
          <p>{t('live_tips', { count: item.tip_amount })}</p>
          <p>{t('price', { price: item.price })}</p>
          <form
            action={async () => {
              'use server';
              const { invoice, downloadUrl, invoiceId } = await createInvoice(item.price, item.file_path, item.id, 'TEST_USER_UUID');
              const { data: purchase } = await supabase
                .from('purchases')
                .select('download_url')
                .eq('market_item_id', item.id)
                .eq('user_id', 'TEST_USER_UUID')
                .eq('status', 'paid')
                .single();
              return { invoice, downloadUrl: purchase?.download_url || downloadUrl, invoiceId };
            }}
          >
            <button className='bg-pink-600 hover:bg-pink-500 text-white p-2 rounded'>
              {t('buy_button')}
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
