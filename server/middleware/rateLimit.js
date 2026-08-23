const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map();

export const loginRateLimit = (req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now >= entry.resetAt) {
    if (attempts.size > 10000) {
      for (const [k, v] of attempts) {
        if (now >= v.resetAt) attempts.delete(k);
      }
    }
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  entry.count += 1;

  if (entry.count > MAX_ATTEMPTS) {
    return res.status(429).json({ error: "Too many attempts, try again later" });
  }

  next();
};
