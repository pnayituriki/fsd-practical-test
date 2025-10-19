import React, { useMemo, useState } from "react";
import type { DecodedUser } from "../lib/protobuf";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useDeleteUser } from "../hooks/useDeleteUser";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { formatDate } from "../lib/utils";

type UsersTableProps = {
  users: DecodedUser[];
  filters: { search?: string; role?: string; status?: string };
  onOpen: (user: DecodedUser, mode: "create" | "edit" | "view") => void;
  initialPageSize?: number;
};

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  filters,
  onOpen,
  initialPageSize = 10,
}) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPageSize);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<DecodedUser | null>(null);

  const deleteUser = useDeleteUser();

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteUser.mutateAsync(selected.id!);
    } finally {
      setConfirmOpen(false);
      setSelected(null);
    }
  };

  const filtered = useMemo(() => {
    const q = (filters.search || "").toLowerCase();
    const role = filters.role || "";
    const status = filters.status || "";
    return users.filter(
      (u) =>
        (!q || u.email.toLowerCase().includes(q)) &&
        (!role || role === "all" || u.role === role) &&
        (!status || status === "all" || u.status === status)
    );
  }, [users, filters]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  if (page > totalPages) setPage(totalPages);

  if (filtered.length === 0) {
    return (
      <div className="border rounded-md p-6 text-center text-muted-foreground">
        No users found.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((u) => (
            <TableRow
              key={u.id ?? u.email}
              className="hover:bg-accent/5 cursor-pointer"
              onClick={() => onOpen(u, "view")}
            >
              <TableCell className="font-mono">{u.email}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {u.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={u.status === "active" ? "success" : "destructive"}
                  className="capitalize"
                >
                  {u.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(u.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(u, "view");
                  }}
                  className="cursor-pointer"
                >
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(u, "edit");
                  }}
                  variant="outline"
                  className="mx-2 cursor-pointer"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(u);
                    setConfirmOpen(true);
                  }}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Footer: page size + pager */}
      <div className="flex flex-wrap items-center gap-3 justify-between px-4 py-3 border-t bg-muted/20">
        <div className="text-sm text-muted-foreground">
          Showing <b>{start + 1}</b>–<b>{Math.min(start + perPage, total)}</b>{" "}
          of <b>{total}</b>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows:</span>
          <Select
            value={String(perPage)}
            onValueChange={(v) => {
              setPerPage(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              {selected ? (
                <>
                  Are you sure you want to delete this user:
                  <div className="mt-2 inline-block px-2 py-1 rounded bg-muted text-foreground font-semibold font-mono text-sm">
                    {selected.email}
                  </div>
                  ?
                </>
              ) : (
                "Are you sure you want to delete this user?"
              )}
              <br />
              <span className="text-destructive font-medium">
                This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setConfirmOpen(false)}
              disabled={deleteUser.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersTable;
