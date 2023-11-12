export const configuration = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
});

export type EnvVars = ReturnType<typeof configuration>;
