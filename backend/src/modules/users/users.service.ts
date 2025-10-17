import { randomUUID } from "crypto";
import { sha384, signHash } from "../../utils/crypto";
import { Errors } from "../../utils/http-error";
import { UsersRepo } from "./users.repo";
import type { User } from "./users.types";

export class UsersService {
  constructor(private repo = new UsersRepo()) {}

  all() {
    try {
      return this.repo.all();
    } catch (err) {
      throw Errors.Internal("Failed to fetch users");
    }
  }

  create(email: string, role: string, status: "active" | "inactive"): User {
    if (!email || !email.includes("@"))
      throw Errors.BadRequest("Invalid email");

    const normalizeEmail = email.trim();

    // check if email exist
    const existing = this.repo.findByEmail(normalizeEmail);
    if (!!existing) {
      throw Errors.Conflict(`User with email '${email}' already exists`);
    }

    try {
      const emailHash = sha384(normalizeEmail.trim());
      const signature = signHash(emailHash);
      const user: User = {
        id: randomUUID(),
        email,
        role,
        status,
        createdAt: Date.now(),
        emailHash,
        signature,
      };

      return this.repo.insert(user);
    } catch (err) {
      throw Errors.Internal("Failed to create user");
    }
  }

  update(id: string, patch: Partial<Pick<User, "email" | "role" | "status">>) {
    const existing = this.repo.findById(id);
    if (!existing) throw Errors.NotFound("User not found");

    // if email was provided check if not taken
    if (patch.email) {
      const normalized = patch.email.trim();
      const other = this.repo.findByEmail(normalized);

      // ensure not same user
      if (other && other.id !== id) {
        throw Errors.Conflict(
          `Email '${patch.email}' already in use by another user`
        );
      }

      // hash email before update it and update signature
      const emailHash = sha384(normalized);
      Object.assign(patch as any, {
        email: normalized,
        emailHash,
        signature: signHash(emailHash),
      });
    }

    try {
      return this.repo.update(id, patch as any);
    } catch (err) {
      throw Errors.Internal("Failed to update user");
    }
  }

  remove(id: string) {
    const existing = this.repo.findById(id);
    if (!existing) throw Errors.NotFound("User not found");

    try {
      this.repo.delete(id);
      return true;
    } catch (err) {
      throw Errors.Internal("Failed to delete user");
    }
  }

  analytics() {
    try {
      return this.repo.countCreatedByDaySince(7);
    } catch (err) {
      throw Errors.Internal("Failed to compute user graph");
    }
  }
}
