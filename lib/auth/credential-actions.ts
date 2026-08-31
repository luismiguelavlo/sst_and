"use server";

import { requireAdmin } from "@/lib/auth/guards";
import {
  createWorkerUser,
  deleteWorkerUser,
  resetWorkerPassword,
  setWorkerStatus,
} from "@/lib/auth/users";
import {
  generatePassword,
  getLoginUrl,
  type CredentialStatus,
  type UserCredential,
} from "@/lib/credentials";
import {
  validateBulkImportRow,
  type BulkImportInputRow,
  type BulkImportResultRow,
} from "@/lib/credentials/bulk-import";

export type WorkerActionResult =
  | { ok: true; credential?: UserCredential; password?: string }
  | { ok: false; error: string };

export async function createWorkerAccount(input: {
  name: string;
  email: string;
  cedula: string;
  password: string;
}): Promise<WorkerActionResult> {
  await requireAdmin();
  try {
    const credential = await createWorkerUser({
      name: input.name,
      email: input.email,
      cedula: input.cedula,
      password: input.password,
      status: "active",
    });
    return { ok: true, credential };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "No se pudo crear el acceso." };
  }
}

export async function unlockWorkerAccount(id: string): Promise<WorkerActionResult> {
  await requireAdmin();
  await setWorkerStatus(id, "active");
  return { ok: true };
}

export async function resetWorkerAccountPassword(id: string): Promise<WorkerActionResult> {
  await requireAdmin();
  const password = generatePassword();
  await resetWorkerPassword(id, password);
  return { ok: true, password };
}

export async function revokeWorkerAccount(id: string): Promise<WorkerActionResult> {
  await requireAdmin();
  await deleteWorkerUser(id);
  return { ok: true };
}

const BULK_IMPORT_MAX_ROWS = 500;

export type BulkCreateWorkerAccountsResult =
  | {
      ok: true;
      results: BulkImportResultRow[];
      credentials: UserCredential[];
      createdCount: number;
    }
  | { ok: false; error: string };

export async function bulkCreateWorkerAccounts(
  rows: BulkImportInputRow[],
): Promise<BulkCreateWorkerAccountsResult> {
  await requireAdmin();

  if (rows.length === 0) {
    return { ok: false, error: "No hay filas para importar." };
  }
  if (rows.length > BULK_IMPORT_MAX_ROWS) {
    return {
      ok: false,
      error: `Máximo ${BULK_IMPORT_MAX_ROWS} filas por importación.`,
    };
  }

  const invitationLink = getLoginUrl();
  const seenEmails = new Set<string>();
  const results: BulkImportResultRow[] = [];
  const credentials: UserCredential[] = [];

  for (const row of rows) {
    const validationError = validateBulkImportRow(row);
    const emailKey = row.email.trim().toLowerCase();

    if (validationError) {
      results.push({
        ...row,
        password: "",
        invitationLink,
        status: validationError,
      });
      continue;
    }

    if (seenEmails.has(emailKey)) {
      results.push({
        ...row,
        password: "",
        invitationLink,
        status: "Correo duplicado en el archivo.",
      });
      continue;
    }
    seenEmails.add(emailKey);

    const password = generatePassword();
    try {
      const credential = await createWorkerUser({
        name: row.name.trim(),
        email: row.email.trim(),
        cedula: row.cedula.trim(),
        password,
        status: "active",
        jobTitle: row.jobTitle.trim() || "Empleado",
      });
      credentials.push(credential);
      results.push({
        ...row,
        password,
        invitationLink,
        status: "Creado",
      });
    } catch (error) {
      results.push({
        ...row,
        password: "",
        invitationLink,
        status: error instanceof Error ? error.message : "No se pudo crear el acceso.",
      });
    }
  }

  return { ok: true, results, credentials, createdCount: credentials.length };
}

export type { CredentialStatus };
