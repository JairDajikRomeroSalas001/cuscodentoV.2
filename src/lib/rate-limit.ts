type Bucket = {
  count: number;
  resetAt: number;
};

const globalStore = globalThis as unknown as { __rateLimitBuckets?: Map<string, Bucket> };
const buckets = globalStore.__rateLimitBuckets ?? new Map<string, Bucket>();
if (!globalStore.__rateLimitBuckets) {
  globalStore.__rateLimitBuckets = buckets;
}

export async function rateLimit(
  key: string,
  namespace: string,
  maxRequests: number,
  windowSeconds: number
) {
  const now = Date.now();
  const bucketKey = `${namespace}:${key}`;
  const windowMs = windowSeconds * 1000;

  const current = buckets.get(bucketKey);
  if (!current || current.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    };
  }

  if (current.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  buckets.set(bucketKey, current);

  return {
    success: true,
    remaining: Math.max(0, maxRequests - current.count),
    resetAt: current.resetAt,
  };
}
