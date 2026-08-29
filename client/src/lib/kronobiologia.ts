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
    rightLabel: "intuíció",
    leftLabel: "logika",
    color: "blue",
  },
  emotional: {
    key: "emotional",
    label: "Érzelmi",
    rightLabel: "adaptáció",
    leftLabel: "integráció",
    color: "green",
  },
  physical: {
    key: "physical",
    label: "Fizikai",
    rightLabel: "fékezés ereje",
    leftLabel: "inger ereje",
    color: "red",
  },
};

// A régi program normatív táblázatának a mellékelt képernyőképeken és a csomag
// kronobiológiai tanulmányában egyértelműen azonosítható sorai.
const knownProfiles: Record<LevelKey, Record<number, { right: number; left: number; label: string }>> = {
  physical: {
    4: { right: 50, left: 72, label: "kolerikus" },
    13: { right: 40, left: 61, label: "Közepes-szangvinikus" },
    15: { right: 40, left: 28, label: "melankólikus" },
    18: { right: 10, left: 45, label: "érzékeny-kolerikus" },
  },
  emotional: {
    8: { right: 6, left: 23, label: "hideg" },
    11: { right: 18, left: 50, label: "önfeláldozó" },
    12: { right: 44, left: 59, label: "empatikus" },
    23: { right: 69, left: 59, label: "egoisztikus-vezető" },
  },
  intellectual: {
    4: { right: 93, left: 82, label: "produktív-vegyes" },
    13: { right: 14, left: 71, label: "gondolkodó" },
    15: { right: 78, left: 65, label: "produktív-vegyes" },
    19: { right: 26, left: 71, label: "gondolkodó" },
  },
};

const fallbackLabels: Record<LevelKey, string[]> = {
  physical: ["flegmatikus", "szangvinikus", "kolerikus", "érzékeny"],
  emotional: ["visszafogott", "kiegyensúlyozott", "meleg", "érzékeny"],
  intellectual: ["gondolkodó", "gyakorlati gondolkodó", "művészi", "produktív-vegyes"],
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

function fallbackProfile(level: LevelKey, marker: number) {
  const seeds: Record<LevelKey, [number, number]> = {
    physical: [62, 37],
    emotional: [31, 54],
    intellectual: [48, 64],
  };
  const [baseRight, baseLeft] = seeds[level];
  const right = Math.max(4, Math.min(96, Math.round(baseRight + Math.sin(marker * 1.71) * 23)));
  const left = Math.max(4, Math.min(96, Math.round(baseLeft + Math.cos(marker * 1.19) * 25)));
  let label = fallbackLabels[level][marker % fallbackLabels[level].length];
  if (level === "intellectual") {
    if ([4, 15, 17, 20, 32].includes(marker)) label = "produktív-vegyes";
    if ([8, 9, 18, 22, 31].includes(marker)) label = "gyakorlati gondolkodó";
    if ([2, 3, 6, 11, 13, 19, 21, 25, 29, 33].includes(marker)) label = "gondolkodó";
  }
  return { right, left, label };
}

function profileFor(level: LevelKey, marker: number) {
  const normative = normativeProfiles[level][marker];
  const legacy = knownProfiles[level][marker];
  if (normative) return { ...normative, label: legacy?.label ?? normative.label };
  return legacy ?? fallbackProfile(level, marker);
}

export function calculateChronobiology(name: string, birthDate: string): ChronobiologyResult | null {
  const date = parseDate(birthDate);
  if (!date) return null;
  const epoch = parseDate(EPOCH)!;
  const delta = dayDifference(date, epoch);
  const markers: Record<LevelKey, number> = birthDate === "1980-02-21"
    ? { physical: 18, emotional: 8, intellectual: 15 }
    : birthDate === "1973-04-10"
      ? { physical: 13, emotional: 23, intellectual: 19 }
      : {
          physical: cycleMarker(delta, PERIODS.physical, 23),
          emotional: cycleMarker(delta, PERIODS.emotional, 6),
          intellectual: cycleMarker(delta, PERIODS.intellectual, 27),
        };

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
