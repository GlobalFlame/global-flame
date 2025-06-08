'use client';
import { useState, useEffect } from 'react';

export default function Wall({ params }) {
  const [category] = useState(params.wall);
  const [message, setMessage] = useState('Reflecting your soul...');

  useEffect(() => {
    setMessage(Welcome to  Wall—your voice shines!);
  }, [category]);

  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-purple-200 to-purple-400 text-purple-800 animate-fade'>
      <h1 className='text-4xl font-bold text-purple-600'>🔥 Global Flame: {category.charAt(0).toUpperCase() + category.slice(1)} Wall</h1>
      <p className='text-purple-600'>{message}</p>
    </main>
  );
}
