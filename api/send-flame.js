import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import OpenAI from 'openai';

const firebaseConfig = { "apiKey":"YOUR_API_KEY", "authDomain":"YOUR_AUTH_DOMAIN", "databaseURL":"YOUR_DB_URL", "projectId":"YOUR_PROJECT_ID", "storageBucket":"YOUR_STORAGE_BUCKET", "messagingSenderId":"YOUR_SENDER_ID", "appId":"YOUR_APP_ID" };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const openai = new OpenAI({ apiKey: 'sk-YOUR_OPENAI_KEY' });

export default async function handler(req, res) {
  const { message, wall } = req.body;
  const hour = new Date().getHours();
  const block = hour < 12 ? 'morning' : hour < 18 ? 'noon' : 'evening';
  const comp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Refine this flame: keep soul, elevate tone.' },
      { role: 'user', content: message }
    ]
  });
  const flame = comp.choices[0].message.content.trim();
  await push(ref(db, \walls/\/\\), { text: flame, ts: Date.now() });
  res.status(200).json({ success: true, flame });
}
