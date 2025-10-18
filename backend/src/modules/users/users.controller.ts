import type { Request, Response, NextFunction } from "express";
import { UsersService } from "./users.service";
import { sendSuccess } from "../../utils/response";
import { Errors } from "../../utils/http-error";
import { exportUsersProtobuf } from "./users.export";
import { vld } from "../../utils/validate";

type CreateBody = {
  email: string;
  role?: string;
  status?: "active" | "inactive";
};
type UpdateBody = Partial<CreateBody>;

export class UsersController {
  private service = new UsersService();

  all = (_req: Request, res: Response) => {
    const users = this.service.all();
    sendSuccess(res, "Users fetched successfully", users);
  };

  create = (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = vld.email(req.body.email, "email");
      const role = vld.str(req.body.role ?? "user");
      const status = vld.enum(
        req.body.status ?? "active",
        ["active", "inactive"],
        "status"
      );

      const created = this.service.create(email, role, status as any);
      sendSuccess(res, "User created successfully", created, 201);
    } catch (err) {
      next(err);
    }
  };

  update = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = vld.isUUID(req.params.id);

      if (Object.keys(req.body).length === 0) {
        throw Errors.BadRequest(
          "No valid fields provided for update. Expected at least one of: email, role, or status."
        );
      }

      const patch: UpdateBody = {};
      if (req.body.email !== undefined)
        patch.email = vld.email(req.body.email, "email");
      if (req.body.role !== undefined)
        patch.role = vld.enum(req.body.role, ["user", "admin"], "role");
      if (req.body.status !== undefined)
        patch.status = vld.enum(
          req.body.status,
          ["active", "inactive"],
          "status"
        ) as "active" | "inactive";

      const updated = this.service.update(id, patch);
      sendSuccess(res, "User updated successfully", updated);
    } catch (err) {
      next(err);
    }
  };

  remove = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = vld.isUUID(req.params.id);
      if (!id) throw Errors.BadRequest("User ID is required");
      this.service.remove(id);
      sendSuccess(res, "User deleted successfully");
    } catch (err) {
      next(err);
    }
  };

  graph7d = (_req: Request, res: Response) => {
    const data = this.service.graph7d();
    sendSuccess(res, "User creation stats (last 7 days)", data);
  };

  export = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = this.service.all();
      const buf = await exportUsersProtobuf(users);
      res.setHeader("Content-Type", "application/octet-stream");
      res.send(buf);
    } catch (err) {
      next(err);
    }
  };
}
