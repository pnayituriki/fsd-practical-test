import { BASE_URL } from "../constants/api";
import { apiFetch } from "../lib/fetcher";

const URL = `${BASE_URL}/crypto`;

export const getPublicKey = async (): Promise<string> => {
  return apiFetch<string>(`${URL}/public-key`);
};
