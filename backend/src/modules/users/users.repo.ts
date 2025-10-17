import { db } from "../../db/sqlite";
import type { CountCreateByDay, User } from "./users.types";

export class UsersRepo {
  insert(u: User) {
    const st = db.prepare(`INSERT INTO users
            (id, email, role, status, createdAt, emailHash, signature)
            VALUES (@id, @email, @role, @status, @createdAt, @emailHash, @signature)`);
    st.run(u);
    return u;
  }

  all() {
    return db
      .prepare("SELECT * FROM users ORDER BY createdAt DESC")
      .all() as User[];
  }

  findById(id: string) {
    return db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as
      | User
      | undefined;
  }

  findByEmail(email: string) {
    return db.prepare(`SELECT * FROM users WHERE LOWER(email) = ?`).get(email) as
      | User
      | undefined;
  }

  update(id: string, patch: Partial<User>) {
    const fields = Object.keys(patch);
    if (!fields.length) return this.findById(id);

    const sets = fields.map((f) => `${f}=@${f}`).join(",");
    db.prepare(`UPDATE users SET ${sets} WHERE id=@id`).run({ id, ...patch });
    return this.findById(id);
  }

  delete(id: string) {
    db.prepare(`DELETE FROM users WHERE id=?`).run(id);
  }

  countCreatedByDaySince(days: number) {
    return db
      .prepare(
        `
      WITH days AS (
        SELECT date('now','localtime','-${days - 1} days') AS d
        UNION ALL
        SELECT date(d,'+1 day') FROM days WHERE d < date('now','localtime')
      )
      SELECT d AS day,
             (SELECT count(*) FROM users WHERE date(createdAt/1000,'unixepoch','localtime') = d) AS count
      FROM days;
    `
      )
      .all() as CountCreateByDay[];
  }
}
