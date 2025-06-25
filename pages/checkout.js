import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE);

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ amount: 100 }) // .00
    });
    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId });
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center', padding:'2rem', fontFamily:'sans-serif' }}>
      <h1>Tip & Send a Global Flame ()</h1>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading…' : 'Checkout'}
      </button>
    </div>
  );
}
