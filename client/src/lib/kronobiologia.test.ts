import { describe, expect, it } from "vitest";
import { calculateChronobiology, calculateTableMarkers, validateBirthDate } from "./kronobiologia";
import { getDatAnalyses } from "./datAnalyses";
import { datLibrary } from "./datLibrary";

// Független referencia: az eredeti „Napi 1998.12.31-1949.1.1.pdf” sorai.
const fixtures: [string, number, number, number][] = [
  [
    "1949-01-01",
    23,
    12,
    7
  ],
  [
    "1950-02-16",
    3,
    21,
    25
  ],
  [
    "1952-06-15",
    4,
    11,
    33
  ],
  [
    "1954-10-13",
    5,
    1,
    8
  ],
  [
    "1957-02-09",
    6,
    19,
    16
  ],
  [
    "1959-06-09",
    7,
    9,
    24
  ],
  [
    "1961-10-06",
    8,
    27,
    32
  ],
  [
    "1964-02-03",
    9,
    17,
    7
  ],
  [
    "1966-06-02",
    10,
    7,
    15
  ],
  [
    "1968-09-29",
    11,
    25,
    23
  ],
  [
    "1971-01-27",
    12,
    15,
    31
  ],
  [
    "1973-04-10",
    13,
    23,
    19
  ],
  [
    "1973-05-26",
    13,
    5,
    6
  ],
  [
    "1975-09-23",
    14,
    23,
    14
  ],
  [
    "1978-01-20",
    15,
    13,
    22
  ],
  [
    "1980-02-20",
    13,
    8,
    20
  ],
  [
    "1980-02-21",
    12,
    7,
    19
  ],
  [
    "1980-02-22",
    11,
    6,
    18
  ],
  [
    "1980-02-28",
    5,
    28,
    12
  ],
  [
    "1980-02-29",
    4,
    27,
    11
  ],
  [
    "1980-03-01",
    3,
    26,
    10
  ],
  [
    "1980-05-19",
    16,
    3,
    30
  ],
  [
    "1982-09-16",
    17,
    21,
    5
  ],
  [
    "1985-01-13",
    18,
    11,
    13
  ],
  [
    "1987-05-13",
    19,
    1,
    21
  ],
  [
    "1989-09-09",
    20,
    19,
    29
  ],
  [
    "1992-01-07",
    21,
    9,
    4
  ],
  [
    "1994-05-06",
    22,
    27,
    12
  ],
  [
    "1996-09-02",
    23,
    17,
    20
  ],
  [
    "1998-12-31",
    1,
    7,
    28
  ]
];

