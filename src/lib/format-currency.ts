/**
 * Affichage monétaire : séparateur de milliers « . », décimales avec « , » (usage FR).
 * XOF (F CFA) sans décimales.
 */

const DECIMALS: Record<string, number> = {
  BIF: 0,
  CLP: 0,
  DJF: 0,
  GNF: 0,
  ISK: 0,
  JPY: 0,
  KMF: 0,
  KRW: 0,
  PYG: 0,
  RWF: 0,
  UGX: 0,
  VND: 0,
  VUV: 0,
  XAF: 0,
  XOF: 0,
  XPF: 0,
};

function decimalsFor(currency: string): number {
  return DECIMALS[currency] ?? 2;
}

function groupThousandsDot(intPart: string): string {
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function currencySuffix(code: string): string {
  switch (code) {
    case 'XOF':
    case 'XAF':
      return 'F CFA';
    case 'EUR':
      return '€';
    default:
      return code;
  }
}

export function formatMoneyAmount(amount: number, currency: string): string {
  const d = decimalsFor(currency);
  const rounded = d === 0 ? Math.round(amount) : amount;
  const fixed = rounded.toFixed(d);
  const [intRaw, frac] = fixed.split('.');
  const intPart = groupThousandsDot(intRaw);
  const core = frac ? `${intPart},${frac}` : intPart;
  const suf = currencySuffix(currency);
  return `${core} ${suf}`;
}
