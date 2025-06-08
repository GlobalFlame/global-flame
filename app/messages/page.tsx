'use client';
import { useState, useEffect } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default function Messages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const generateMessages = async () => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Generate 5 profound life-changing messages about love.' }],
      });
      setMessages(response.choices[0].message.content.split('\n').filter(m => m));
    };
    generateMessages();
  }, []);

  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--healing-gold)] text-[var(--dark-space)]'>
      <h1 className='text-4xl font-bold'>🔥 Daily Love Messages</h1>
      <ul>{messages.map((msg, i) => <li key={i} className='p-2'>{msg}</li>)}</ul>
    </main>
  );
}
