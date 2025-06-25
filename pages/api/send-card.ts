import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Only POST' });
  const { sayingId, phone, tip } = req.body;
  if (!sayingId || !phone || tip < 1) return res.status(400).json({ success: false, error: 'Invalid or < ' });
  try {
    const lookup = await client.lookups.v2.phoneNumbers(phone).fetch();
    if (!lookup.valid) throw new Error('Invalid phone');
    const { data: say, error: sayErr } = await supabase
      .from('card_sayings').select('text').eq('id', sayingId).single();
    if (sayErr || !say) throw sayErr || new Error('Not found');
    await client.messages.create({
      body: `?? GLOBAL FLAME: ${say.text}\nTip: $${tip}`,
      from: process.env.TWILIO_FROM,
      to: lookup.phoneNumber as string
    });
    const { error: logErr } = await supabase
      .from('sent_cards').insert([{ saying_id: sayingId, recipient_phone: lookup.phoneNumber, tip_amount: tip }]);
    if (logErr) throw logErr;
    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
