import { NextResponse } from 'next/server';
import HumeAI from 'hume-ai';

const hume = new HumeAI({ apiKey: process.env.HUME_API_KEY });

export async function POST(request) {
  const formData = await request.formData();
  const title = formData.get('title');
  const file = formData.get('file');

  if (!title) {
    return NextResponse.json({ error: 'Missing title' }, { status: 400 });
  }

  const analysis = await hume.analyzeText({ text: title, emotions: ['joy', 'love'] });
  const isApproved = analysis.some(e => e.score > 0.5);
  if (!isApproved) {
    return NextResponse.redirect(new URL('/refine', request.url));
  }

  return NextResponse.json({ message: 'Content approved with love' }, { status: 200 });
}
