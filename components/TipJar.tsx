'use client';

import { useState } from 'react';

export default function TipJar({ category }: { category: string }) {
  const [tipCount, setTipCount] = useState(0);

  // Placeholder for Supabase Realtime subscription (added later)
  const handleTip = () => {
    setTipCount(tipCount + 1); // Mock tip increment
  };

  return (
    <div className='flex flex-col items-center gap-2 p-4 bg-pink-100 rounded-lg'>
      <p className='text-pink-600'>Tips for {category}: {tipCount}</p>
      <button
        onClick={handleTip}
        className='bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700'
      >
        Tip Now
      </button>
    </div>
  );
}
