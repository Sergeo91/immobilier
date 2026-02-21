import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createAccessToken, createRefreshToken, hashRefreshToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { createAuditLog } from '@/lib/audit';
import { cookies } from 'next/headers';

const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  const { allowed } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: 'Trop de tentatives' }, { status: 429 });
  }

  const body = await req.json();
  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
  }

  if (user.isBlocked) {
    return NextResponse.json({ error: 'Compte bloqué' }, { status: 403 });
  }

  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) {
    return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
  }

  const [accessToken, refreshToken] = await Promise.all([
    createAccessToken({ sub: user.id, email: user.email, role: user.role }),
    createRefreshToken(user.id),
  ]);

  const refreshHash = await hashRefreshToken(refreshToken);
  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createAuditLog({
    action: 'LOGIN',
    entityType: 'User',
    entityId: user.id,
    userId: user.id,
    ipAddress: ip,
    userAgent: req.headers.get('user-agent') || undefined,
  });

  const cookieStore = await cookies();
  cookieStore.set('token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 min
    path: '/',
  });
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/api/auth/refresh',
  });

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
