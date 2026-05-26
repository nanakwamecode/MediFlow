import type { Metadata } from "next";
import ConsultationsPage from "@/components/consultations/ConsultationsPage";
import PinGate from "@/components/common/PinGate/PinGate";

export const metadata: Metadata = {
  title: "Consultations",
};

export default function ConsultationsIndexPage() {
  return (
    <PinGate>
      <ConsultationsPage />
    </PinGate>
  );
}
