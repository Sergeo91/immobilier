import { prisma } from '@/lib/prisma';
import { DEFAULT_DISPLAY_CURRENCY, DISPLAY_CURRENCIES, type DisplayCurrency } from '@/lib/constants';

const TTL_MS = 60_000;
let cache: { currency: string; expires: number } | null = null;

function isDisplayCurrency(v: unknown): v is DisplayCurrency {
  return typeof v === 'string' && (DISPLAY_CURRENCIES as readonly string[]).includes(v);
}

export function clearDefaultDisplayCurrencyCache(): void {
  cache = null;
}

export async function getDefaultDisplayCurrency(): Promise<DisplayCurrency> {
  const now = Date.now();
  if (cache && now < cache.expires) {
    return isDisplayCurrency(cache.currency) ? cache.currency : DEFAULT_DISPLAY_CURRENCY;
  }

  const row = await prisma.settings.findUnique({ where: { key: 'global' } });
  const raw = row?.value as Record<string, unknown> | null;
  const c = raw?.defaultCurrency;
  const currency = isDisplayCurrency(c) ? c : DEFAULT_DISPLAY_CURRENCY;
  cache = { currency, expires: now + TTL_MS };
  return currency;
}
