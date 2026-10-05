import { describe, expect, it } from "vitest";
import { calculateChronobiology, calculateTableMarkers, validateBirthDate } from "./kronobiologia";

// Független források: Napi 1998.12.31-1949.1.1.pdf és Eves 2000-2099.pdf.
// Az éves táblázat év VÉGI alapértéket ad, nem január 1-jei markert.
describe("szökőévek a forrástáblázatok szerint", () => {
  it.each([
    ["1995-12-31", 16, 11, 2],
    ["1996-01-01", 15, 10, 1],
    ["1996-02-28", 3, 8, 9],
    ["1996-02-29", 2, 7, 8],
    ["1996-03-01", 1, 6, 7],
    ["1999-12-31", 4, 6, 26],
    ["2000-01-01", 3, 5, 25],
    ["2000-02-28", 14, 3, 33],
    ["2000-02-29", 13, 2, 32],
    ["2000-03-01", 12, 1, 31],
    ["2003-12-31", 15, 1, 17],
    ["2004-01-01", 14, 28, 16],
    ["2004-02-28", 2, 26, 24],
    ["2004-02-29", 1, 25, 23],
    ["2004-03-01", 23, 24, 22],
  ])("határnap: %s", (date, physical, emotional, intellectual) => {
    expect(calculateTableMarkers(String(date)))
      .toEqual({ physical, emotional, intellectual });
  });

  it.each([
    [1996, [18, 9, 32]],
    [2000, [6, 4, 23]],
    [2004, [17, 27, 14]],
  ] as const)("%i minden januári és februári napja", (year, yearEnd) => {
    let ordinal = 0;
    for (const [month, days] of [[1, 31], [2, 29]]) {
      for (let day = 1; day <= days; day++) {
        ordinal++;
        const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        // Kézi táblázatos módszer: év végi marker + évből hátralevő napok.
        // Nem használja a termékkód kezdődátumát vagy dátumkülönbségét.
        const expected = yearEnd.map((value, i) =>
          (value + 366 - ordinal - 1) % [23, 28, 33][i] + 1);
        expect(Object.values(calculateTableMarkers(date)!), date)
          .toEqual(expected);
      }
    }
    expect(ordinal).toBe(60);
  });

  it("2000 szökőév, 1900 nem szökőév", () => {
    expect(validateBirthDate("2000-02-29")).toBeNull();
    expect(validateBirthDate("1900-02-29")).not.toBeNull();
  });

  it("az eredeti 7-es fizikai marker 45/72 értékét továbbviszi az összesítésekbe", () => {
    // MARKERS M=7, J1="45 72"; az Excel ettől eltérő számpárja nem referencia.
    const result = calculateChronobiology("Referencia", "1991-03-05")!;
    const physical = result.levels.find(level => level.key === "physical")!;
    expect([physical.marker, physical.right, physical.left]).toEqual([7, 45, 72]);
    expect([result.rightBrain, result.leftBrain, result.total]).toEqual([204, 191, 395]);
    expect([result.bodyRight, result.bodyLeft, result.jin, result.jang]).toEqual([191, 204, 207, 188]);
  });
});
