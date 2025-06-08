import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const WISDOM = {
  men: [
    'Strength is found in vulnerability, brother.',
    'Your heart is a forge—shape it with courage.',
    'Stand tall, but kneel for love.',
    'Wisdom grows in the quiet moments.',
    'Lead with honor, follow with humility.'
  ],
  women: [
    'Your light shines brightest in truth, sister.',
    'Embrace your power, it’s divine.',
    'Love yourself first, then share it.',
    'Your voice heals the world’s wounds.',
    'Grace is strength in soft armor.'
  ],
  children: [
    'Your dreams are magic, little one.',
    'Be kind, it makes you a hero.',
    'Every day is a new adventure.',
    'You are loved just as you are.',
    'Smile, it lights up the world.'
  ]
};

export async function POST() {
  try {
    const wallTypes = ['men', 'women', 'children'];
    for (const wall of wallTypes) {
      const messages = WISDOM[wall].slice(0, 5); // Simulate AI with static wisdom
      for (const msg of messages) {
        const { error } = await supabase
          .from('daily_walls')
          .insert({ wall_type: wall, content: msg });
        if (error) throw error;
      }
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
