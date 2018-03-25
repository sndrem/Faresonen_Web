const request = require("request");
const axios = require("axios");
const cheerio = require("cheerio");
const constants = require("../constants/constants").default;

function extractValues(tablerow, html) {
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

  const id = extractId(tablerow, html);

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
}

function extractUrl(tablerow, html) {
  return html(tablerow)
    .children("td")
    .eq(1)
    .find("a")
    .attr("href");
}

function extractId(tablerow, html) {
  const idRegex = /(personId=(\d*))/g;
  const url = extractUrl(tablerow, html);
  const id = idRegex.exec(url);
  if (id.length > 2) return parseInt(id[2], 10);

  return -1;
}

function getStatistics(url, tournamentId) {
  return new Promise((resolve, reject) => {
    if (isNaN(tournamentId)) {
      reject(new Error("TournamentId is not valid. Must be a number"));
    }

    request.get(`${url}${tournamentId}`, (err, response, html) => {
      if (err) {
        response.error = `Could not get statistics for url: ${url} with tournament ID: ${tournamentId}`;
      }
      const $ = cheerio.load(html);
      const players = [];
      $("table tbody tr").each((i, elem) => {
        const playerData = extractValues(elem, $);
        players.push(playerData);
      });
      resolve(players);
    });
  });
}

function isInDangerzone(player) {
  return player.value1 > 0 && player.value1 % 2 === 0;
}

function filterDangerzonePlayers(players) {
  return players.filter(p => isInDangerzone(p));
}

