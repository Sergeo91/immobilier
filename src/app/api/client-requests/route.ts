import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken, getSessionToken } from '@/lib/auth';

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = await getSessionToken();
  if (!token) return null;
  const payload = await verifyAccessToken(token);
  return payload?.sub ?? null;
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (user?.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Réservé aux clients' }, { status: 403 });
  }

  const body = await req.json();
  const { propertyId, message } = body;
  if (!propertyId || !message?.trim()) {
    return NextResponse.json({ error: 'propertyId et message requis' }, { status: 400 });
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true, status: true },
  });
  if (!property) {
    return NextResponse.json({ error: 'Bien introuvable' }, { status: 404 });
  }
  if (['RENTED', 'SOLD'].includes(property.status)) {
    return NextResponse.json({ error: 'Bien non disponible' }, { status: 400 });
  }

  await prisma.clientRequest.create({
    data: {
      propertyId,
      clientId: userId,
      message: message.trim(),
      status: 'PENDING',
    },
  });

  return NextResponse.json({ ok: true });
}
