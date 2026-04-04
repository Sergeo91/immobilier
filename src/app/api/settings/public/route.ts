import { NextResponse } from 'next/server';
import { getDefaultDisplayCurrency } from '@/lib/global-settings';

export async function GET() {
  const defaultCurrency = await getDefaultDisplayCurrency();
  return NextResponse.json({ defaultCurrency });
}
