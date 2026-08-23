export interface DashboardStats {
  totalPatients: number;
  totalConsultations: number;
  pendingLabs: number;
  pendingPrescriptions: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch("/api/dashboard/stats");
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  const json = await res.json();
  return json.data;
}
