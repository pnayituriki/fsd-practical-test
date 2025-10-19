import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../services/users.service";

type UpdateUserArgs = {
  id: string;
  data: { role?: string; status?: string };
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateUserArgs) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-verified"] });
    },
  });
};
