import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { cn } from "../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { useCreateUser } from "../hooks/useCreateUser";
import { useUpdateUser } from "../hooks/useUpdateUser";

const userSchema = z.object({
  email: z.string().email("Invalid email"),
  role: z.enum(["admin", "user"]),
  status: z.enum(["active", "inactive"]),
});

export type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  user_id?: string;
  defaultValues?: Partial<UserFormValues>;
  disabled?: boolean;
  mode: "view" | "create" | "edit";
  onClose?(): void;
}

export const UserForm: React.FC<UserFormProps> = ({
  user_id,
  defaultValues,
  disabled,
  mode,
  onClose,
}) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      role: undefined,
      status: "active",
      ...defaultValues,
    },
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<UserFormValues | null>(
    null
  );

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const isLoading = createUser.isPending || updateUser.isPending;

  const handleSubmit = async (values: UserFormValues) => {
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingValues) return;
    try {
      if (mode === "create") {
        await createUser.mutateAsync(pendingValues);
      } else if (mode === "edit" && user_id) {
        await updateUser.mutateAsync({ id: user_id, data: pendingValues });
      }
      onClose?.();
    } finally {
      setConfirmOpen(false);
      setPendingValues(null);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={cn(
            "space-y-4",
            disabled && "opacity-75 pointer-events-none"
          )}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="user@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            disabled={isLoading}
          />

          <div className="flex flex-wrap gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem
                  className={
                    mode !== "create" ? "flex-1 min-w-[160px]" : "w-full"
                  }
                >
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
              disabled={isLoading}
            />

            {mode !== "create" && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-[160px]">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
                disabled={isLoading}
              />
            )}
          </div>

          {mode !== "view" && (
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                ? "Create"
                : "Save changes"}
            </Button>
          )}
        </form>
      </Form>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {mode === "create" ? "Create user?" : "Save changes?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {mode === "create"
                ? "Are you sure you want to create this user?"
                : "Confirm saving the changes for this user."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setConfirmOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
              {isLoading
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
