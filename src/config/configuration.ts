export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  cookieSecret: process.env.COOKIE_SECRET,
});

export type EnvVars = ReturnType<typeof configuration>;
