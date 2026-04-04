'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  DEFAULT_DISPLAY_CURRENCY,
  DISPLAY_CURRENCIES,
  type DisplayCurrency,
} from '@/lib/constants';

const CurrencyContext = createContext<DisplayCurrency>(DEFAULT_DISPLAY_CURRENCY);

export function CurrencyProvider({
  initialCurrency,
  children,
}: {
  initialCurrency: DisplayCurrency;
  children: ReactNode;
}) {
  const [currency, setCurrency] = useState<DisplayCurrency>(initialCurrency);

  useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  useEffect(() => {
    fetch('/api/settings/public')
      .then((r) => r.json())
      .then((d: { defaultCurrency?: string }) => {
        if (d.defaultCurrency && DISPLAY_CURRENCIES.includes(d.defaultCurrency as DisplayCurrency)) {
          setCurrency(d.defaultCurrency as DisplayCurrency);
        }
      })
      .catch(() => {});
  }, []);

  return <CurrencyContext.Provider value={currency}>{children}</CurrencyContext.Provider>;
}

export function useDisplayCurrency(): DisplayCurrency {
  return useContext(CurrencyContext);
}
