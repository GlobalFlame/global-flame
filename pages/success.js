import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

ex  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      if (!sessionId) return;
      const stripe = await loadStripe('al/100).toFixed(2)} was successful.</p>');
      const result = await fetch('/api/checkout-session?session_id=' + sessionId);
      const data = await result.json();
      setSession(data);
    };
    fetchSession();
  }, []);

  if (!session) return <p>Loading...</p>;
  return (
    <div style={{ padding:'2rem', fontFamily:'sans-serif', textAlign:'center' }}>
      <h1>❤️ Thank you!</h1>
      <p>Your payment of 
