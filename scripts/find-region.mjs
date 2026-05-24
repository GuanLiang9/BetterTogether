import pg from "pg";
import { config } from "dotenv";
config({ path: ".env.local" });

const { Client } = pg;
const ref = "ywzbjlxobdcctnseugjh";
const pass = process.env.SUPABASE_DATABASE_PASSWORD;

const attempts = [
  // Transaction pooler port 6543
  { host: `aws-0-ap-southeast-1.pooler.supabase.com`, port: 6543, user: `postgres.${ref}` },
  { host: `aws-0-us-east-1.pooler.supabase.com`,     port: 6543, user: `postgres.${ref}` },
  { host: `aws-0-eu-central-1.pooler.supabase.com`,  port: 6543, user: `postgres.${ref}` },
  // Plain postgres user
  { host: `aws-0-ap-southeast-1.pooler.supabase.com`, port: 6543, user: `postgres` },
  { host: `aws-0-ap-southeast-1.pooler.supabase.com`, port: 5432, user: `postgres` },
];

for (const cfg of attempts) {
  const client = new Client({ ...cfg, database: "postgres", password: pass, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 6000 });
  try {
    await client.connect();
    await client.query("SELECT 1");
    console.log(`✅ CONNECTED: host=${cfg.host} port=${cfg.port} user=${cfg.user}`);
    await client.end();
    process.exit(0);
  } catch (err) {
    console.log(`✗ ${cfg.port} ${cfg.user.slice(0, 20)}: ${err.message.slice(0, 70)}`);
    try { await client.end(); } catch {}
  }
}
console.log("\nAll attempts failed.");
