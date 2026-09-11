"use client";

import Link from "next/link";
import { workerLabel, type SstWorker } from "@/lib/sg-sst/workers/types";
import { SGSST_BASE } from "@/lib/sg-sst/nav";

type WorkerSelectProps = {
  workers: readonly SstWorker[];
  value: string | null | undefined;
  onChange: (worker: SstWorker | null) => void;
  includeRetired?: boolean;
  required?: boolean;
  className?: string;
};

export function WorkerSelect({
  workers,
  value,
  onChange,
  includeRetired = false,
  required = false,
  className = "",
}: Readonly<WorkerSelectProps>) {
  const options = includeRetired
    ? workers
    : workers.filter((worker) => worker.status === "activo" || worker.id === value);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <select
        className="w-full rounded-lg bg-surface-container-low px-sm py-sm font-body-sm text-body-sm"
        value={value ?? ""}
        required={required}
        onChange={(event) => {
          const id = event.target.value;
          onChange(options.find((worker) => worker.id === id) ?? null);
        }}
      >
        <option value="">Seleccionar trabajador…</option>
        {options.map((worker) => (
          <option key={worker.id} value={worker.id}>
            {workerLabel(worker)}
          </option>
        ))}
      </select>
      {options.length === 0 ? (
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          No hay trabajadores activos.{" "}
          <Link href={`${SGSST_BASE}/trabajadores/nuevo`} className="text-primary underline">
            Crear en base maestra
          </Link>
        </p>
      ) : (
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          Fuente:{" "}
          <Link href={`${SGSST_BASE}/trabajadores`} className="text-primary underline">
            Base maestra
          </Link>
        </p>
      )}
    </div>
  );
}
