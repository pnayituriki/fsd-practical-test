import { BASE_URL } from "../constants/api";
import type { UserStatsResponse } from "../constants/types";
import { importPublicKey, verifySignature } from "../lib/crypto";
import { apiFetch } from "../lib/fetcher";
import { decodeUsers, type DecodedUser } from "../lib/protobuf";
import { getPublicKey } from "./crypto.service";

const URL = `${BASE_URL}/users`;

export const fetchVerifiedUsers = async (): Promise<DecodedUser[]> => {
  const [buffer, publicKeyPem] = await Promise.all([
    apiFetch<ArrayBuffer>(`${URL}/export`, { method: "GET" }),
    getPublicKey(),
  ]);

  const users = await decodeUsers(buffer);

  let publicKey;
  try {
    publicKey = await importPublicKey(publicKeyPem);
  } catch (error) {
    console.error(error);
  }

  const verified: DecodedUser[] = [];
  for (const user of users) {
    const isValid = await verifySignature(
      user.email,
      user.signature,
      publicKey!
    );
    if (isValid) verified.push(user);
  }

  return verified;
};

export const createUser = async (data: {
  email: string;
  role?: string;
  status?: string;
}) => {
  return apiFetch(URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateUser = async (
  id: string,
  data: { email?: string; role?: string; status?: string }
) => {
  return apiFetch(`${URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (
  id: string,
) => {
  return apiFetch(`${URL}/${id}`, {
    method: "DELETE",
  });
};

export const fetchUserStats7d = async (): Promise<UserStatsResponse> => {
  return apiFetch<UserStatsResponse>(`${URL}/graph/last7d`, {
    method: "GET",
  });
};