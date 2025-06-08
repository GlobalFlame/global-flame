'use client';
import { useState, useEffect } from 'react';
export default function Tower({ params }) {
  const [tasks, setTasks] = useState([]);
  const category = params.tower;
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('/api/tasks?category=' + category);
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
    fetchTasks();
  }, [category]);
  return (
    <main className='min-h-screen flex flex-col items-center bg-pink-400 text-white p-4'>
      <h1 className='text-4xl mb-4'>🔥 {category.charAt(0).toUpperCase() + category.slice(1)} Tower</h1>
      <ul>{tasks.map((task, index) => <li key={index}>{task}</li>)}</ul>
    </main>
  );
}
