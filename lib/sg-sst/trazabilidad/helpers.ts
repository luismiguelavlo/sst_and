import "server-only";

import type { SessionUser } from "@/lib/auth/types";
import { recordSstAudit } from "@/lib/sg-sst/trazabilidad/repository";
import {
  buildAuditSummary,
  buildImportAuditSummary,
  type SstAuditAction,
  type SstAuditDetails,
  type SstAuditModule,
} from "@/lib/sg-sst/trazabilidad/types";

type AuditActor = Pick<SessionUser, "id" | "name">;

type AuditEntityInput = {
  actor: AuditActor;
  module: SstAuditModule;
  entityType: string;
  entityId?: string | null;
  workerId?: string | null;
  subject: string;
  ofWhom?: string | null;
  focus?: string | null;
  details?: SstAuditDetails;
};

export async function auditEntityCreate(input: AuditEntityInput): Promise<void> {
  await recordSstAudit({
    actor: input.actor,
    action: "create",
    module: input.module,
    entityType: input.entityType,
    entityId: input.entityId,
    workerId: input.workerId,
    summary: buildAuditSummary({
      actorName: input.actor.name,
      verb: "creó",
      subject: input.subject,
      ofWhom: input.ofWhom,
    }),
    details: input.details,
  });
}

export async function auditEntityUpdate(input: AuditEntityInput): Promise<void> {
  await recordSstAudit({
    actor: input.actor,
    action: "update",
    module: input.module,
    entityType: input.entityType,
    entityId: input.entityId,
    workerId: input.workerId,
    summary: buildAuditSummary({
      actorName: input.actor.name,
      verb: "actualizó",
      subject: input.subject,
      ofWhom: input.ofWhom,
      focus: input.focus,
    }),
    details: input.details,
  });
}

export async function auditEntityDelete(input: AuditEntityInput): Promise<void> {
  await recordSstAudit({
    actor: input.actor,
    action: "delete",
    module: input.module,
    entityType: input.entityType,
    entityId: input.entityId,
    workerId: input.workerId,
    summary: buildAuditSummary({
      actorName: input.actor.name,
      verb: "eliminó",
      subject: input.subject,
      ofWhom: input.ofWhom,
    }),
    details: input.details,
  });
}

export async function auditEntityImport(input: {
  actor: AuditActor;
  module: SstAuditModule;
  entityType: string;
  subjectPlural: string;
  created: number;
  updated: number;
  failed: number;
  rows?: number;
}): Promise<void> {
  await recordSstAudit({
    actor: input.actor,
    action: "import",
    module: input.module,
    entityType: input.entityType,
    summary: buildImportAuditSummary({
      actorName: input.actor.name,
      subjectPlural: input.subjectPlural,
      created: input.created,
      updated: input.updated,
      failed: input.failed,
    }),
    details: {
      extra: {
        created: input.created,
        updated: input.updated,
        failed: input.failed,
        rows: input.rows ?? input.created + input.updated + input.failed,
      },
    },
  });
}

export async function auditCustom(input: {
  actor: AuditActor;
  action: SstAuditAction;
  module: SstAuditModule;
  summary: string;
  entityType?: string;
  entityId?: string | null;
  workerId?: string | null;
  details?: SstAuditDetails;
}): Promise<void> {
  await recordSstAudit(input);
}