describe("eredeti források szerinti kronobiológia", () => {
  it.each(fixtures)("napi táblázat: %s", (date, physical, emotional, intellectual) => {
    expect(calculateTableMarkers(date)).toEqual({ physical, emotional, intellectual });
  });
  it("a tanulmány 1938.05.08-i teljes számpéldája", () => {
    const result = calculateChronobiology("  Teszt  ", "1938-05-08")!;
    expect(result.markers).toEqual({ physical: 4, emotional: 11, intellectual: 4 });
    expect(result.levels.map(({ right, left }) => [right, left])).toEqual([[50, 72], [18, 50], [93, 82]]);
    expect([result.rightBrain, result.leftBrain, result.total]).toEqual([161, 204, 365]);
    expect(result.name).toBe("Teszt");
  });
  it.each(["", "1980-02-30", "1900-02-29", "1980-13-01", "1799-12-31", "2021-01-01"])("hibás vagy tartományon kívüli dátum: %s", (date) => {
    expect(validateBirthDate(date)).not.toBeNull();
    expect(calculateChronobiology("Teszt", date)).toBeNull();
  });
  it.each(["1800-01-01", "2000-02-29", "2020-12-31"])("érvényes határ / szökőnap: %s", (date) => {
    expect(validateBirthDate(date)).toBeNull();
    expect(calculateChronobiology("Teszt", date)).not.toBeNull();
  });
  it("megőrzi a két eredeti elemzési referenciát", () => {
    expect(getDatAnalyses({ physical: 18, emotional: 8, intellectual: 15 }).map(x => x.code)).toEqual(["166.dat", "216.dat"]);
    expect(getDatAnalyses({ physical: 13, emotional: 23, intellectual: 19 }).map(x => x.code)).toEqual(["125.dat", "245.dat"]);
  });
  it("az 1980.02.21-i eredeti adatbázismarkerekhez ad elemzést", () => {
    const result = calculateChronobiology("Teszt", "1980-02-21")!;
    expect(result.markers).toEqual({ physical: 18, emotional: 8, intellectual: 15 });
    expect(getDatAnalyses(result.markers).map(x => x.code)).toEqual(["166.dat", "216.dat"]);
  });
  // Referenciák: az eredeti program hat képernyőképe, majd a felhasználó által
  // jelzett 1993.11.08-i 133.dat / 223.dat fájlpár. A várakozások függetlenek
  // a webes típusfeliratoktól és a kiválasztófüggvénytől.
  it.each([
    ["1983-03-21", "157.dat", "217.dat", "Hipochonder. Nagy érzelmi feszültségek jellemzik."],
    ["1987-08-04", "125.dat", "215.dat", "A szokásai fontosak számára és nehezen tud megszabadulni tőlük."],
    ["2001-10-05", "153.dat", "263.dat", "Magas aktivitása kompenzálja az adaptációt."],
    ["1990-02-14", "117.dat", "247.dat", "Érzékeny, sértődékeny, bosszúálló."],
    ["1988-05-14", "165.dat", "215.dat", "Alacsony ellenállóképesség."],
    ["1987-01-05", "147.dat", "217.dat", "Önszerető, nagyon érzékeny."],
    ["1993-11-08", "133.dat", "223.dat", "Dekoncentráltság jellemzi."],
    // Új, független képernyőképek az eredeti programból (2026.10.04.).
    ["1952-08-22", "115.dat", "265.dat", "Magas kockázat és balesetveszély."],
    ["1991-03-05", "123.dat", "213.dat", "Nagyon egészséges,"],
    ["1991-07-06", "162.dat", "272.dat", "Erős temperamentum, hideg érzelem."],
    ["1998-02-22", "134.dat", "224.dat", "Hős nem adekvált."],
    ["1992-07-05", "153.dat", "213.dat", "Magas aktivitása kompenzálja az adaptációt."],
  ])("eredeti program szöveges elemzése: %s", (date, first, second, opening) => {
    const result = calculateChronobiology("Referencia", date)!;
    const analyses = getDatAnalyses(result.markers);
    expect(analyses.map(item => item.code)).toEqual([first, second]);
    expect(analyses[0].text.startsWith(opening)).toBe(true);
  });
  it("az 1988.01.30-i eredeti képernyőképet dátum alapján reprodukálja", () => {
    const result = calculateChronobiology("Referencia", "1988-01-30")!;
    expect(result.markers).toEqual({ physical: 9, emotional: 18, intellectual: 22 });
    expect(getDatAnalyses(result.markers).map(x => x.code)).toEqual(["167.dat", "217.dat"]);
  });
  it("a 2000.01.01-i három képkivágás minden számát és szövegét reprodukálja", () => {
    const result = calculateChronobiology("Referencia", "2000-01-01")!;
    expect(result.markers).toEqual({ physical: 2, emotional: 4, intellectual: 24 });
    expect(result.levels.map(({ right, left }) => [right, left]))
      .toEqual([[55, 72], [62, 77], [26, 18]]);
    expect([result.rightBrain, result.leftBrain, result.bodyRight, result.bodyLeft])
      .toEqual([143, 167, 167, 143]);
    expect([result.total, result.jin, result.jang]).toEqual([310, 211, 99]);
    const analyses = getDatAnalyses(result.markers);
    expect(analyses.map(x => x.code)).toEqual(["113.dat", "273.dat"]);
    expect(analyses[0].text).toBe("Agresszívitás jellemzi.\nMagas balesetveszély.\nBetegség: túltengéses.");
    expect(analyses[1].text).toBe("Asztrális programozás.\nMinden fizikai módszert alkalmazhatunk, verbális ráhatás kombinálásával.\nÉrzelmi kapaszkodók lényegesek.");
  });
  it("minden érvényes markerhármashoz két létező szöveget ad", () => {
    const used = new Set<string>();
    for (let physical = 1; physical <= 23; physical++) {
      for (let emotional = 1; emotional <= 28; emotional++) {
        for (let intellectual = 1; intellectual <= 33; intellectual++) {
          const texts = getDatAnalyses({ physical, emotional, intellectual });
          expect(texts).toHaveLength(2);
          for (const item of texts) {
            expect(item.text.length).toBeGreaterThan(0);
            used.add(item.code);
          }
        }
      }
    }
    expect(used.size).toBe(91);
  });
  it("a forrásszövegek helyes magyar kódolásúak", () => {
    expect(datLibrary["125"]).toContain("tőlük");
    expect(datLibrary["216"]).toContain("Mezőráhatásokra");
    expect(Object.values(datLibrary).join("\n")).not.toMatch(/[õûÕÛ\u0080-\u009f\ufffd]/);
  });
  it("érvénytelen markerre nem talál ki elemzést", () => {
    expect(getDatAnalyses({ physical: 0, emotional: 8, intellectual: 15 })).toEqual([]);
  });
});
