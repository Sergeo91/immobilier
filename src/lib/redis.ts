/**
 * Redis Client - BullMQ, cache, rate limiting
 */
import { createClient, type RedisClientType } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let client: RedisClientType | null = null;

export async function getRedis(): Promise<RedisClientType | null> {
  if (client) return client;
  try {
    client = createClient({ url: redisUrl });
    client.on('error', (err) => console.error('Redis error:', err));
    await client.connect();
    return client;
  } catch (err) {
    console.warn('Redis non disponible, fallback in-memory pour dev');
    return null;
  }
}

// Pour usage synchrone dans rate-limit
const memStore: Map<string, { count: number; expires: number }> = new Map();

export async function redisIncr(key: string): Promise<number> {
  const r = await getRedis();
  if (r) {
    const v = await r.incr(key);
    const ttl = await r.ttl(key);
    if (ttl === -1) await r.pExpire(key, 60000);
    return v;
  }
  const now = Date.now();
  const entry = memStore.get(key);
  if (!entry || entry.expires < now) {
    memStore.set(key, { count: 1, expires: now + 60000 });
    return 1;
  }
  entry.count++;
  return entry.count;
}
