import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>🔥 Welcome to Global Flame</h1>
      <p>Global Flame is operated by LB11 LLC. Founded by Lemuel Blue. Based in Florida, USA.</p>
      <p>Email: <a href="mailto:founder@globalflame.org">founder@globalflame.org</a></p>
      <p>Our platform allows users to send SMS-based Love Bomb tips to creators and elders.</p>
      <ul>
        <li><Link href="/sanctuary-charter">Sanctuary Charter</Link></li>
      </ul>
    </div>
  );
}
