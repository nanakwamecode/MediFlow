import type { Metadata } from "next";
import RecordsPage from "@/components/records/RecordsPage";

export const metadata: Metadata = {
  title: "Records",
};

export default function RecordsIndexPage() {
  return <RecordsPage />;
}
