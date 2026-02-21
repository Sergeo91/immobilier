import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken, getSessionToken } from '@/lib/auth';

export async function GET() {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  const payload = await verifyAccessToken(token);
  if (!payload || payload.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const [users, available, transactions, trials] = await Promise.all([
    prisma.user.count(),
    prisma.property.count({ where: { status: 'AVAILABLE' } }),
    prisma.transaction.count(),
    prisma.user.count({ where: { isTrialActive: true } }),
  ]);

  return NextResponse.json({
    stats: { users, available, transactions, trials },
  });
}
