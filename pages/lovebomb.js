import { useState } from 'react';
import Image from 'next/image';

export default function LoveBombDemo() {
  // 20 static demo phrases
  const phrases = [
    'You are my eternal spark 💖',
    'One kiss ignites galaxies 🌌',
    'Love blasting cosmic waves 🌊',
    'Heartbeats rewrite reality 💓',
    'Soul on fire, no regrets 🔥',
    'Endless love, no limits ∞',
    'You and me, starbound ✨',
    'Kiss louder than thunder ⚡',
    'Love echoes through time ⏳',
    'Our flame burns eternally 🔥',
    'Your smile breaks my universe 🌠',
    'One spark, infinite glow ✨',
    'Heartbeat in sync with yours ��',
    'Soul dance in moonlight 🕺',
    'Love soars beyond skies ☁️',
    'Our kiss shatters darkness 🌙',
    'Flame that never fades 🔥',
    'Two hearts, one echo 💞',
    'Love is our revolution 💥',
    'Endless blaze of devotion ❤️'
  ];

  const [selected, setSelected] = useState(phrases[0]);
  const [tip, setTip] = useState(1);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>💣 LOVE BOMB DEMO</h1>
      <Image
        src="/flame-card.jpg"
        alt="Flame Card"
        width={350}
        height={240}
      />
      <p style={{ margin: '1rem 0' }}>
        <strong>Phrase:</strong>
        <br/>
        <em>"{selected}"</em>
      </p>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{ padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem' }}
      >
        {phrases.map((p, i) => (
          <option key={i} value={p}>{p}</option>
        ))}
      </select>

      <div style={{ margin: '1rem 0' }}>
        Tip Amount: $
        <input
          type="number"
          min="1"
          value={tip}
          onChange={(e) => setTip(Number(e.target.value))}
          style={{ width: '4rem', padding: '0.25rem', fontSize: '1rem' }}
        />
      </div>

      <button
        style={{
          background: '#e60023',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          fontSize: '1rem',
          cursor: 'pointer',
          borderRadius: '4px'
        }}
        onClick={() => alert(\Sending Love Bomb:\\nPhrase: "\"\\nTip: $\\)}
      >
        SEND LOVE BOMB
      </button>
    </div>
  );
}
