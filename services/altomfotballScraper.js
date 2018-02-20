const request = require('request');
const cheerio = require('cheerio');
const constants = require('../constants/constants').default;

const scraper = {
	getYellowCards(req, res, next) {
		getStatistics(constants.YELLOW_CARD_STATISTICS, req.params.tournamentId).then((data) => {
			res.players = data;
			next();
		}).catch((err) => {
			throw new Error(err);
		});
	},

	getTopScorers(req, res, next) {
		getStatistics(constants.TOPSCORER_STATISTICS, req.params.tournamentId).then((data) => {
			res.players = data;
			next();
		}).catch((err) => {
			throw new Error(err);
		});
	}
};

function getStatistics(url, tournamentId, keys) {
	return new Promise((resolve, reject) => {
		if (isNaN(tournamentId)) {
			reject('TournamentId is not valid. Must be a number');
	}

	request.get(`${url}${tournamentId}`, (err, response, html) => {
		if (err) {
			res.error = `Could not get statistics for url: ${url} with tournament ID: ${tournamentId}`;
		}
		const $ = cheerio.load(html);
		const players = [];
		$('table tbody tr').each((i, elem) => {
			const playerData = extractValues(elem, $);
			players.push(playerData);
		});
			resolve(players);
		});	
	});
		
}

function extractValues(tablerow, html) {
	const playerData = html(tablerow);
	const place = parseInt(html(tablerow).children('td').eq(0).text().replace('.', ''));
	const name = html(tablerow).children('td').eq(1).find('a').eq(0).text();
	const team = html(tablerow).children('td').eq(2).find('a').eq(0).text();
	const value1 = parseInt(html(tablerow).children('td').eq(3).text(), 10);
	const value2 = parseInt(html(tablerow).children('td').eq(4).text(), 10);
	const value3 = parseFloat(html(tablerow).children('td').eq(5).text().replace(',', '.'));

	return {
		place,
		name,
		team,
		value1,
		value2,
		value3		
	}
}

export default scraper;
