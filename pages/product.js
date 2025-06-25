import Image from 'next/image';
import Link from 'next/link';

export default function ProductPage() {
  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '2rem', textAlign: 'center' }}>
      <h1>💌 Global Flame Card</h1>
      <Image
        src="/flame-card.jpg"
        alt="Global Flame Card"
        width={400}
        height={300}
      />
      <p style={{ margin: '1.5rem 0' }}>
        Send a spark of love for \. An AI-generated message will SMS your recipient.
      </p>
      <Link href="/checkout">
        <button
          style={{
            background: '#e60023',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          Tip & Send ()
        </button>
      </Link>
    </div>
  );
}
