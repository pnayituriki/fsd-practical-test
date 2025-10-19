import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../services/users.service";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-verified"] });
      queryClient.invalidateQueries({ queryKey: ["users-stats-7d"] });
    },
  });
};
