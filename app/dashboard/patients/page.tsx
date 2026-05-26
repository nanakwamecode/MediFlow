import type { Metadata } from "next";
import PatientsPageClient from "@/components/patients/PatientsPageClient";

export const metadata: Metadata = {
  title: "Patients",
};

export default function PatientsIndexPage() {
  return <PatientsPageClient />;
}
