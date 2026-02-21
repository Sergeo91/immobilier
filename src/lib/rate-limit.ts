/**
 * Rate limiting - anti brute force
 */
import { redisIncr } from './redis';

const MAX = parseInt(process.env.RATE_LIMIT_MAX || '100');
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000');

export async function checkRateLimit(identifier: string): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const key = `ratelimit:${identifier}:${Math.floor(Date.now() / WINDOW_MS)}`;
    const current = await redisIncr(key);
    return {
      allowed: current <= MAX,
      remaining: Math.max(0, MAX - current),
    };
  } catch {
    return { allowed: true, remaining: MAX };
  }
}
