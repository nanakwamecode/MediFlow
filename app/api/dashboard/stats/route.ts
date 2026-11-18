import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  patients,
  consultations,
  labInvestigations,
  prescriptions,
} from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { count, eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [patientCount] = await db
    .select({ value: count() })
    .from(patients);

  const [consultCount] = await db
    .select({ value: count() })
    .from(consultations);

  const [pendingLabCount] = await db
    .select({ value: count() })
    .from(labInvestigations)
    .where(eq(labInvestigations.status, "pending"));

  const [pendingRxCount] = await db
    .select({ value: count() })
    .from(prescriptions)
    .where(eq(prescriptions.status, "pending"));

  return NextResponse.json({
    data: {
      totalPatients: patientCount.value,
      totalConsultations: consultCount.value,
      pendingLabs: pendingLabCount.value,
      pendingPrescriptions: pendingRxCount.value,
    },
  });
}
