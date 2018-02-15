const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

/**
* @api {get} /table/:tournamentId/:seasonId Get table for a given tournament and season
* @apiName GetTable
* @apiGroup Tables
*
* @apiParam {Number} tournamentId (e.g 230 for Premier League)
* @apiParam {Number} seasonId (e.g 339 for Premier League in the season of 17/18)
* 
*/

module.exports = router;
