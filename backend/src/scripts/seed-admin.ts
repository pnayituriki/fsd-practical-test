import { UsersService } from "../modules/users/users.service";
import { logger } from "../utils/logger";

// Ensure DB schema exists
import "../db/migration";

(async () => {
  const svc = new UsersService();
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const u = svc.create(adminEmail, "admin", "active");
  logger.info({ "Seeded admin: ": u });
})();
