"use server";

import { requireAdmin } from "@/lib/auth/guards";
import {
  createWorkerUser,
  deleteWorkerUser,
  resetWorkerPassword,
  setWorkerStatus,
} from "@/lib/auth/users";
import { generatePassword, type CredentialStatus, type UserCredential } from "@/lib/credentials";

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

export type { CredentialStatus };
