const express = require("express");
const fplapi = require("fpl-api-node");

const fantasyPlRouter = express.Router();

/* GET home page. */
fantasyPlRouter.get("/", (req, res) => {
  res.status(200).json({ text: "Hello" });
});

fantasyPlRouter.get("/players", (req, res) => {
  fplapi
    .getElements()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => res.status(400).json(err));
});

fantasyPlRouter.get("/teams", (req, res) => {
  fplapi
    .getTeams()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => res.status(400).json(err));
});

fantasyPlRouter.get("/player/:playerId", (req, res) => {
  const { playerId } = req.params;

  fplapi.getElements().then(data => {
    const playerData = data.find(
      player => player.id === parseInt(playerId, 10)
    );
    if (playerData) {
      res.status(200).json(playerData);
    } else res.status(400).json({});
  });
});

fantasyPlRouter.get("/team/:teamId", (req, res) => {
  const { teamId } = req.params;
  fplapi.getTeams().then(data => {
    const team = data.find(t => {
      return t.code === parseInt(teamId, 10);
    });
    if (!team) {
      res.status(400).json({});
    } else res.status(200).json(team);
  });
});

module.exports = fantasyPlRouter;
