// pages/api/send-card.js
import Twilio from 'twilio'

// Pull your credentials from env
const sid   = process.env.TWILIO_SID || ''
const token = process.env.TWILIO_TOKEN || ''
const from  = process.env.TWILIO_FROM || ''

// Only initialize if valid
const client = sid.startsWith('AC') && token
  ? Twilio(sid, token)
  : null

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'POST only' })
  }

  const { message, phone } = req.body
  if (!client) {
    return res.status(500).json({ success: false, error: 'Twilio not configured' })
  }
  if (!message || !phone) {
    return res.status(400).json({ success: false, error: 'Missing message or phone' })
  }

  try {
    // send the SMS
    await client.messages.create({
      body: message,
      from: from,
      to: phone
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Twilio error:', err)
    return res.status(500).json({ success: false, error: err.message })
  }
}
