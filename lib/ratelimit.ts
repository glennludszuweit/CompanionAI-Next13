import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export async function rateLimit(identifier: string) {
  const limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
    prefix: '@upstash/ratelimit',
  });

  const result = await limiter.limit(identifier);
  return result;
}
