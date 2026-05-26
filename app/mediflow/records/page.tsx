import type { Metadata } from "next";
import RecordsPage from "@/components/records/RecordsPage";
import PinGate from "@/components/common/PinGate/PinGate";

export const metadata: Metadata = {
  title: "Records",
};

export default function RecordsIndexPage() {
  return (
    <PinGate>
      <RecordsPage />
    </PinGate>
  );
}
