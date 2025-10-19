import { useState } from "react";
import { Button } from "../components/ui/button";
import Filters, { type FiltersValue } from "../components/Filters";
import UsersTable from "../components/UsersTable";
import { useVerifiedUsers } from "../hooks/useVerifiedUsers";
import type { DecodedUser } from "../lib/protobuf";
import { UserDialog } from "../components/UserDialog";
import UserStats7d from "../components/UserStats7d";

const UsersPage = () => {
  const [filters, setFilters] = useState<FiltersValue>({});
  const [dialog, setDialog] = useState<{
    open: boolean;
    mode: "create" | "edit" | "view";
    user?: DecodedUser | null;
  }>({
    open: false,
    mode: "create",
  });

  const { data: users, isLoading, isError, error } = useVerifiedUsers();

  return (
    <section className="space-y-6 mx-8">
      <div className="sticky top-0 z-20 -mx-4 sm:mx-0 bg-background/75 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 sm:px-0 py-3 flex items-center gap-3 justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold">Users</h1>
          <div className="flex gap-2">
            <Button onClick={() => setDialog({ open: true, mode: "create" })}>
              New User
            </Button>
          </div>
        </div>
      </div>

      <UserStats7d />

      <Filters onChange={setFilters} />

      {isLoading && (
        <div className="border rounded-md p-6">Loading verified users…</div>
      )}
      {isError && (
        <div className="border rounded-md p-6 text-destructive">
          {(error as Error).message}
        </div>
      )}

      {users && (
        <UsersTable
          users={users}
          filters={filters}
          onOpen={(u, mode: "create" | "edit" | "view" = "view") =>
            setDialog({ open: true, mode: mode, user: u })
          }
          initialPageSize={10}
        />
      )}

      <UserDialog
        open={dialog.open}
        mode={dialog.mode}
        user={dialog.user}
        onClose={() => setDialog({ open: false, mode: "create" })}
      />
    </section>
  );
};

export default UsersPage;
