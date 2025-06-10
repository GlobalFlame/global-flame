'use client';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-intl';

export default function SellWindow() {
  const { t } = useTranslation('sell_window');

  const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const className = typeof e.currentTarget.className === 'string' ? e.currentTarget.className : '';
    if (className.includes('upload-area')) {
      console.log('Double-clicked upload area!');
      // Add your double-click logic here
    }
  };

  return (
    <motion.div
      className='upload-area'
      onDoubleClick={onDoubleClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>{t('title')}</h1>
      <p>{t('description', { userImpact: 100 })}</p>
      <input type='text' placeholder={t('title_placeholder', { category: 'book' })} />
      <button>{t('submit_button')}</button>
    </motion.div>
  );
}