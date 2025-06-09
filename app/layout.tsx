import './globals.css';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { i18n } from '../i18n';

export const metadata = {
  title: 'Global Flame',
  description: 'Drop your soul’s work—books, tracks, videos, guides.',
};

export function generateStaticParams() {
  return i18n.locales.map(locale => ({ locale }));
}

export default async function RootLayout({ children, params: { locale } }: { children: ReactNode; params: { locale: string } }) {
  if (!i18n.locales.includes(locale as any)) notFound();
  let messages;
  try {
    messages = (await import(../messages/.json)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}