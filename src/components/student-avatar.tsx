import type { Student } from "@/lib/types";
import { cn } from "@/lib/utils";

const SIZE = {
  sm: "size-10 text-xs",
  md: "size-14 text-sm",
  lg: "size-36 text-3xl",
};

export function StudentAvatar({
  student,
  size = "md",
  className,
}: {
  student: Pick<Student, "givenName" | "familyName" | "photo">;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  const initials = `${student.givenName.charAt(0)}${student.familyName.charAt(0)}`.toUpperCase() || "?";
  if (student.photo) {
    return (
      <img
        src={student.photo}
        alt=""
        className={cn("rounded-full object-cover ring-4 ring-white", SIZE[size], className)}
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary-soft font-bold text-primary ring-4 ring-white",
        SIZE[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}
