import { cn } from "@/lib/utils";

export function SelectField({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
