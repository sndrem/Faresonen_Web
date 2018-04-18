const tools = {
  extractValues: function(tablerow, html) {
    const place = parseInt(
      html(tablerow)
        .children("td")
        .eq(0)
        .text()
        .replace(".", ""),
      10
    );
    const name = html(tablerow)
      .children("td")
      .eq(1)
      .find("a")
      .eq(0)
      .text();

    const id = this.extractId(tablerow, html);

    const team = html(tablerow)
      .children("td")
      .eq(2)
      .find("a")
      .eq(0)
      .text();
    const value1 = parseInt(
      html(tablerow)
        .children("td")
        .eq(3)
        .text(),
      10
    );
    const value2 = parseInt(
      html(tablerow)
        .children("td")
        .eq(4)
        .text(),
      10
    );
    const value3 = parseFloat(
      html(tablerow)
        .children("td")
        .eq(5)
        .text()
        .replace(",", ".")
    );

    return {
      place,
      name,
      team,
      id,
      value1,
      value2,
      value3
    };
  },
  extractId: function(tablerow, html) {
    const idRegex = /(personId=(\d*))/g;
    const url = this.extractUrl(tablerow, html);
    const id = idRegex.exec(url);
    if (id.length > 2) return parseInt(id[2], 10);

    return -1;
  },
  extractUrl: function(tablerow, html) {
    return html(tablerow)
      .children("td")
      .eq(1)
      .find("a")
      .attr("href");
  },
  isInDangerZone: function(player) {
    // https://www.fotball.no/globalassets/regler-og-retningslinjer/turneringsbestemmelser/turneringsbestemmelser-eliteserien.pdf
    // https://www.fotball.no/globalassets/regler-og-retningslinjer/turneringsbestemmelser/turneringsbestemmelser-obos-ligaen.pdf
    if (player.value1 < 4 || player.value1 === 0) {
      return false;
    } else if (player.value1 % 2 === 0) {
      return true;
    }

    return false;
  },
  filterDangerzonePlayers: function(players) {
    return players.filter(p => tools.isInDangerZone(p));
  }
};

export default tools;
