import protobufjs from "protobufjs";
import { fileURLToPath } from "url";
import { Errors } from "../../utils/http-error";

export const  exportUsersProtobuf=async(users:any[])=>{
    const protoPath = fileURLToPath(new URL("../../proto/user.proto",import.meta.url));

    const root = await protobufjs.load(protoPath);
    const UsersExport=root.lookupType("fsd_test.UsersExport");

    const payload = {users};
    const errMsg=UsersExport.verify(payload);
    if(errMsg) throw Errors.Internal(errMsg);

    const message=UsersExport.create(payload);
    const buffer=UsersExport.encode(message).finish();

    return buffer;
}