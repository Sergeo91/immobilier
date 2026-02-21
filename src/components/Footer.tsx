'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="footer footer-center bg-base-300 text-base-content p-4">
      <p>© {new Date().getFullYear()} Achat Location — {t('copyright')}</p>
    </footer>
  );
}
