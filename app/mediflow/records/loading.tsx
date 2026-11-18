import { TableSkeleton } from "@/components/common/Skeleton";

export default function Loading() {
  return <TableSkeleton rows={7} cols={4} />;
}
