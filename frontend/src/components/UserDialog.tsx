import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import type { DecodedUser } from "../lib/protobuf";
import type React from "react";
import { UserForm, type UserFormValues } from "./UserForm";

interface UserDialogProps {
  open: boolean;
  mode: "create" | "edit" | "view";
  user?: DecodedUser | null;
  onClose: () => void;
}

export const UserDialog: React.FC<UserDialogProps> = ({
  open,
  mode,
  user,
  onClose,
}) => {
  const title =
    mode === "create"
      ? "Create User"
      : mode === "edit"
      ? "Edit User"
      : "User Details";
  const isView = mode === "view";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isView
              ? "View user details information."
              : "Fill in the user details below."}
          </DialogDescription>
        </DialogHeader>

        <UserForm
          user_id={user?.id}
          defaultValues={
            user
              ? ({
                  email: user.email,
                  role: user.role,
                  status: user.status,
                } as UserFormValues)
              : undefined
          }
          disabled={isView}
          mode={mode}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
