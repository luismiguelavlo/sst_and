import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guards";
import { EmployeeProgressDashboard } from "@/components/dashboard/EmployeeProgressDashboard";
import { loadEmployeeProgressDashboard } from "@/lib/progress/repository";
import type { EmployeeProgressRow, EmployeeProgressStats } from "@/lib/employee-progress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tablero · Campus SST",
  description: "Seguimiento de avance, cierres y resultados de la formación SST de los empleados.",
};

const EMPTY_STATS: EmployeeProgressStats = {
  totalCompletions: 0,
  avgProgress: 0,
  activeEmployees: 0,
  previews: [],
};

export default async function DashboardPage() {
  await requireAdmin();
  let stats: EmployeeProgressStats = EMPTY_STATS;
  let rows: EmployeeProgressRow[] = [];
  try {
    const dashboard = await loadEmployeeProgressDashboard();
    stats = dashboard.stats;
    rows = dashboard.rows;
  } catch {
    stats = EMPTY_STATS;
    rows = [];
  }
  return <EmployeeProgressDashboard stats={stats} rows={rows} />;
}
