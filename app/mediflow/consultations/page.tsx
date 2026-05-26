import type { Metadata } from "next";
import ConsultationsPage from "@/components/consultations/ConsultationsPage";

export const metadata: Metadata = {
  title: "Consultations",
};

export default function ConsultationsIndexPage() {
  return <ConsultationsPage />;
}
