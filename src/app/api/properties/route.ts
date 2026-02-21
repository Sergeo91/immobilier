import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  const surfaceMin = searchParams.get('surfaceMin');
  const isFurnished = searchParams.get('isFurnished');
  const countryId = searchParams.get('countryId');
  const cityId = searchParams.get('cityId');
  const idsParam = searchParams.get('ids');
  const ids = idsParam ? idsParam.split(',').filter(Boolean) : [];
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  const where: Record<string, unknown> = {
    isListed: true,
    status: { in: ['AVAILABLE', 'RESERVED'] },
  };

  if (ids.length) where.id = { in: ids };
  if (type) where.type = type;
  if (countryId) where.countryId = countryId;
  if (cityId) where.cityId = cityId;
  if (isFurnished === 'true') where.isFurnished = true;
  if (priceMin || priceMax) {
    where.price = {};
    if (priceMin) (where.price as Record<string, number>).gte = parseFloat(priceMin);
    if (priceMax) (where.price as Record<string, number>).lte = parseFloat(priceMax);
  }
  if (surfaceMin) where.surfaceArea = { gte: parseFloat(surfaceMin) };

  const properties = await prisma.property.findMany({
    where,
    take: Math.min(limit, 50),
    skip: offset,
    orderBy: { updatedAt: 'desc' },
    include: {
      media: { where: { type: 'IMAGE' }, take: 1 },
      city: { select: { name: true } },
      country: { select: { name: true } },
    },
  });

  const data = properties.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    type: p.type,
    status: p.status,
    price: p.price.toString(),
    surfaceArea: p.surfaceArea?.toString(),
    isFurnished: p.isFurnished,
    address: p.address,
    neighborhood: p.neighborhood,
    latitude: p.latitude ? Number(p.latitude) : null,
    longitude: p.longitude ? Number(p.longitude) : null,
    media: p.media.map((m) => ({ url: m.url, type: m.type })),
    city: p.city,
    country: p.country,
  }));

  return NextResponse.json({ properties: data });
}
