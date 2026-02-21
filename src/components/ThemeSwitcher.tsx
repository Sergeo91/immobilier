'use client';

import { useTheme } from '@/context/ThemeContext';
import { THEME_IDS, THEME_LABELS, type ThemeId } from '@/lib/themes';
import { Palette } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('Theme');

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle" title={t('label')}>
        <Palette className="h-5 w-5" />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-50 mt-2 w-56 rounded-box bg-base-100 p-2 shadow-lg"
      >
        <li className="menu-title">{t('label')}</li>
        {THEME_IDS.map((id) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => setTheme(id as ThemeId)}
              className={theme === id ? 'active' : ''}
            >
              {t(id)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
