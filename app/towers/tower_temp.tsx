'use client';
import { useState, useEffect } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default function Tower({ params }) {
  const [category] = useState(params.tower);
  const [items] = useState([{ title: ${category} Item 1, category }, { title: ${category} Item 2, category }]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const bgColor = category === 'men' ? 'from-blue-200 to-blue-400' : category === 'children' ? 'from-yellow-200 to-yellow-400' : 'from-red-200 to-red-400';
  const [location, setLocation] = useState('United States');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(pos.coords.latitude > 0 ? 'United States' : 'China');
      });
    }
    const generateTasks = async () => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: Generate 5 daily tasks for  in  to improve mental and physical health, tailored to their location. }],
      });
      setDailyTasks(response.choices[0].message.content.split('\n').filter(t => t));
    };
    generateTasks();
  }, [category, location]);

  return (
    <main className={min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-b  text--800 animate-pulse}>
      <h1 className={	ext-4xl font-bold text--600}>🔥 Global Flame: {category.charAt(0).toUpperCase() + category.slice(1)} Tower</h1>
      <div className='grid grid-cols-2 gap-4'>
        {items.map((item, index) => (
          <div key={index} className='p-4 bg-pink-100 rounded hover:bg-pink-200'>{item.title}</div>
        ))}
      </div>
      <h2 className='text-2xl text-[var(--quantum-blue)]'>Daily Transformations for {location}</h2>
      <ul className='list-disc text-left'>
        {dailyTasks.map((task, index) => <li key={index} className='p-2'>{task}</li>)}
      </ul>
    </main>
  );
}
