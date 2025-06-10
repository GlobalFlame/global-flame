'use client';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-intl';

export default function MenTower() {
  const { t } = useTranslation('towers');

  const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const className = typeof e.currentTarget.className === 'string' ? e.currentTarget.className : '';
    if (className.includes('wall-area')) {
      console.log('Double-clicked wall area!');
      // Add your double-click logic here
    }
  };

  return (
    <motion.div
      className='wall-area'
      onDoubleClick={onDoubleClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>{t('men')}</h1>
      <p>Wall of Love for Men</p>
    </motion.div>
  );
}