import * as protobuf from "protobufjs";

const schema = `
syntax = "proto3";
package fsd_test;

message User {
  string id = 1;
  string email = 2;
  string role = 3;
  string status = 4;
  int64 createdAt = 5;
  string emailHash = 6;
  string signature = 7;
}

message UsersExport {
  repeated User users = 1;
}
`;

let root: protobuf.Root | null = null;

const getRoot = async () => {
  if (!root) root = protobuf.parse(schema).root;
  return root;
};

export type DecodedUser = {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  emailHash: string;
  signature: string;
};

export const decodeUsers = async (buffer: ArrayBuffer): Promise<DecodedUser[]> => {
  const r = await getRoot();
  const UsersExport = r.lookupType("fsd_test.UsersExport");
  const msg = UsersExport.decode(new Uint8Array(buffer));
  const obj = UsersExport.toObject(msg, {
    longs: String,
    enums: String,
    bytes: String,
    defaults: true,
  });

  return (obj.users || []) as DecodedUser[];
};
