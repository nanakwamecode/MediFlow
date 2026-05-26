import type { Metadata } from "next";
import PharmacyPage from "@/components/pharmacy/PharmacyPage";

export const metadata: Metadata = {
  title: "Pharmacy",
};

export default function PharmacyIndexPage() {
  return <PharmacyPage />;
}
