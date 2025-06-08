'use client';
import { useState } from 'react';

export default function Gallery() {
  const [category, setCategory] = useState('all');
  const items = [
    { title: 'Item 1', category: 'art' },
    { title: 'Item 2', category: 'dance' },
    { title: 'Item 3', category: 'lifers' },
  ];

  const filteredItems = category === 'all' ? items : items.filter(item => item.category === category);

  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-pink-200 to-pink-400 text-pink-800'>
      <h1 className='text-4xl font-bold'>🔥 Global Flame: Gallery</h1>
      <p className='text-pink-600'>Watch flames rise from creators worldwide!</p>
      <select value={category} onChange={(e) => setCategory(e.target.value)} className='p-2 mb-4'>
        <option value='all'>All</option>
        <optgroup label='Towers'>
          <option value='art'>Art</option>
          <option value='dance'>Dance</option>
          <option value='music'>Music</option>
          <option value='invention'>Invention</option>
          <option value='writer'>Writer</option>
          <option value='comedy'>Comedy</option>
          <option value='prison'>Prison</option>
        </optgroup>
        <optgroup label='Prison Walls'>
          <option value='lifers'>Lifers</option>
          <option value='innocence'>Innocence</option>
          <option value='family'>Family Reconnection</option>
          <option value='second_chance'>Second Chance</option>
        </optgroup>
      </select>
      <div className='grid grid-cols-3 gap-4'>
        {filteredItems.map((item, index) => (
          <div key={index} className='p-4 bg-pink-100 rounded'>{item.title} ({item.category})</div>
        ))}
      </div>
    </main>
  );
}
