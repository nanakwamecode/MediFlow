import type { Metadata } from "next";
import VitalsPage from "@/components/vitals/VitalsPage";

export const metadata: Metadata = {
  title: "Vitals",
};

export default function VitalsIndexPage() {
  return <VitalsPage />;
}
