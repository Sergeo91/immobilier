'use client';

import { useTheme } from '@/context/ThemeContext';

const THEMES = [
  { id: 'dark', label: 'Sombre' },
  { id: 'light', label: 'Clair' },
  { id: 'luxury', label: 'Luxe' },
  { id: 'business', label: 'Business' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'coffee', label: 'Café' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'highcontrast', label: 'Contraste élevé' },
  { id: 'system', label: 'Système' },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="form-control">
      <label className="label">Thème</label>
      <select
        className="select select-bordered w-full max-w-xs"
        value={theme}
        onChange={(e) => setTheme(e.target.value as typeof theme)}
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}
