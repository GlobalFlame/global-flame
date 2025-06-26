import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

// Create Twilio client
const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') 
    return res.status(405).json({ success: false, error: 'Only POST requests allowed' });

  const { saying, phone, tip } = req.body;
  if (!saying || !phone || tip < 1) 
    return res.status(400).json({ success: false, error: 'Invalid data' });

  try {
    // Validate phone
    const lookup = await client.lookups.v2.phoneNumbers(phone).fetch();
    if (!lookup.valid) throw new Error('Invalid phone');

    // Send message (no supabase lookup, saying must be passed in POST)
    await client.messages.create({
      body: `🔥 GLOBAL FLAME: ${saying}\nTip: $${tip}`,
      from: process.env.TWILIO_FROM,
      to: lookup.phoneNumber as string
    });

    // Success (logging to supabase is removed)
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
