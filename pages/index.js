import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>🔥 Welcome to Global Flame</h1>
      <p>Quick routes test:</p>
      <ul>
        <li><Link href="/sanctuary-charter">Sanctuary Charter</Link></li>
      </ul>
    </div>
  );
}
