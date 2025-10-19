import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";

export type FiltersValue = { search?: string; role?: string; status?: string };

const Filters=({ onChange }: { onChange: (v: FiltersValue) => void })=> {
  const [value, setValue] = useState<FiltersValue>({});

  const update = (next: Partial<FiltersValue>) => {
    const merged = { ...value, ...next };
    setValue(merged);
    onChange(merged);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Search by email"
        className="w-64"
        onChange={(e) => update({ search: e.target.value })}
      />

      <Select value={value.role ?? "all"}  onValueChange={(role) => update({ role })}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>

      <Select value={value.status ?? "all"}  onValueChange={(status) => update({ status })}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        className="ml-auto"
        onClick={() => {
          setValue({});
          onChange({});
        }}
      >
        Clear filters
      </Button>
    </div>
  );
}

export default Filters;