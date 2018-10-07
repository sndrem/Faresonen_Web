"use strict";

var express = require("express");

var axios = require("axios");

var constants = require("../constants/constants.js").default;

var altomfotballScraper = require("../services/altomfotballScraper").default;

var router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

// router.get("/*", (req, res) => {
// 	res.sendFile(path.join(__dirname), "build/index.html", err => {
// 		if (err) {
// 			res.status(500).send(err);
// 		}
// 	});
// });

/**
 * @api {get} /table/:tournamentId/:seasonId Get table for a given tournament and season
 * @apiName GetTable
 * @apiGroup Tables
 *
 * @apiParam {Number} tournamentId (e.g 230 for Premier League)
 * @apiParam {Number} seasonId (e.g 339 for Premier League in the season of 17/18)
 */
router.get("/table/:tournamentId/:seasonId", function (req, res) {
  var _req$params = req.params,
      tournamentId = _req$params.tournamentId,
      seasonId = _req$params.seasonId;

  var url = constants.TABLE_URL + "?start=" + constants.START_LIMIT + "&max=" + constants.MAX_LIMIT + "&tournamentId=" + tournamentId + "&seasonId=" + seasonId;
  axios.get(url).then(function (data) {
    res.json(data.data);
  }).catch(function (err) {
    res.json({
      error: "Could not get table for url: " + url,
      errorMessage: err
    });
  });
});

/**
 * @api {get} /matches/:tournamentId/:seasonId Get matches for a given tournament and season
 * @apiName GetMatches
 * @apiGroup Matches
 *
 * @apiParam {Number} tournamentId (e.g 230 for Premier League)
 * @apiParam {Number} seasonId (e.g 339 for Premier League in the season of 17/18)
 */
router.get("/matches/:tournamentId/:seasonId", function (req, res) {
  var _req$params2 = req.params,
      tournamentId = _req$params2.tournamentId,
      seasonId = _req$params2.seasonId;

  var url = constants.MATCHES_URL + "?start=" + constants.START_LIMIT + "&max=" + constants.MAX_LIMIT + "&tournamentId=" + tournamentId + "&seasonId=" + seasonId;
  axios.get(url).then(function (data) {
    res.json(data.data);
  }).catch(function (err) {
    res.json({
      error: "Could not get matches for " + url,
      errorMessage: err
    });
  });
});

/**
 * @api {get} /rounds/:tournamentId/:seasonId/ Get all rounds for a given tournament and season
 * @apiName GetRounds
 * @apiGroup Matches
 *
 * @apiParam {Number} tournamentId (e.g 230 for Premier League)
 * @apiParam {Number} seasonId (e.g 339 for Premier League in the season of 17/18)
 */
router.get("/rounds/:tournamentId/:seasonId", function (req, res) {
  var _req$params3 = req.params,
      tournamentId = _req$params3.tournamentId,
      seasonId = _req$params3.seasonId;

  var url = constants.ROUNDS_URL + "?start=" + constants.START_LIMIT + "&max=" + constants.MAX_LIMIT + "&tournamentId=" + tournamentId + "&seasonId=" + seasonId;
  axios.get(url).then(function (data) {
    res.json(data.data);
  }).catch(function (err) {
    res.json({
      error: "Could not get rounds for " + url,
      errorMessage: err
    });
  });
});

/**
 * @api {get} /rounds/:roundId Get all rounds for a given id
 * @apiName GetRoundsPerRoundId
 * @apiGroup Matches
 *
 * @apiParam {Number} roundId
 */
router.get("/rounds/:roundId", function (req, res) {
  var roundId = req.params.roundId;

  var url = constants.SPECIFIC_ROUND_URL(roundId) + "?start=" + constants.START_LIMIT + "&max=" + constants.MAX_LIMIT;
  axios.get(url).then(function (data) {
    return res.json(data.data);
  }).catch(function (err) {
    res.json({
      error: "Could not get rounds for " + url,
      errorMessage: err
    });
  });
});

/**
 * @api {get} /players/:tournamentId/:seasonId/:teamId Get all player for a team
 * @apiName GetPlayers
 * @apiGroup Players
 *
 * @apiParam {Number} tournamentId (e.g 230 for Premier League)
 * @apiParam {Number} seasonId (e.g 339 for Premier League in the season of 17/18)
 * @apiParam {Number} teamId (e.g 740 for Tottenham)
 */
router.get("/players/:tournamentId/:seasonId/:teamId", function (req, res) {
  var _req$params4 = req.params,
      tournamentId = _req$params4.tournamentId,
      seasonId = _req$params4.seasonId,
      teamId = _req$params4.teamId;

  var url = constants.PLAYERS_URL + "?tournamentId=" + tournamentId + "&seasonId=" + seasonId + "&teamId=" + teamId + "&start=" + constants.START_LIMIT + "&max=" + constants.MAX_LIMIT;
  axios.get(url).then(function (data) {
    res.json(data.data);
  }).catch(function (err) {
    res.json({
      error: "Could not get players for url " + url,
      errorMessage: err
    });
  });
});

/**
 * @api {get} /statistics/yellowcards/:tournamentId/ Get all yellow cards for a tournament
 * @apiName GetYellowCards
 * @apiGroup Statistics
 *
 * @apiParam {Number} tournamentId (e.g 230 for Premier League)
 */
router.get("/statistics/yellowcards/:tournamentId", altomfotballScraper.getYellowCards, function (req, res) {
  // console.log(res.players);
  res.json({ data: res.players });
});

/**
 * @api {get} /statistics/topscorers/:tournamentId/ Get topscorers a tournament
 * @apiName GetTopscorers
 * @apiGroup Statistics
 *
 * @apiParam {Number} tournamentId (e.g 230 for Premier League)
 */
router.get("/statistics/topscorers/:tournamentId", altomfotballScraper.getTopScorers, function (req, res) {
  res.json({ data: res.players });
});

router.get("/statistics/allDangerzonePlayers", altomfotballScraper.getAllDangerzonePlayers, function (req, res) {
  res.json(res.players);
});

router.post("/leagues/all", function (req, res) {
  var _req$body = req.body,
      max = _req$body.max,
      sportId = _req$body.sportId,
      filterImportant = _req$body.filterImportant;

  altomfotballScraper.getAllLeagues(max, sportId, filterImportant).then(function (data) {
    res.status(200).json(data.data);
  }).catch(function (err) {
    console.log(err);
    res.status(404).json({ error: "Could not get leagues" });
  });
});

module.exports = router;
//# sourceMappingURL=index.js.map