/**
 * Liste des thèmes DaisyUI disponibles pour le sélecteur
 */
export const THEME_IDS = [
  'dark',
  'light',
  'luxury',
  'business',
  'corporate',
  'coffee',
  'cyberpunk',
  'highcontrast',
  'system',
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

/** Labels par défaut (français) - les autres langues via i18n */
export const THEME_LABELS: Record<ThemeId, string> = {
  dark: 'Sombre',
  light: 'Clair',
  luxury: 'Luxe',
  business: 'Business',
  corporate: 'Corporate',
  coffee: 'Café',
  cyberpunk: 'Cyberpunk',
  highcontrast: 'Contraste élevé',
  system: 'Système',
};
