export function SchoolSeal({ className = "size-12" }: { className?: string }) {
  return (
    <img
      src="/seal.jpg"
      alt=""
      className={`rounded-full bg-white object-cover shadow-sm ${className}`}
    />
  );
}
