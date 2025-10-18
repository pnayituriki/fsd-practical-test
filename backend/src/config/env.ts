export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  DB_PATH: process.env.DB_PATH ?? "data/app.db",
  PORT: process.env.PORT ?? 4000,
  CRYPTO_KEY_DIR: process.env.CRYPTO_KEY_DIR,
};
export const isDev = env.NODE_ENV !== 'production';
