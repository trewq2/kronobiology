import { datLibrary } from "./datLibrary";
import type { LevelKey } from "./kronobiologia";

export interface DatAnalysis {
  code: string;
  text: string;
}

// A fájlkód elemzési csoportpárhoz tartozik, nem egy dátumhoz.
// 1 + érzelmi csoport + fizikai csoport; 2 + intellektuális csoport + fizikai csoport.
// A csoport NEM vezethető le mindig a megjelenített típus nevéből.
// A profilokból korábban becsült besorolásokat az eredeti program 2026.10.03-án
// kapott hat képernyőképe alapján javítottuk: fizikai 4; érzelmi 1, 3, 6, 17, 26.
// További eredeti referencia: 1993.11.08 → 133.dat / 223.dat; érzelmi 10 → 3.
// A többi marker besorolását ezek a példák önmagukban nem hitelesítik.
const analysisGroups: Record<LevelKey, readonly (readonly number[])[]> = {
  physical: [
    [6, 8, 11, 16],       // 1: flegmatikus
    [19, 22],             // 2: flegmatikus-szangvinikus
    [2, 4, 7, 17],        // 3
    [3, 12, 14, 21],      // 4
    [1, 5, 10, 13, 20],   // 5: közepesen szangvinikus
    [18],                 // 6: érzékeny kolerikus
    [9, 15, 23],          // 7: melankolikus
  ],
  emotional: [
    [1, 7, 11, 13],         // 1
    [2, 9, 19, 23],         // 2
    [4, 10, 14, 15, 27],    // 3
    [5, 12, 17, 25, 28],    // 4
    [3, 6, 16, 20, 21, 24], // 5
    [8, 18, 22, 26],        // 6
  ],
  intellectual: [
    [4, 15, 17, 20, 32],                   // 1: produktív vegyes
    [1, 10, 12, 16, 26, 30],               // 2: produktív művészi
    [7, 23, 27],                           // 3: produktív gondolkodó
    [2, 3, 6, 11, 13, 19, 21, 25, 29, 33], // 4: gondolkodó
    [5, 14],                               // 5: harmonikus vegyes
    [8, 9, 18, 22, 31],                    // 6: gyakorlati gondolkodó
    [24, 28],                              // 7: gyakorlati művészi / vegyes
  ],
};

export function getDatAnalyses(markers: Record<LevelKey, number>): DatAnalysis[] {
  const group = (key: LevelKey) => analysisGroups[key].findIndex((row) => row.includes(markers[key])) + 1;
  const physical = group("physical");
  const emotional = group("emotional");
  const intellectual = group("intellectual");
  if (!physical || !emotional || !intellectual) return [];
  return [`1${emotional}${physical}`, `2${intellectual}${physical}`].map((code) => {
    const text = datLibrary[code];
    if (!text) throw new Error(`Hiányzó elemzésszöveg: ${code}.dat`);
    return { code: `${code}.dat`, text };
  });
}
