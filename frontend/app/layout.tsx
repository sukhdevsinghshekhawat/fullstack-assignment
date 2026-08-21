import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { ThemeProvider } from '@/lib/theme';
import KeepAlive from '@/components/keepalive/KeepAlive';

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'Full stack task management system',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <KeepAlive />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}