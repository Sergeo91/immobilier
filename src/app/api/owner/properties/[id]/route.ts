import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken, getSessionToken } from '@/lib/auth';

async function checkOwner(id: string) {
  const token = await getSessionToken();
  if (!token) return null;
  const payload = await verifyAccessToken(token);
  if (!payload || payload.role !== 'OWNER') return null;
  return payload.sub;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ownerId = await checkOwner(params.id);
  if (!ownerId) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

  const property = await prisma.property.findFirst({
    where: { id: params.id, ownerId },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      price: true,
      surfaceArea: true,
      address: true,
      neighborhood: true,
    },
  });

  if (!property) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 });

  return NextResponse.json({
    property: {
      ...property,
      price: property.price.toString(),
      surfaceArea: property.surfaceArea?.toString() || '',
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ownerId = await checkOwner(params.id);
  if (!ownerId) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

  const property = await prisma.property.findFirst({
    where: { id: params.id, ownerId },
  });
  if (!property) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 });

  const body = await req.json();
  const { title, description, status, price, surfaceArea, address, neighborhood } = body;

  const oldStatus = property.status;
  const newStatus = status || oldStatus;

  // Audit log pour changement de statut
  if (newStatus !== oldStatus) {
    await prisma.propertyStatusHistory.create({
      data: {
        propertyId: property.id,
        oldStatus,
        newStatus,
        reason: 'Modification par le propriétaire',
        userId: ownerId,
      },
    });
  }

  await prisma.property.update({
    where: { id: params.id },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(status && { status }),
      ...(price != null && { price: parseFloat(price) }),
      ...(surfaceArea != null && { surfaceArea: surfaceArea ? parseFloat(surfaceArea) : null }),
      ...(address && { address }),
      ...(neighborhood !== undefined && { neighborhood: neighborhood || null }),
    },
  });

  return NextResponse.json({ ok: true });
}
