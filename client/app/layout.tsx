import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bollywood Look-Alike Finder | Find Your Bollywood Twin',
  description: 'Discover your Bollywood doppelganger with AI-powered face matching. Upload your photo and see which Bollywood star you resemble most!',
  keywords: 'Bollywood, face matching, AI, look-alike, celebrity, twin, doppelganger',
  openGraph: {
    title: 'Bollywood Look-Alike Finder',
    description: 'Find your Bollywood twin with AI-powered face matching',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}