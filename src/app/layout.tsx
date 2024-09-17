import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ReactQueryProvider } from './provider';
import './globals.css';

const fonts = Poppins({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js Starterkit',
  description: 'A starterkit for Next.js with TypeScript, Tailwind CSS, and React Query.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fonts.className}`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}