const scraper = {
  getYellowCards(req, res, next) {
    getStatistics(constants.YELLOW_CARD_STATISTICS, req.params.tournamentId)
      .then(data => {
        res.players = data;
        next();
      })
      .catch(err => {
        throw new Error(err);
      });
  },

  getTopScorers(req, res, next) {
    getStatistics(constants.TOPSCORER_STATISTICS, req.params.tournamentId)
      .then(data => {
        res.players = data;
        next();
      })
      .catch(err => {
        throw new Error(err);
      });
  },

  getAllDangerzonePlayers(req, res, next) {
    const urls = [
      getStatistics(constants.YELLOW_CARD_STATISTICS, 1),
      getStatistics(constants.YELLOW_CARD_STATISTICS, 2)
    ];

    axios
      .all(urls)
      .then(
        axios.spread((eliteserien, obosligaen) => {
          res.players = {
            eliteserien: filterDangerzonePlayers(eliteserien).map(p => {
              const player = p;
              player.league = "eliteserien";
              return player;
            }),
            obosligaen: filterDangerzonePlayers(obosligaen).map(p => {
              const player = p;
              player.league = "obosligaen";
              return player;
            })
          };
          next();
        })
      )
      .catch(err => {
        res.players = {
          eliteserien: [],
          obosligaen: []
        };
        next();
      });
  },

  getAllDangerzonePlayersForSockets(cb) {
    const urls = [
      getStatistics(constants.YELLOW_CARD_STATISTICS, 1),
      getStatistics(constants.YELLOW_CARD_STATISTICS, 2)
    ];

    return axios
      .all(urls)
      .then(
        axios.spread((eliteserien, obosligaen) => {
          cb({
            eliteserien: filterDangerzonePlayers(eliteserien),
            obosligaen: filterDangerzonePlayers(obosligaen)
          });
        })
      )
      .catch(err => {
        cb({
          eliteserien: [],
          obosligaen: []
        });
      });
  },

  // http://api.tv2.no/sport/resources/events/?fromTime=2018-03-11&toTime=2018-03-18&max=100&sportId=1&tournamentId=1&eventtypes=2
  getYellowCardEvents(fromTime, toTime) {
    const urls = [
      axios.get(
        `http://api.tv2.no/sport/resources/events/?fromTime=${fromTime}&toTime=${toTime}&max=100&sportId=1&tournamentId=1&eventtypes=2`
      ),
      axios.get(
        `http://api.tv2.no/sport/resources/events/?fromTime=${fromTime}&toTime=${toTime}&max=100&sportId=1&tournamentId=2&eventtypes=2`
      )
    ];

    return new Promise((resolve, reject) => {
      axios
        .all(urls)
        .then(
          axios.spread((eliteserien, obosligaen) => {
            if (eliteserien.data.event) {
              resolve({
                events: eliteserien.data.event
              });
            } else if (obosligaen.data.event) {
              resolve({
                events: obosligaen.data.event
              });
            } else if (eliteserien.data.event && obosligaen.data.event) {
              resolve({
                events: eliteserien.data.event.concat(obosligaen.data.event)
              });
            } else {
              resolve({
                events: []
              });
            }
          })
        )
        .catch(err => {
          // console.log(err);
          reject(err);
        });
    });
  },

  getTestEvents() {
    return [
      {
        "@uri": "http://api.tv2.no/sport/resources/events/15221417/",
        eventtype: {
          "@uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
        },
        eventtime: "41",
        extendedeventtype: {
          "@uri": "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
        },
        goalsTeamA: "1",
        goalsTeamB: "0",
        id: "15221417",
        match: {
          "@uri": "http://api.tv2.no/sport/resources/matches/912485/"
        },
        person1: {
          "@uri": "http://api.tv2.no/sport/resources/people/345617/"
        },
        realTime: "2018-03-18T18:46:57+01:00",
        team: {
          "@uri": "http://api.tv2.no/sport/resources/teams/307/"
        }
      },
      {
        "@uri": "http://api.tv2.no/sport/resources/events/15222082/",
        enetpulseId: "5491684",
        eventMin: "84",
        eventtype: {
          "@uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
        },
        eventtime: "84",
        extendedeventtype: {
          "@uri": "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
        },
        goalsTeamA: "2",
        goalsTeamB: "0",
        id: "15222082",
        match: {
          "@uri": "http://api.tv2.no/sport/resources/matches/912485/"
        },
        nifsId: "8630875",
        person1: {
          "@uri": "http://api.tv2.no/sport/resources/people/207243/"
        },
        realTime: "2018-03-18T19:50:24+01:00",
        team: {
          "@uri": "http://api.tv2.no/sport/resources/teams/307/"
        },
        text: "Stopper en Brann-kontring. Riktig idømt."
      },
      {
        "@uri": "http://api.tv2.no/sport/resources/events/15222085/",
        eventtype: {
          "@uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
        },
        eventtime: "85",
        extendedeventtype: {
          "@uri": "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
        },
        goalsTeamA: "0",
        goalsTeamB: "1",
        id: "15222085",
        match: {
          "@uri": "http://api.tv2.no/sport/resources/matches/912482/"
        },
        person1: {
          "@uri": "http://api.tv2.no/sport/resources/people/279765/"
        },
        realTime: "2018-03-18T19:50:25+01:00",
        team: {
          "@uri": "http://api.tv2.no/sport/resources/teams/309/"
        }
      },
      {
        "@uri": "http://api.tv2.no/sport/resources/events/15222633/",
        eventtype: {
          "@uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
        },
        eventtime: "36",
        extendedeventtype: {
          "@uri": "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
        },
        goalsTeamA: "0",
        goalsTeamB: "0",
        id: "15222633",
        match: {
          "@uri": "http://api.tv2.no/sport/resources/matches/912487/"
        },
        nifsId: "8631283",
        person1: {
          "@uri": "http://api.tv2.no/sport/resources/people/194694/"
        },
        realTime: "2018-03-18T20:37:58+01:00",
        team: {
          "@uri": "http://api.tv2.no/sport/resources/teams/314/"
        },
        text:
          "Alt for sent inne i en takling på Jone Samuelsen. Frispark til Odd i svært god posisjon."
      },
      {
        "@uri": "http://api.tv2.no/sport/resources/events/15222908/",
        eventtype: {
          "@uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
        },
        eventtime: "65",
        extendedeventtype: {
          "@uri": "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
        },
        goalsTeamA: "2",
        goalsTeamB: "1",
        id: "15222908",
        match: {
          "@uri": "http://api.tv2.no/sport/resources/matches/912487/"
        },
        nifsId: "8631530",
        person1: {
          "@uri": "http://api.tv2.no/sport/resources/people/291489/"
        },
        realTime: "2018-03-18T21:24:57+01:00",
        team: {
          "@uri": "http://api.tv2.no/sport/resources/teams/314/"
        }
      },
      {
        "@uri": "http://api.tv2.no/sport/resources/events/15222908/",
        eventtype: {
          "@uri": "http://api.tv2.no/sport/resources/eventtypes/2/"
        },
        eventtime: "65",
        extendedeventtype: {
          "@uri": "http://api.tv2.no/sport/resources/extendedeventtypes/1200/"
        },
        goalsTeamA: "2",
        goalsTeamB: "1",
        id: "15222908",
        match: {
          "@uri": "http://api.tv2.no/sport/resources/matches/912487/"
        },
        nifsId: "8631530",
        person1: {
          "@uri": "http://api.tv2.no/sport/resources/people/241363/"
        },
        realTime: "2018-03-18T21:24:57+01:00",
        team: {
          "@uri": "http://api.tv2.no/sport/resources/teams/314/"
        }
      }
    ];
  }
};

export default scraper;
