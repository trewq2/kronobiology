import { datLibrary } from "./datLibrary";
import type { LevelKey } from "./kronobiologia";

export interface DatAnalysis {
  code: string;
  text: string;
}

// A fájlkód típuspárhoz tartozik, nem egy dátumhoz vagy markerhármashoz.
// 1 + érzelmi csoport + fizikai csoport; 2 + intellektuális csoport + fizikai csoport.
// A tipologia.exe elemzes eljárásának kiválasztótábláiból visszaellenőrizve.
// A markerbesorolások a profiladatokból és a mellékelt tanulmányból származnak.
const typeGroups: Record<LevelKey, readonly (readonly number[])[]> = {
  physical: [
    [6, 8, 11, 16],       // 1: flegmatikus
    [19, 22],             // 2: flegmatikus-szangvinikus
    [2, 7, 17],           // 3: szangvinikus
    [3, 4, 12, 14, 21],   // 4: kolerikus
    [1, 5, 10, 13, 20],   // 5: közepesen szangvinikus
    [18],                 // 6: érzékeny kolerikus
    [9, 15, 23],          // 7: melankolikus
  ],
  emotional: [
    [7, 10, 11, 13],           // 1: önfeláldozó
    [2, 9, 19, 23],            // 2: egoisztikus vezető
    [1, 4, 14, 15, 27],        // 3: szenvedélyes
    [3, 5, 6, 12, 25, 26, 28], // 4: empatikus
    [16, 17, 20, 21, 24],      // 5: szentimentális
    [8, 18, 22],               // 6: hideg
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
  const group = (key: LevelKey) => typeGroups[key].findIndex((row) => row.includes(markers[key])) + 1;
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
