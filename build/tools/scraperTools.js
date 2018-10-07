"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var tools = {
  extractValues: function extractValues(tablerow, html) {
    var place = parseInt(html(tablerow).children("td").eq(0).text().replace(".", ""), 10);
    var name = html(tablerow).children("td").eq(1).find("a").eq(0).text();

    var id = this.extractId(tablerow, html);

    var team = html(tablerow).children("td").eq(2).find("a").eq(0).text();
    var value1 = parseInt(html(tablerow).children("td").eq(3).text(), 10);
    var value2 = parseInt(html(tablerow).children("td").eq(4).text(), 10);
    var value3 = parseFloat(html(tablerow).children("td").eq(5).text().replace(",", "."));

    return {
      place: place,
      name: name,
      team: team,
      id: id,
      value1: value1,
      value2: value2,
      value3: value3
    };
  },
  extractId: function extractId(tablerow, html) {
    var idRegex = /(personId=(\d*))/g;
    var url = this.extractUrl(tablerow, html);
    var id = idRegex.exec(url);
    if (id.length > 2) return parseInt(id[2], 10);

    return -1;
  },
  extractUrl: function extractUrl(tablerow, html) {
    return html(tablerow).children("td").eq(1).find("a").attr("href");
  },
  isInDangerZone: function isInDangerZone(player) {
    // https://www.fotball.no/globalassets/regler-og-retningslinjer/turneringsbestemmelser/turneringsbestemmelser-eliteserien.pdf
    // https://www.fotball.no/globalassets/regler-og-retningslinjer/turneringsbestemmelser/turneringsbestemmelser-obos-ligaen.pdf
    if (player.value1 === 3 || player.value1 % 2 !== 0 && player.value1 > 2) {
      return true;
    }
    return false;
  },
  filterDangerzonePlayers: function filterDangerzonePlayers(players) {
    return players.filter(function (p) {
      return tools.isInDangerZone(p);
    });
  }
};

exports.default = tools;
//# sourceMappingURL=scraperTools.js.map