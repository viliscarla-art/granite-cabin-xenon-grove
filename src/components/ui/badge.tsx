import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
  {
    variants: {
      tone: {
        default: "bg-bg-warm text-muted",
        class: "bg-primary-soft text-primary",
        sep: "bg-sep-soft text-sep",
        break: "bg-break-soft text-break",
        staff: "bg-staff-soft text-staff",
        weekend: "bg-transparent text-subtle",
        present: "bg-primary-soft text-present",
        absent: "bg-absent-soft text-absent",
        justified: "bg-justified-soft text-justified",
        late: "bg-late-soft text-late",
        danger: "bg-absent-soft text-absent",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
