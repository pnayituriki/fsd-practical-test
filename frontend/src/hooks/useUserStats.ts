import { useQuery } from "@tanstack/react-query";
import { fetchUserStats7d } from "../services/users.service";

export const useUserStats = () =>
  useQuery({
    queryKey: ["users-stats-7d"],
    queryFn: fetchUserStats7d,
    staleTime: 60_000,
  });
