import type { Metadata } from "next";
import PharmacyPage from "@/components/pharmacy/PharmacyPage";
import PinGate from "@/components/common/PinGate/PinGate";

export const metadata: Metadata = {
  title: "Pharmacy",
};

export default function PharmacyIndexPage() {
  return (
    <PinGate>
      <PharmacyPage />
    </PinGate>
  );
}
