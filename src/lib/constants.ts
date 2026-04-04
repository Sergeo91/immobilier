/**
 * Constantes applicatives
 */
export const APP_NAME = 'Achat Location';
export const SUPER_ADMIN_PATH = process.env.SUPER_ADMIN_SECRET_PATH || 'ss91-admin-global';

export const PROPERTY_STATUS = {
  AVAILABLE: 'Disponible',
  RESERVED: 'Réservé',
  RENTED: 'Loué',
  SOLD: 'Vendu',
  OCCUPIED: 'Occupé',
  PENDING_VALIDATION: 'En validation',
  SUSPENDED: 'Suspendu',
  ARCHIVED: 'Archivé',
} as const;

export const PROPERTY_TYPES = {
  LAND: 'Terrain',
  HOUSE: 'Maison',
  APARTMENT: 'Appartement',
  ROOM: 'Chambre',
  PASSING_ROOM: 'Chambre de passage',
  HOTEL: 'Hôtel',
  COMMERCIAL: 'Commercial',
} as const;

export const LOCALES = ['fr', 'en', 'zh', 'es', 'ar'] as const;
export const DEFAULT_LOCALE = 'fr';

/** Devises affichables (paramètre global modifiable par super-admin). Code ISO 4217. */
export const DISPLAY_CURRENCIES = ['XOF', 'EUR', 'USD', 'GBP', 'MAD'] as const;
export type DisplayCurrency = (typeof DISPLAY_CURRENCIES)[number];
export const DEFAULT_DISPLAY_CURRENCY: DisplayCurrency = 'XOF';
