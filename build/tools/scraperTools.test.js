"use strict";

var _scraperTools = require("./scraperTools");

var _scraperTools2 = _interopRequireDefault(_scraperTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("Scrapertools", function () {
  it("Should correctly calculate if someone is in the dangerone", function () {
    // A player is in the dangerzone if he has
    // 4 yellow cards, 6 yellow ca
    var sindre = { value1: 3 };
    expect(_scraperTools2.default.isInDangerZone(sindre)).toEqual(true);
    sindre.value1 = 4;
    expect(_scraperTools2.default.isInDangerZone(sindre)).toEqual(false);
    sindre.value1 = 5;
    expect(_scraperTools2.default.isInDangerZone(sindre)).toEqual(true);
    sindre.value1 = 6;
    expect(_scraperTools2.default.isInDangerZone(sindre)).toEqual(false);
    sindre.value1 = 7;
    expect(_scraperTools2.default.isInDangerZone(sindre)).toEqual(true);
    sindre.value1 = 8;
    expect(_scraperTools2.default.isInDangerZone(sindre)).toEqual(false);
    sindre.value1 = 9;
    expect(_scraperTools2.default.isInDangerZone(sindre)).toEqual(true);
    sindre.value1 = 0;
    expect(_scraperTools2.default.isInDangerZone(sindre)).toEqual(false);
    sindre.value1 = -1;
    expect(_scraperTools2.default.isInDangerZone(sindre)).toEqual(false);
    sindre.value1 = 20;
    expect(_scraperTools2.default.isInDangerZone(sindre)).toEqual(false);
  });
});
//# sourceMappingURL=scraperTools.test.js.map