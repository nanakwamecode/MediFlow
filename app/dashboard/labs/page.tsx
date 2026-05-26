import type { Metadata } from "next";
import LabPage from "@/components/laboratory/LabPage";

export const metadata: Metadata = {
  title: "Laboratory",
};

export default function LabsIndexPage() {
  return <LabPage />;
}
