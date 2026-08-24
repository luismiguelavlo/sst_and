import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL missing");
}

console.log(
  "db",
  url.replace(/:[^:@/]+@/, ":****@").replace(/\?.*$/, ""),
);

const sql = postgres(url, {
  max: 1,
  ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false },
});

const tables = await sql`
  SELECT table_schema, table_name
  FROM information_schema.tables
  WHERE table_schema = 'campus_sst'
    AND table_name LIKE 'attendance%'
  ORDER BY table_name
`;

console.log("attendance tables:", tables);

await sql.end();
