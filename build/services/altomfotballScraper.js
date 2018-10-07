"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var request = require("request");
var axios = require("axios");
var cheerio = require("cheerio");
var constants = require("../constants/constants").default;
var tools = require("../tools/scraperTools").default;

function getStatistics(url, tournamentId) {
  return new Promise(function (resolve, reject) {
    if (isNaN(tournamentId)) {
      reject(new Error("TournamentId is not valid. Must be a number"));
    }

    request.get("" + url + tournamentId, function (err, response, html) {
      if (err) {
        response.error = "Could not get statistics for url: " + url + " with tournament ID: " + tournamentId;
      }
      var $ = cheerio.load(html);
      var players = [];
      $("table tbody tr").each(function (i, elem) {
        var playerData = tools.extractValues(elem, $);
        players.push(playerData);
      });
      resolve(players);
    });
  });
}

var scraper = {
  getYellowCards: function getYellowCards(req, res, next) {
    getStatistics(constants.YELLOW_CARD_STATISTICS, req.params.tournamentId).then(function (data) {
      res.players = data;
      next();
    }).catch(function (err) {
      throw new Error(err);
    });
  },
  getTopScorers: function getTopScorers(req, res, next) {
    getStatistics(constants.TOPSCORER_STATISTICS, req.params.tournamentId).then(function (data) {
      res.players = data;
      next();
    }).catch(function (err) {
      throw new Error(err);
    });
  },
  getAllDangerzonePlayers: function getAllDangerzonePlayers(req, res, next) {
    var urls = [getStatistics(constants.YELLOW_CARD_STATISTICS, 1), getStatistics(constants.YELLOW_CARD_STATISTICS, 2)];

    axios.all(urls).then(axios.spread(function (eliteserien, obosligaen) {
      res.players = {
        eliteserien: tools.filterDangerzonePlayers(eliteserien).map(function (p) {
          var player = p;
          player.league = "eliteserien";
          return player;
        }),
        obosligaen: tools.filterDangerzonePlayers(obosligaen).map(function (p) {
          var player = p;
          player.league = "obosligaen";
          return player;
        })
      };
      next();
    })).catch(function (err) {
      res.players = {
        eliteserien: [],
        obosligaen: []
      };
      next();
    });
  },
  getAllDangerzonePlayersForSockets: function getAllDangerzonePlayersForSockets(cb) {
    var urls = [getStatistics(constants.YELLOW_CARD_STATISTICS, 1), getStatistics(constants.YELLOW_CARD_STATISTICS, 2)];

    return axios.all(urls).then(axios.spread(function (eliteserien, obosligaen) {
      cb({
        eliteserien: tools.filterDangerzonePlayers(eliteserien),
        obosligaen: tools.filterDangerzonePlayers(obosligaen)
      });
    })).catch(function (err) {
      cb({
        eliteserien: [],
        obosligaen: []
      });
    });
  },
  getYellowCardEvents: function getYellowCardEvents(fromTime) {
    var urls = [axios.get(this.formatYellowCardEndpoint(fromTime, 1)), axios.get(this.formatYellowCardEndpoint(fromTime, 2))];

    return new Promise(function (resolve, reject) {
      axios.all(urls).then(axios.spread(function (eliteserien, obosligaen) {
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
      })).catch(function (err) {
        // console.log(err);
        reject(err);
      });
    });
  },
  formatYellowCardEndpoint: function formatYellowCardEndpoint(fromTime, tournamentId) {
    return "http://api.tv2.no/sport/resources/events/?fromTime=" + fromTime + "&max=100&sportId=1&tournamentId=" + tournamentId + "&eventtypes=2";
  },
  getAllLeagues: function getAllLeagues() {
    var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1500;
    var sportId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var filterImportant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "feed";

    return new Promise(function (resolve, reject) {
      axios.get("http://api.tv2.no/sport/resources/tournaments?sportId=" + sportId + "&max=" + max + "&filterImportant=" + filterImportant).then(function (data) {
        resolve(data);
      }).catch(function (err) {
        reject(err);
      });
    });
  },
  getTestEvents: function getTestEvents() {
    return [{
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
    }, {
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
        "@uri": "http://api.tv2.no/sport/resources/people/195587/"
      },
      realTime: "2018-04-15T18:46:57+01:00",
      team: {
        "@uri": "http://api.tv2.no/sport/resources/teams/307/"
      }
    }, {
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
    }, {
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
    }, {
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
      text: "Alt for sent inne i en takling på Jone Samuelsen. Frispark til Odd i svært god posisjon."
    }, {
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
    }, {
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
    }];
  }
};

exports.default = scraper;
//# sourceMappingURL=altomfotballScraper.js.map