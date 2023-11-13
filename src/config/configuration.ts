export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  cookieSecret: process.env.COOKIE_SECRET,
  sessionTtl: parseInt(process.env.SESSION_TTL_IN_MS, 10),
});

export type EnvVars = ReturnType<typeof configuration>;
