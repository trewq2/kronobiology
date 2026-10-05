import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { calculateChronobiology, calculateTableMarkers } from "./kronobiologia";
import { getDatAnalyses } from "./datAnalyses";
import { normativeProfiles } from "./normativeProfiles";

const fixture = (name: string) => readFileSync(new URL(`../../../tests/fixtures/${name}`, import.meta.url));
const source = JSON.parse(fixture("original-marker-data.json").toString());
type DailyRow = [string, number, number, number];
const original: DailyRow[] = JSON.parse(gunzipSync(fixture("original-calendar.json.gz")).toString());

describe("közvetlenül kinyert eredeti programadatok", () => {
  it("mind a 21 252 markerhármas az EXE döntési táblájának megfelelő fájlokat kapja", () => {
    const differences: unknown[] = [];
    for (let p = 1; p <= 23; p++) for (let e = 1; e <= 28; e++) for (let i = 1; i <= 33; i++) {
      const row = Number(source.markers[p - 1].S11) - 1;
      const expected = [
        source.physicalEmotional[row][Number(source.markers[e - 1].S21) - 1],
        source.physicalIntellectual[row][Number(source.markers[i - 1].S31) - 1],
      ].map(code => `${code}.dat`);
      const actual = getDatAnalyses({ physical: p, emotional: e, intellectual: i }).map(x => x.code);
      if (actual.join() !== expected.join()) differences.push({ p, e, i, actual, expected });
    }
    expect(differences).toEqual([]);
  });

  it("mind a 80 719 dátumra az eredeti markereket, számpárokat, összesítéseket és DAT-fájlokat adja", () => {
    expect(original).toHaveLength(80719);
    expect(new Set(original.map(row => row[0])).size).toBe(80719);
    const differences: unknown[] = [];
    for (const [date, p, e, i] of original) {
      const actual = calculateChronobiology("", date)!;
      // Elvárt értékek közvetlenül a BAZIS_ és MARKERS fixture-ből,
      // a termék profiljai, dátumképlete és csoporttáblái nélkül.
      const pairs = [source.markers[p - 1].J1, source.markers[e - 1].J2, source.markers[i - 1].J3]
        .map((pair: string) => pair.split(/\s+/).map(Number));
      const right = pairs.reduce((sum: number, pair: number[]) => sum + pair[0], 0);
      const left = pairs.reduce((sum: number, pair: number[]) => sum + pair[1], 0);
      const group = Number(source.markers[p - 1].S11) - 1;
      const codes = [source.physicalEmotional[group][Number(source.markers[e - 1].S21) - 1],
        source.physicalIntellectual[group][Number(source.markers[i - 1].S31) - 1]];
      const expected = [[p, e, i], pairs, right, left, left, right, right + left,
        pairs[1][0] + pairs[1][1] + pairs[0][1], pairs[2][0] + pairs[2][1] + pairs[0][0],
        codes.map(code => `${code}.dat`)];
      const received = [Object.values(actual.markers), actual.levels.map(x => [x.right, x.left]),
        actual.rightBrain, actual.leftBrain, actual.bodyRight, actual.bodyLeft, actual.total,
        actual.jin, actual.jang, getDatAnalyses(actual.markers).map(x => x.code)];
      if (JSON.stringify(received) !== JSON.stringify(expected)) differences.push({ date, received, expected });
    }
    expect(differences).toEqual([]);
  });

  it("mind a 18 262 napi PDF-sor és 221 éves alapérték egyezik a külön megőrzött PDF-alapképlettel", () => {
    const daily: DailyRow[] = JSON.parse(gunzipSync(fixture("source-daily-table.json.gz")).toString());
    const annual: [number, number, number, number, string][] = JSON.parse(fixture("source-annual-table.json").toString());
    expect([daily.length, annual.length]).toEqual([18262, 221]);
    const rows: DailyRow[] = [...daily, ...annual.map(([year, p, e, i]): DailyRow => [`${year}-12-31`, p, e, i])];
    expect(rows.filter(([date, ...markers]) =>
      Object.values(calculateTableMarkers(date)!).join() !== markers.join())).toEqual([]);
  });

  it("mind a 84 számpár az eredeti adatbázissal egyezik", () => {
    for (const [key, column] of [["physical", "J1"], ["emotional", "J2"], ["intellectual", "J3"]] as const) {
      for (const [marker, profile] of Object.entries(normativeProfiles[key])) {
        const originalPair = source.markers[Number(marker) - 1][column].split(/\s+/).map(Number);
        expect([profile.right, profile.left], `${key}/${marker}`).toEqual(originalPair);
      }
    }
  });
});
