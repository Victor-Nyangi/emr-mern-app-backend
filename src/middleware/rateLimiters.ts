import rateLimit from "express-rate-limit";

/**
 * Credential-guessing protection for the auth endpoints.
 *
 * Deliberately tighter than the global limiter: /auth/login is the one
 * route where a successful guess yields a long-lived token, and the
 * seeded accounts ship with weak passwords.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: "Too many authentication attempts. Try again later." },
});

/** Coarse backstop against scripted abuse of the rest of the API. */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests. Try again later." },
});
