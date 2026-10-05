// Digitális műszerfal irány: a kronobiológiai számítás adatai legyenek determinisztikusak,
// visszakövethetők és a kék–zöld–piros szintkódot adják tovább a felületnek.

import { normativeProfiles } from "./normativeProfiles";

export type LevelKey = "physical" | "emotional" | "intellectual";

export interface LevelResult {
  key: LevelKey;
  label: string;
  marker: number;
  right: number;
  left: number;
  rightLabel: string;
  leftLabel: string;
  color: "blue" | "green" | "red";
}

export interface ChronobiologyResult {
  name: string;
  birthDate: string;
  markers: Record<LevelKey, number>;
  levels: LevelResult[];
  rightBrain: number;
  leftBrain: number;
  bodyRight: number;
  bodyLeft: number;
  jin: number;
  jang: number;
  total: number;
}

const EPOCH = "1999-01-01";
const PERIODS: Record<LevelKey, number> = {
  physical: 23,
  emotional: 28,
  intellectual: 33,
};

const levelMeta: Record<LevelKey, Omit<LevelResult, "marker" | "right" | "left">> = {
  intellectual: {
    key: "intellectual",
    label: "Intellektuális",
    rightLabel: "fantázia",
    leftLabel: "logika",
    color: "blue",
  },
  emotional: {
    key: "emotional",
    label: "Érzelmi",
    rightLabel: "fogadás",
    leftLabel: "adás",
    color: "green",
  },
  physical: {
    key: "physical",
    label: "Fizikai",
    rightLabel: "türelem",
    leftLabel: "aktivitás",
    color: "red",
  },
};

function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }
  return parsed;
}

function dayDifference(date: Date, epoch: Date): number {
  return Math.round((date.getTime() - epoch.getTime()) / 86_400_000);
}

function cycleMarker(delta: number, period: number, epochMarker: number): number {
  return ((epochMarker - 1 - delta) % period + period) % period + 1;
}

function profileFor(level: LevelKey, marker: number) {
  const profile = normativeProfiles[level][marker];
  // Hiányzó forrásadat helyett nem készítünk mesterséges százalékértékeket.
  if (!profile) throw new Error(`Hiányzó markerprofil: ${level}/${marker}`);
  return profile;
}

// A PDF-táblák naptári alapképlete, külön ellenőrzési referenciaként.
// A termék az eredeti program adatbázisával egyező markereket használja.
export function calculateTableMarkers(birthDate: string): Record<LevelKey, number> | null {
  const date = parseDate(birthDate);
  if (!date || validateBirthDate(birthDate)) return null;
  return markersAtDelta(dayDifference(date, parseDate(EPOCH)!));
}

function markersAtDelta(delta: number): Record<LevelKey, number> {
  return {
    physical: cycleMarker(delta, PERIODS.physical, 23),
    emotional: cycleMarker(delta, PERIODS.emotional, 6),
    intellectual: cycleMarker(delta, PERIODS.intellectual, 27),
  };
}

export function calculateChronobiology(name: string, birthDate: string): ChronobiologyResult | null {
  const date = parseDate(birthDate);
  if (!date || validateBirthDate(birthDate)) return null;
  const delta = dayDifference(date, parseDate(EPOCH)!);
  const year = date.getUTCFullYear();
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  // A BAZIS_ mind a 80 719 rekordjával ellenőrzött tömör leírás.
  // Szökőév januárja a táblázatos következő nap, februárja a 29 nappal
  // korábbi nap markerét tárolja. Ez az eredeti program kompatibilitási
  // szabálya, nem a Gergely-naptár módosítása vagy egyedi dátumkivétel.
  const databaseShift = leap && date.getUTCMonth() === 0 ? 1
    : leap && date.getUTCMonth() === 1 ? -29 : 0;
  const markers = markersAtDelta(delta + databaseShift);

  const levels: LevelResult[] = (["physical", "emotional", "intellectual"] as LevelKey[]).map((key) => {
    const profile = profileFor(key, markers[key]);
    return {
      ...levelMeta[key],
      marker: markers[key],
      right: profile.right,
      left: profile.left,
      label: profile.label,
    };
  });

  const rightBrain = levels.reduce((sum, level) => sum + level.right, 0);
  const leftBrain = levels.reduce((sum, level) => sum + level.left, 0);

  // Az eredeti program képei alapján: Jin = érzelmi pár + fizikai bal oldal;
  // Jang = intellektuális pár + fizikai jobb oldal. Ez mindkét referenciaesetet visszaadja.
  const physical = levels.find((level) => level.key === "physical")!;
  const emotional = levels.find((level) => level.key === "emotional")!;
  const intellectual = levels.find((level) => level.key === "intellectual")!;
  const jin = emotional.right + emotional.left + physical.left;
  const jang = intellectual.right + intellectual.left + physical.right;

  return {
    name: name.trim(),
    birthDate,
    markers,
    levels,
    rightBrain,
    leftBrain,
    bodyRight: leftBrain,
    bodyLeft: rightBrain,
    jin,
    jang,
    total: rightBrain + leftBrain,
  };
}

export function formatDate(value: string): string {
  const date = parseDate(value);
  if (!date) return value;
  return `${date.getUTCFullYear()}.${String(date.getUTCMonth() + 1).padStart(2, "0")}.${String(date.getUTCDate()).padStart(2, "0")}`;
}

export function validateBirthDate(value: string): string | null {
  const parsed = parseDate(value);
  if (!parsed) return "Adj meg egy érvényes születési dátumot.";
  const year = parsed.getUTCFullYear();
  if (year < 1800 || year > 2020) return "A forrásprogram 1800 és 2020 közötti dátumokra készült.";
  return null;
}
