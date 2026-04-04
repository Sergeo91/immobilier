import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken, getSessionToken } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (payload.role !== 'OWNER') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const properties = await prisma.property.findMany({
    where: { ownerId: payload.sub },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      price: true,
      currency: true,
    },
  });

  return NextResponse.json({
    properties: properties.map((p) => ({
      ...p,
      price: p.price.toString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  const payload = await verifyAccessToken(token);
  if (!payload || payload.role !== 'OWNER') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, type, price, surfaceArea, address, neighborhood, postalCode, countryId, cityId, isFurnished } = body;
  if (!title || !description || !type || !price || !address || !countryId || !cityId) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const slug = slugify(title) + '-' + Date.now();
  const property = await prisma.property.create({
    data: {
      slug,
      title,
      description,
      type,
      price: parseFloat(price),
      surfaceArea: surfaceArea ? parseFloat(surfaceArea) : null,
      address,
      neighborhood: neighborhood || null,
      postalCode: postalCode || null,
      countryId,
      cityId,
      isFurnished: !!isFurnished,
      durationType: type === 'LAND' ? null : 'LONG',
      ownerId: payload.sub,
    },
  });

  return NextResponse.json({ property: { id: property.id, slug: property.slug } });
}
