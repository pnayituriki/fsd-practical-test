export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  DB_PATH: process.env.DB_PATH ?? "data/app.db",
  PORT: process.env.PORT ?? 4000,
};
export const isDev = env.NODE_ENV !== 'production';
