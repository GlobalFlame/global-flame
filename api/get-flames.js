import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child } from 'firebase/database';

const firebaseConfig = { "apiKey":"YOUR_API_KEY", "authDomain":"YOUR_AUTH_DOMAIN", "databaseURL":"YOUR_DB_URL", "projectId":"YOUR_PROJECT_ID", "storageBucket":"YOUR_STORAGE_BUCKET", "messagingSenderId":"YOUR_SENDER_ID", "appId":"YOUR_APP_ID" };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default async function handler(req, res) {
  const { wall, time } = req.query;
  const snap = await get(child(ref(db), \walls/\/\\));
  res.status(200).json(snap.exists() ? Object.values(snap.val()) : []);
}
