import Stripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
           mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
                       produc          },
          quantity: 1
        }
      ],
      success_url: $ProjectOrigin/success?session_id={CHECKOUT_SESSION_ID},
      cancel_url: $ProjectOrigin    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe session creation failed:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
