/**
 * Audit Log - Traçabilité totale
 */
import { prisma } from './prisma';

export async function createAuditLog(params: {
  action: string;
  entityType: string;
  entityId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}) {
  const data: Parameters<typeof prisma.auditLog.create>[0]['data'] = {
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
  };
  if (params.userId != null) data.userId = params.userId;
  if (params.ipAddress != null) data.ipAddress = params.ipAddress;
  if (params.userAgent != null) data.userAgent = params.userAgent;
  if (params.metadata != null) data.metadata = params.metadata as object;
  await prisma.auditLog.create({ data });
}
