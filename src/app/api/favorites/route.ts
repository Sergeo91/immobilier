import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken, getSessionToken } from '@/lib/auth';

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = await getSessionToken();
  if (!token) return null;
  const payload = await verifyAccessToken(token);
  return payload?.sub ?? null;
}

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ ids: [] });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { propertyId: true },
  });

  return NextResponse.json({ ids: favorites.map((f) => ({ propertyId: f.propertyId })) });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const body = await req.json();
  const { propertyId } = body;
  if (!propertyId) {
    return NextResponse.json({ error: 'propertyId requis' }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_propertyId: { userId, propertyId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ action: 'removed' });
  } else {
    await prisma.favorite.create({
      data: { userId, propertyId },
    });
    return NextResponse.json({ action: 'added' });
  }
}
