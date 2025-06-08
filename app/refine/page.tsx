'use client';
export default function Refine() {
  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-pink-200 to-pink-400 text-pink-800'>
      <h1 className='text-4xl font-bold text-pink-600'>🔥 Global Flame: Refine Your Flame</h1>
      <p className='text-pink-600'>Your upload needs a little love! Try these tips:</p>
      <ul className='list-disc text-left'>
        <li>Add a clear title.</li>
        <li>Ensure content is positive and creative.</li>
        <li>Try a different file format.</li>
      </ul>
      <a href='/sell-window' className='bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700'>Back to Upload</a>
    </main>
  );
}
