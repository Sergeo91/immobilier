import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken, getSessionToken } from '@/lib/auth';

export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      kycVerified: true,
      isBlocked: true,
    },
  });

  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  if (user.isBlocked) return NextResponse.json({ user: null }, { status: 403 });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      kycVerified: user.kycVerified,
    },
  });
}
