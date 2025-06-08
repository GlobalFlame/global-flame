'use client';
import { useState } from 'react';

export default function CardSender() {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sending card:', { message, recipient, file });
    alert('Card sent to ' + recipient + ' with love!');
  };

  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-pink-200 to-pink-400 text-pink-800 animate-fade'>
      <h1 className='text-4xl font-bold text-pink-600'>🔥 Global Flame: Send a Card</h1>
      <p className='text-pink-600'>Send love to anyone, anywhere!</p>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Your loving message' className='p-2' required />
        <input type='text' value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder='Recipient phone/email' className='p-2' required />
        <input type='file' onChange={(e) => setFile(e.target.files?.[0])} className='p-2' />
        <button type='submit' className='bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700'>Send Card 🔥</button>
      </form>
    </main>
  );
}
