const express = require('express');

const axios = require('axios');

const constants = require('../constants/constants.js').default;

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
*/
router.get('/table/:tournamentId/:seasonId', (req, res) => {
	const { tournamentId, seasonId } = req.params;
	const url = `${constants.TABLE_URL}?start=0&max=38&tournamentId=${tournamentId}&seasonId=${seasonId}`;
	axios.get(url)
		.then((data) => {
			res.json(data.data);
		})
		.catch((err) => {
			res.json({
				error: `Could not get table for url: ${url}`,
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
router.get('/matches/:tournamentId/:seasonId', (req, res) => {
	const { tournamentId, seasonId } = req.params;
	const url = `${constants.MATCHES_URL}?start=0&max=1000&tournamentId=${tournamentId}&seasonId=${seasonId}`;
	axios.get(url).then(data => res.json(data.data)).catch(err => res.json({ error: `Could not get matches for ${url}`, errorMessage: err }));
});

/**
* @api {get} /rounds/:tournamentId/:seasonId/:round Get all rounds for a given tournament and season
* @apiName GetRounds
* @apiGroup Matches
*
* @apiParam {Number} tournamentId (e.g 230 for Premier League)
* @apiParam {Number} seasonId (e.g 339 for Premier League in the season of 17/18)
*/
router.get('/rounds/:tournamentId/:seasonId', (req, res) => {
	const { tournamentId, seasonId } = req.params;
	const url = `${constants.ROUNDS_URL}?start=0&max=1000&tournamentId=${tournamentId}&seasonId=${seasonId}`;
	axios.get(url).then(data => res.json(data.data)).catch(err => res.json({ error: `Could not get rounds for ${url}`, errorMessage: err }));
});

module.exports = router;
