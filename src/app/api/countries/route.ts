import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const countries = await prisma.country.findMany({
    where: { isActive: true, isSuspended: false },
    include: { cities: true },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({
    countries: countries.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      cities: c.cities.map((city) => ({ id: city.id, name: city.name, slug: city.slug })),
    })),
  });
}
