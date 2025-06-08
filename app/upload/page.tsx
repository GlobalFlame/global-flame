'use client';
import { useState } from 'react';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('art');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Uploading:', { title, category, file });
    alert('Upload feature coming soon!');
  };

  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-pink-200 to-pink-400 text-pink-800'>
      <h1 className='text-4xl font-bold'>🔥 Global Flame: Upload</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title' className='p-2' required />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className='p-2' required>
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
        <input type='file' onChange={(e) => setFile(e.target.files?.[0])} className='p-2' required />
        <button type='submit' className='bg-pink-600 text-white px-4 py-2 rounded'>Upload</button>
      </form>
    </main>
  );
}
