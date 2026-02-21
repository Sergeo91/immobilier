'use client';

import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { Languages } from 'lucide-react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/config';

export function LocaleSwitcher() {
  const t = useTranslations('Locale');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle" title={t('label')}>
        <Languages className="h-5 w-5" />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-50 mt-2 w-44 rounded-box bg-base-100 p-2 shadow-lg"
      >
        <li className="menu-title">{t('label')}</li>
        {locales.map((loc) => (
          <li key={loc}>
            <button
              type="button"
              onClick={() => setLocale(loc)}
              className={locale === loc ? 'active' : ''}
            >
              {t(loc)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
