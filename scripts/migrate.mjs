// Run: node scripts/migrate.mjs
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const { Pool } = pg;
const __dir = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dir, "../supabase/migrations");

const pool = new Pool({
  host: "aws-0-ap-southeast-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.ywzbjlxobdcctnseugjh",
  password: process.env.SUPABASE_DATABASE_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const client = await pool.connect();
  try {
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const sql = readFileSync(join(migrationsDir, file), "utf8");
      console.log(`▶ Running ${file}...`);
      await client.query(sql);
      console.log(`✓ ${file} applied`);
    }
    console.log("\n✅ All migrations applied.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
