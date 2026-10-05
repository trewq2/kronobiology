import { originalMarkerGroups, physicalEmotionalCodes, physicalIntellectualCodes } from "./originalAnalysisRules";
import { datLibrary } from "./datLibrary";
import type { LevelKey } from "./kronobiologia";

export interface DatAnalysis {
  code: string;
  text: string;
}

// Az eredeti adatbázis csoportkódjai és az EXE döntési táblája alapján.
export function getDatAnalyses(markers: Record<LevelKey, number>): DatAnalysis[] {
  const group = (key: LevelKey) => Number.isInteger(markers[key])
    ? originalMarkerGroups[key][markers[key] - 1] : undefined;
  const physical = group("physical");
  const emotional = group("emotional");
  const intellectual = group("intellectual");
  if (!physical || !emotional || !intellectual) return [];
  const codes = [
    physicalEmotionalCodes[physical - 1][emotional - 1],
    physicalIntellectualCodes[physical - 1][intellectual - 1],
  ];
  return codes.map((code) => {
    const text = datLibrary[code];
    if (!text) throw new Error(`Hiányzó elemzésszöveg: ${code}.dat`);
    return { code: `${code}.dat`, text };
  });
}
