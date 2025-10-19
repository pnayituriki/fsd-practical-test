import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiErrorPayload } from "./fetcher";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching data.";

      toast.error("Something went wrong", {
        description: error instanceof Error ? message : "Unknown error",
      });
    },
  }),

  mutationCache: new MutationCache({
    onSuccess: (data) => {
      const message =
        typeof data === "object" && data !== null && "message" in data
          ? (data as { message?: string }).message
          : "Action completed successfully";

      toast.success("Success", {
        description: message,
      });
    },
    onError: (
      error: Error & { status?: number; payload?: ApiErrorPayload | null }
    ) => {
      const message =
        error.payload?.message ||
        error.message ||
        "An unexpected error occurred while performing this action.";

      console.error("[Mutation Error]", error);
      toast.error("Action failed", { description: message });
    },
  }),

  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
});
