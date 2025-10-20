const envUrl = import.meta.env.VITE_API_URL;
const isProd =
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";

export const BASE_URL =
  envUrl ||
  (isProd
    ? "https://fsd-practical-test.onrender.com/api"
    : "http://localhost:4000/api");
