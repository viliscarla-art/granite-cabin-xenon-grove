import type { SchoolProfile } from "./types";

export const DEFAULT_SCHOOL: SchoolProfile = {
  name: "Jardín de Niños Jaime Torres Bodet",
  shortName: "JDN Jaime Torres Bodet",
  cct: "30EJN1426K",
  organization: "Unitario",
  level: "Preescolar",
  teacher: "Mtra. Carla Berenice Vilis Álvarez",
  locality: "Xochitla",
  state: "Veracruz",
};

export const GRADE_LABELS: Record<"1" | "2" | "3", { name: string; shortName: string }> = {
  "1": { name: "Primer grado", shortName: "1°" },
  "2": { name: "Segundo grado", shortName: "2°" },
  "3": { name: "Tercer grado", shortName: "3°" },
};
