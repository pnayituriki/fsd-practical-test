import { useQuery } from "@tanstack/react-query";
import type { DecodedUser } from "../lib/protobuf";
import { fetchVerifiedUsers } from "../services/users.service";

export const useVerifiedUsers = () => {
  return useQuery<DecodedUser[], Error>({
    queryKey: ["users-verified"],
    queryFn: fetchVerifiedUsers,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
