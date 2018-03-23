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
  return player.value1 > 0 && player.value1 % 2 !== 0;
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
            eliteserien: filterDangerzonePlayers(eliteserien),
            obosligaen: filterDangerzonePlayers(obosligaen)
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
  }
};

export default scraper;
