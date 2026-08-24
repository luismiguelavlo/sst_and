import "server-only";

import postgres from "postgres";

const globalForSql = globalThis as typeof globalThis & {
  campusSql?: ReturnType<typeof postgres>;
};

function sslForUrl(url: string): false | { rejectUnauthorized: boolean } {
  if (/localhost|127\.0\.0\.1/.test(url) || url.includes("sslmode=disable")) {
    return false;
  }
  return { rejectUnauthorized: false };
}

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL no está configurada.");
  }
  if (!globalForSql.campusSql) {
    globalForSql.campusSql = postgres(url, {
      max: 10,
      connect_timeout: 15,
      idle_timeout: 20,
      ssl: sslForUrl(url),
    });
  }
  return globalForSql.campusSql;
}
