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

module.exports = fantasyPlRouter;
