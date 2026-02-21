import type { Metadata } from 'next';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Achat Location', template: '%s | Achat Location' },
  description: 'Plateforme SaaS immobilière mondiale.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="dark" suppressHydrationWarning dir="ltr">
      <body className="min-h-screen bg-base-200">{children}</body>
    </html>
  );
}
