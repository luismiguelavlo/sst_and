import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error("DATABASE_URL no está configurada. Revisa .env.local");
}

const sql = postgres(url, {
  max: 1,
  ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false },
});

function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return { salt: salt.toString("hex"), hash: hash.toString("hex") };
}

const PHOTO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDxfbHJWFDefEFBAGSVz5N8JJ7QenI8U1Mb0gCalFGohLfzRyZvV9-BcstW2WDfs0z2EDDUdQsLwMXpFPWS-gPpweIcuvOByR0v1nRsqqb-Noe6Dlex2E4RNcdtmnXEGn2As7pAAXEd0-cip6-NwzFJBvEjPhGk0EVyY5NkAY1BDcFqjtKaGDwhGZaTg8QayNp5FjqAtA5s0YbzM5kUtivb3jvNlnlRdjyhjifwlplMdAkftiWoHviY";

const seeds = [
  {
    email: "e.vargas@empresa.com",
    password: "CampusAdmin1",
    name: "Elena Vargas",
    jobTitle: "Coordinadora SST",
    role: "admin",
    bio: "Lidero la formación en seguridad y salud en el trabajo: inducción, trabajo en alturas, riesgo eléctrico y cultura preventiva para todo el personal operativo.",
    cedula: null,
    status: "active",
  },
  {
    email: "andrea@empresa.com",
    password: "Contrasena123",
    name: "Andrea",
    jobTitle: "Administradora SST",
    role: "admin",
    bio: "Administro la plataforma de formación en seguridad y salud en el trabajo.",
    cedula: null,
    status: "active",
  },
  {
    email: "a.mercer@empresa.com",
    password: "CampusUser1",
    name: "Alex Mercer",
    jobTitle: "Operario de planta",
    role: "user",
    bio: "Participo en la formación SST de la planta: EPP, procedimientos seguros y reporte de condiciones inseguras.",
    cedula: "1-1111-1111",
    status: "active",
  },
  {
    email: "j.soto@empresa.com",
    password: "CampusUser1",
    name: "Javier Soto Vargas",
    jobTitle: "Empleado",
    role: "user",
    bio: "Participo en la formación SST de la planta.",
    cedula: "4-0231-0948",
    status: "active",
  },
  {
    email: "l.morales@empresa.com",
    password: "CampusUser1",
    name: "Lucía Morales",
    jobTitle: "Empleada",
    role: "user",
    bio: "Participo en la formación SST de la planta.",
    cedula: "1-1845-3392",
    status: "locked",
  },
  {
    email: "c.torres@empresa.com",
    password: "CampusUser1",
    name: "Carlos Torres",
    jobTitle: "Empleado",
    role: "user",
    bio: "Participo en la formación SST de la planta.",
    cedula: "3-0492-1104",
    status: "pending",
  },
];

async function main() {
  const schema = readFileSync(join(root, "db/schema.sql"), "utf8");
  await sql.unsafe(schema);
  const migrateQuizzes = readFileSync(join(root, "db/migrate-quizzes.sql"), "utf8");
  await sql.unsafe(migrateQuizzes);
  const migrateNotifications = readFileSync(join(root, "db/migrate-notifications.sql"), "utf8");
  await sql.unsafe(migrateNotifications);

  for (const user of seeds) {
    const { hash, salt } = hashPassword(user.password);
    await sql`
      INSERT INTO campus_sst.users (
        email, password_hash, password_salt, name, job_title, role, bio, photo_url, cedula, status
      )
      VALUES (
        ${user.email}, ${hash}, ${salt}, ${user.name}, ${user.jobTitle}, ${user.role},
        ${user.bio}, ${PHOTO}, ${user.cedula}, ${user.status}
      )
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        job_title = EXCLUDED.job_title,
        role = EXCLUDED.role,
        bio = EXCLUDED.bio,
        cedula = EXCLUDED.cedula,
        status = EXCLUDED.status,
        updated_at = now()
    `;
  }

  const [{ count }] = await sql`SELECT count(*)::int AS count FROM campus_sst.users`;
  const [{ courses }] = await sql`SELECT count(*)::int AS courses FROM campus_sst.courses`;
  console.log(`Listo. Usuarios: ${count}. Cursos: ${courses}.`);
  await sql.end();
}

main().catch(async (error) => {
  console.error(error);
  await sql.end({ timeout: 1 });
  process.exit(1);
});
