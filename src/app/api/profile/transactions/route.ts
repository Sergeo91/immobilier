import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken, getSessionToken } from '@/lib/auth';

export async function GET() {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  const payload = await verifyAccessToken(token);
  if (!payload) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [{ clientId: payload.sub }, { ownerId: payload.sub }],
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      type: true,
      status: true,
      amount: true,
      currency: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    transactions: transactions.map((t) => ({
      ...t,
      amount: t.amount.toString(),
      createdAt: t.createdAt.toISOString(),
    })),
  });
}
