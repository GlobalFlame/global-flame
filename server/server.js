require('dotenv').config();
const express = require('express');
const twilio  = require('twilio');
const path    = require('path');

const SID   = process.env.TWILIO_SID;
const TOKEN = process.env.TWILIO_TOKEN;
const FROM  = process.env.TWILIO_FROM;
const PORT  = parseInt(process.env.PORT, 10) || 3000;

if (!SID || !TOKEN || !FROM) {
  console.error('ERROR: Missing Twilio SID, TOKEN, or FROM in .env');
  process.exit(1);
}

const client = twilio(SID, TOKEN);
const app    = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Sample messages
const messages = [
  'Your love ignites galaxies!',
  'One spark from you sets my soul ablaze!',
  'Our flame outshines every star in the sky!',
  'Kiss so fierce it breaks the universe!',
  'Youâ€™re my eternal blaze!'
];

// POST /api/send-sms
app.post('/api/send-sms', async (req, res) => {
  const { phone, tip } = req.body;
  if (!phone || !phone.match(/^\+[1-9]\d{9,14}$/)) {
    return res.status(400).json({ success:false, error:'Invalid phone' });
  }
  if (!tip || tip < 1) {
    return res.status(400).json({ success:false, error:'Minimum  tip required' });
  }
  const body = messages[Math.floor(Math.random() * messages.length)];
  try {
    await client.messages.create({ to: phone, from: FROM, body });
    console.log('Sent:', body, 'â†’', phone, '($' + tip + ')');
    return res.json({ success:true });
  } catch (err) {
    console.error('Twilio error', err.message);
    return res.status(500).json({ success:false, error:err.message });
  }
});

app.listen(PORT, () => {
  console.log('Server listening on http://localhost:' + PORT);
});
