import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, CalendarDays, Check, ClipboardCheck, Cloud, Home, QrCode, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { SchoolSeal } from "@/components/school-seal";
import { formatLong, todayISO } from "@/lib/dates";
import { DEFAULT_SCHOOL } from "@/lib/school";
import { useSchoolStore } from "@/lib/store";
import { cn, downloadFile } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/ciclos", label: "Ciclos Escolares", icon: CalendarDays },
  { to: "/alumnos", label: "Alumnos", icon: Users },
  { to: "/asistencia", label: "Asistencia", icon: ClipboardCheck },
  { to: "/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/reportes", label: "Reportes", icon: BarChart3 },
  { to: "/nfc", label: "NFC/QR", icon: QrCode },
];

export function HydrateGate({ children }: { children: React.ReactNode }) {
  const hydrated = useSchoolStore((s) => s.hydrated);
  useEffect(() => {
    void useSchoolStore.persist.rehydrate();
    const t = window.setTimeout(() => {
      if (!useSchoolStore.getState().hydrated) useSchoolStore.setState({ hydrated: true });
    }, 800);
    return () => window.clearTimeout(t);
  }, []);
  if (!hydrated) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-header px-6 text-center text-primary-fg">
        <SchoolSeal className="size-16" />
        <p className="mt-3 text-2xl font-extrabold">Jaime Torres Bodet</p>
      </div>
    );
  }
  return children;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const school = useSchoolStore((s) => s.school);
  const cycle = useSchoolStore((s) => s.cycles.find((c) => c.id === s.activeCycleId));
  const exportSnapshot = useSchoolStore((s) => s.exportSnapshot);
  const [synced, setSynced] = useState(true);
  const todayLabel = formatLong(todayISO());
  const todayPretty = todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1);
  const stateShort = school.state === "Veracruz" ? "Ver." : school.state;

  function backup() {
    downloadFile(`respaldo-jtb-${new Date().toISOString().slice(0, 10)}.json`, exportSnapshot(), "application/json");
    setSynced(true);
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="no-print border-b-2 border-solid border-rule bg-header text-primary-fg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <SchoolSeal className="size-14 shrink-0 ring-2 ring-white" />
            <div className="min-w-0">
              <p className="truncate text-xl font-extrabold tracking-tight">{school.name.replace(/^Jardín de Niños\s+/i, "")}</p>
              <p className="truncate text-xs text-primary-fg/85">
                Jardín de Niños · {school.locality}, {stateShort} · Proceso {school.organization}
              </p>
              <p className="truncate text-xs text-primary-fg/75">
                {school.teacher} · Clave: {school.cct}
              </p>
            </div>
          </Link>
          <div className="hidden shrink-0 text-right sm:block">
            <p className="text-sm">{todayPretty}</p>
            <div className="mt-1 flex items-center justify-end gap-2">
              <Link to="/ciclos" className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                Ciclo {cycle?.name ?? "sin ciclo"}
              </Link>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                <span className="size-2 rounded-full bg-present" />
                {synced ? "Sincronizado" : "Guardando"}
                <Check className="size-3.5" />
              </span>
            </div>
          </div>
        </div>
        <nav className="bg-nav">
          <ul className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-2">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname === item.to;
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex h-12 items-center gap-2 px-3 text-sm font-bold whitespace-nowrap",
                      active ? "bg-white/15 text-white" : "text-white/80",
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="ml-auto flex items-center pr-1">
              <Link to="/escuela" className="px-2 text-xs font-bold whitespace-nowrap text-white/70">
                Escuela
              </Link>
              <button
                type="button"
                onClick={backup}
                className="my-1.5 flex h-9 items-center gap-2 rounded-lg bg-white/10 px-3 text-sm font-bold text-white"
              >
                <Cloud className="size-4" />
                <span className="size-2 rounded-full bg-present" />
                Sync
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-5">{children}</main>

      <button
        type="button"
        aria-label="Descargar respaldo"
        className="no-print fixed right-4 bottom-4 z-30 flex size-14 items-center justify-center rounded-full bg-present text-primary-fg shadow-card"
        onClick={backup}
      >
        <Cloud className="size-6" />
      </button>
      <p className="sr-only">{DEFAULT_SCHOOL.name}</p>
    </div>
  );
}
