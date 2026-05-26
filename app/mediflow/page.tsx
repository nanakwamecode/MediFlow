import type { Metadata } from "next";
import DashboardContent from "@/components/dashboard/DashboardContent";
import PinGate from "@/components/common/PinGate/PinGate";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardIndexPage() {
  return (
    <PinGate>
      <DashboardContent />
    </PinGate>
  );
}
