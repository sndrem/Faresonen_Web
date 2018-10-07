"use strict";

var express = require("express");
var fplapi = require("fpl-api-node");

var fantasyPlRouter = express.Router();

/* GET home page. */
fantasyPlRouter.get("/", function (req, res) {
  res.status(200).json({ text: "Hello" });
});

fantasyPlRouter.get("/players", function (req, res) {
  fplapi.getElements().then(function (data) {
    res.status(200).json(data);
  }).catch(function (err) {
    return res.status(400).json(err);
  });
});

fantasyPlRouter.get("/teams", function (req, res) {
  fplapi.getTeams().then(function (data) {
    res.status(200).json(data);
  }).catch(function (err) {
    return res.status(400).json(err);
  });
});

fantasyPlRouter.get("/player/:playerId", function (req, res) {
  var playerId = req.params.playerId;


  fplapi.getElements().then(function (data) {
    var playerData = data.find(function (player) {
      return player.id === parseInt(playerId, 10);
    });
    if (playerData) {
      res.status(200).json(playerData);
    } else res.status(400).json({});
  });
});

fantasyPlRouter.get("/team/:teamId", function (req, res) {
  var teamId = req.params.teamId;

  fplapi.getTeams().then(function (data) {
    var team = data.find(function (t) {
      return t.code === parseInt(teamId, 10);
    });
    if (!team) {
      res.status(400).json({});
    } else res.status(200).json(team);
  });
});

module.exports = fantasyPlRouter;
//# sourceMappingURL=fantasyPl.js.map