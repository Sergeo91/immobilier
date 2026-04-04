import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken, getSessionToken } from '@/lib/auth';
import { clearDefaultDisplayCurrencyCache, getDefaultDisplayCurrency } from '@/lib/global-settings';
import { DISPLAY_CURRENCIES, type DisplayCurrency } from '@/lib/constants';

async function requireSuperAdmin() {
  const token = await getSessionToken();
  if (!token) return { error: NextResponse.json({ error: 'Non authentifié' }, { status: 401 }) };
  const payload = await verifyAccessToken(token);
  if (!payload || payload.role !== 'SUPER_ADMIN') {
    return { error: NextResponse.json({ error: 'Accès refusé' }, { status: 403 }) };
  }
  return { payload };
}

export async function GET() {
  const gate = await requireSuperAdmin();
  if ('error' in gate) return gate.error;

  const row = await prisma.settings.findUnique({ where: { key: 'global' } });
  const value = (row?.value as Record<string, unknown> | null) ?? {};
  const defaultCurrency = await getDefaultDisplayCurrency();

  return NextResponse.json({
    settings: {
      defaultCurrency,
      value,
      defaultTrialDurationDays: row?.defaultTrialDurationDays,
      isGlobalTrialEnabled: row?.isGlobalTrialEnabled,
      commissionPercentage: row?.commissionPercentage?.toString() ?? null,
      globalTheme: row?.globalTheme,
      maintenanceMode: row?.maintenanceMode,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const gate = await requireSuperAdmin();
  if ('error' in gate) return gate.error;

  const body = await req.json().catch(() => ({}));
  const nextCurrency = body.defaultCurrency as string | undefined;

  if (nextCurrency === undefined) {
    return NextResponse.json({ error: 'Champ defaultCurrency requis' }, { status: 400 });
  }

  if (!DISPLAY_CURRENCIES.includes(nextCurrency as DisplayCurrency)) {
    return NextResponse.json(
      { error: `Devise non supportée. Valeurs : ${DISPLAY_CURRENCIES.join(', ')}` },
      { status: 400 }
    );
  }

  const row = await prisma.settings.findUnique({ where: { key: 'global' } });
  const current = (row?.value as Record<string, unknown> | null) ?? {};

  await prisma.settings.upsert({
    where: { key: 'global' },
    create: {
      key: 'global',
      value: { ...current, defaultCurrency: nextCurrency },
      defaultTrialDurationDays: 14,
      isGlobalTrialEnabled: false,
      maintenanceMode: false,
    },
    update: {
      value: { ...current, defaultCurrency: nextCurrency },
    },
  });

  clearDefaultDisplayCurrencyCache();

  const defaultCurrency = await getDefaultDisplayCurrency();
  return NextResponse.json({ ok: true, defaultCurrency });
}
