import { datLibrary } from "./datLibrary";
import type { LevelKey } from "./kronobiologia";

export interface DatAnalysis {
  code: string;
  text: string;
}

// A régi program képeivel ellenőrzött sorrend: fizikai–érzelmi–intellektuális.
// A teljes .dat-szövegtár a datLibrary.ts-ben van; itt csak a validált
// markerhármas → fájlkód kapcsolatokat rögzítjük.
const datCodesByMarkers: Record<string, string[]> = {
  "18-8-15": ["166", "216"],
  "13-23-19": ["125", "245"],
};

export function getDatAnalyses(markers: Record<LevelKey, number>): DatAnalysis[] {
  const key = `${markers.physical}-${markers.emotional}-${markers.intellectual}`;
  return (datCodesByMarkers[key] ?? [])
    .map((code) => ({ code: `${code}.dat`, text: datLibrary[code] ?? "" }))
    .filter((analysis) => analysis.text.length > 0);
}
