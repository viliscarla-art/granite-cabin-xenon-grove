import type { AttendanceMark } from "@/lib/types";
import { cn } from "@/lib/utils";

const OPTIONS: { mark: AttendanceMark; label: string; className: string }[] = [
  { mark: "P", label: "P", className: "data-[on=true]:bg-present data-[on=true]:text-primary-fg" },
  { mark: "A", label: "A", className: "data-[on=true]:bg-absent data-[on=true]:text-primary-fg" },
  { mark: "J", label: "J", className: "data-[on=true]:bg-justified data-[on=true]:text-primary-fg" },
  { mark: "R", label: "R", className: "data-[on=true]:bg-late data-[on=true]:text-primary-fg" },
];

export function MarkButtons({
  value,
  onChange,
}: {
  value?: AttendanceMark;
  onChange: (mark: AttendanceMark | undefined) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-1">
      {OPTIONS.map((opt) => {
        const on = value === opt.mark;
        return (
          <button
            key={opt.mark}
            type="button"
            data-on={on}
            aria-label={opt.mark}
            aria-pressed={on}
            onClick={() => onChange(on ? undefined : opt.mark)}
            className={cn(
              "h-11 rounded-md border border-border bg-surface text-sm font-semibold text-muted",
              opt.className,
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
