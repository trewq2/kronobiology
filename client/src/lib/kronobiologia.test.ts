import { describe, expect, it } from "vitest";
import { calculateChronobiology, validateBirthDate } from "./kronobiologia";
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
    expect(calculateChronobiology("Teszt", date)?.markers).toEqual({ physical, emotional, intellectual });
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
  it("az 1980.02.21-i javított markerekhez is ad elemzést", () => {
    const result = calculateChronobiology("Teszt", "1980-02-21")!;
    expect(getDatAnalyses(result.markers).map(x => x.code)).toEqual(["114.dat", "244.dat"]);
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
