import type { Metadata } from "next";
import PatientsPageClient from "@/components/patients/PatientsPageClient";
import PinGate from "@/components/common/PinGate/PinGate";

export const metadata: Metadata = {
  title: "Patients",
};

export default function PatientsIndexPage() {
  return (
    <PinGate>
      <PatientsPageClient />
    </PinGate>
  );
}
