import scraperTools from "./scraperTools";
describe("Scrapertools", () => {
  it("Should correctly calculate if someone is in the dangerone", () => {
    // A player is in the dangerzone if he has
    // 4 yellow cards, 6 yellow ca
    const sindre = { value1: 3 };
    expect(scraperTools.isInDangerZone(sindre)).toEqual(true);
    sindre.value1 = 4;
    expect(scraperTools.isInDangerZone(sindre)).toEqual(false);
    sindre.value1 = 5;
    expect(scraperTools.isInDangerZone(sindre)).toEqual(true);
    sindre.value1 = 6;
    expect(scraperTools.isInDangerZone(sindre)).toEqual(false);
    sindre.value1 = 7;
    expect(scraperTools.isInDangerZone(sindre)).toEqual(true);
    sindre.value1 = 8;
    expect(scraperTools.isInDangerZone(sindre)).toEqual(false);
    sindre.value1 = 9;
    expect(scraperTools.isInDangerZone(sindre)).toEqual(true);
    sindre.value1 = 0;
    expect(scraperTools.isInDangerZone(sindre)).toEqual(false);
    sindre.value1 = -1;
    expect(scraperTools.isInDangerZone(sindre)).toEqual(false);
    sindre.value1 = 20;
    expect(scraperTools.isInDangerZone(sindre)).toEqual(false);
  });
});
