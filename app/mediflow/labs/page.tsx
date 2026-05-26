import type { Metadata } from "next";
import LabPage from "@/components/laboratory/LabPage";
import PinGate from "@/components/common/PinGate/PinGate";

export const metadata: Metadata = {
  title: "Laboratory",
};

export default function LabsIndexPage() {
  return (
    <PinGate>
      <LabPage />
    </PinGate>
  );
}
