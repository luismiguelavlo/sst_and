import "server-only";

import { getSql } from "@/lib/db";
import { enrichRecordAsAlert } from "@/lib/sg-sst/alerts/engine";
import {
  getAlertSettings,
  listComplianceRecords,
} from "@/lib/sg-sst/alerts/repository";
import type {
  SstNotificationCenter,
  SstNotificationItem,
} from "@/lib/sg-sst/notificaciones/types";

export async function listSstNotificationCenter(
  userId: string,
): Promise<SstNotificationCenter> {
  const sql = getSql();
  const [settings, records] = await Promise.all([
    getAlertSettings(),
    listComplianceRecords({ includeClosed: false }),
  ]);

  let reads: { record_id: string }[] = [];
  try {
    reads = await sql<{ record_id: string }[]>`
      SELECT record_id::text
      FROM campus_sst.sst_alert_notification_reads
      WHERE user_id = ${userId}::uuid
    `;
  } catch {
    reads = [];
  }

  const readSet = new Set(reads.map((r) => r.record_id));
  const alerts = records
    .map((record) => enrichRecordAsAlert(record, settings))
    .filter(
      (a) =>
        a.semaphore === "critico" ||
        a.semaphore === "proximo" ||
        a.semaphore === "seguimiento",
    )
    .sort((a, b) => {
      const order = { critico: 0, proximo: 1, seguimiento: 2, vigente: 3 } as const;
      const d = order[a.semaphore] - order[b.semaphore];
      if (d !== 0) return d;
      return (a.daysRemaining ?? 9999) - (b.daysRemaining ?? 9999);
    });

  const items: SstNotificationItem[] = alerts.map((a) => ({
    id: a.id,
    title: a.title,
    body: `${a.subjectName}${a.dueDate ? ` · vence ${a.dueDate}` : ""} · ${a.semaphoreLabel}`,
    href: `/sg-sst/registros/${a.id}`,
    semaphore: a.semaphore,
    dueDate: a.dueDate,
    daysRemaining: a.daysRemaining,
    read: readSet.has(a.id),
    modulePath: a.modulePath,
    recordType: a.recordType,
  }));

  const unreadItems = items.filter((i) => !i.read);
  return {
    items,
    counts: {
      critico: items.filter((i) => i.semaphore === "critico").length,
      proximo: items.filter((i) => i.semaphore === "proximo").length,
      seguimiento: items.filter((i) => i.semaphore === "seguimiento").length,
      unread: unreadItems.length,
    },
  };
}

export async function markSstNotificationRead(
  userId: string,
  recordId: string,
): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO campus_sst.sst_alert_notification_reads (user_id, record_id, read_at)
    VALUES (${userId}::uuid, ${recordId}::uuid, now())
    ON CONFLICT (user_id, record_id) DO UPDATE SET read_at = now()
  `;
}

export async function markAllSstNotificationsRead(
  userId: string,
  recordIds: readonly string[],
): Promise<void> {
  if (recordIds.length === 0) return;
  const sql = getSql();
  for (const recordId of recordIds) {
    await sql`
      INSERT INTO campus_sst.sst_alert_notification_reads (user_id, record_id, read_at)
      VALUES (${userId}::uuid, ${recordId}::uuid, now())
      ON CONFLICT (user_id, record_id) DO UPDATE SET read_at = now()
    `;
  }
}
