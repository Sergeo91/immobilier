import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  verifyRefreshToken,
  hashRefreshToken,
  createAccessToken,
  createRefreshToken,
} from '@/lib/auth';
import { getRefreshToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const refreshToken = (await getRefreshToken()) || req.cookies.get('refreshToken')?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }

  const hash = await hashRefreshToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hash },
    include: { user: true },
  });

  if (!stored || stored.expiresAt < new Date()) {
    await prisma.refreshToken.deleteMany({ where: { tokenHash: hash } });
    return NextResponse.json({ error: 'Refresh token expired' }, { status: 401 });
  }

  if (stored.user.isBlocked) {
    return NextResponse.json({ error: 'Account blocked' }, { status: 403 });
  }

  const [newAccess, newRefresh] = await Promise.all([
    createAccessToken({
      sub: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
    }),
    createRefreshToken(stored.user.id),
  ]);

  const newHash = await hashRefreshToken(newRefresh);
  await prisma.refreshToken.delete({ where: { id: stored.id } });
  await prisma.refreshToken.create({
    data: {
      tokenHash: newHash,
      userId: stored.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const cookieStore = await cookies();
  cookieStore.set('token', newAccess, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  });

  return NextResponse.json({ ok: true });
}
