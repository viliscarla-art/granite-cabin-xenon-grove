import { DAY_META } from "@/lib/calendar-sep";
import type { DayEntry } from "@/lib/types";
import { Badge } from "./ui/badge";

export function DayBadge({ entry, compact = false }: { entry?: DayEntry; compact?: boolean }) {
  if (!entry) return null;
  const meta = DAY_META[entry.type];
  return (
    <Badge tone={meta.tone === "class" ? "class" : meta.tone}>
      {compact ? meta.short : entry.label || meta.label}
    </Badge>
  );
}
