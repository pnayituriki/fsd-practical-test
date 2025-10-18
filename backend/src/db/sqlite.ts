import fs from "fs";
import path from 'path';
import { env, isDev } from "../config/env";
import { logger } from "../utils/logger";
import Database from "better-sqlite3";
import type * as BetterSqlite3 from "better-sqlite3";


const dbDir = path.dirname(env.DB_PATH);

// Create db directory if not exists
if(!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir,{recursive: true});
    if(isDev) logger.info(`Created database directory: ${dbDir}`)
}

export  const db:BetterSqlite3.Database = new Database(env.DB_PATH);

db.pragma('journal_mode = WAL');

if (isDev) logger.info({ file: env.DB_PATH }, 'SQLite opened')