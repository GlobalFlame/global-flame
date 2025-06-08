import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const openai = new OpenAI({ apiKey: openaiApiKey });

export async function approveContent(title, file) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: Approve this upload: title="", file=. Is it positive and creative? }],
  });
  return response.choices[0].message.content.includes('yes');
}
