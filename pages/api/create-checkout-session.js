import Stripe from 'stripe';
const stripe = new Stripe('port default function Success() {', { apiVersion: '2022-11-15' });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { amount } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Global Flame Card' },
          unit_amount: ) => {,
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: ${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID},
      cancel_url: ${req.headers.origin}/,
    });
    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
