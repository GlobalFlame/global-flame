import { motion } from 'framer-motion';

export function FlameLoader() {
  return (
    <motion.div
      className='animate-spin h-6 w-6 border-4 border-t-transparent border-red-500 rounded-full'
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    />
  );
}
