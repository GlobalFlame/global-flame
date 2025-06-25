import Stripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next';

// Use the latest API version (from your error: '2025-05-28.basil')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { price, productName, projectOrigin } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price, // price in cents, e.g. 2000 = $20.00
            product_data: {
              name: productName || 'Global Flame Contribution',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${projectOrigin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${projectOrigin}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe session creation failed:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
