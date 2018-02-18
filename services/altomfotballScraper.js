const request = require('request');
const cheerio = require('cheerio');
const constants = require('../constants/constants').default;

const scraper = {
	getYellowCards(req, res, next) {
		const { tournamentId } = req.params;
		if (isNaN(tournamentId)) {
			throw new Error('TournamentId is not valid. Must be a number');
		}

		request.get(`${constants.YELLOW_CARD_STATISTICS}${tournamentId}`, (err, response, html) => {
			if (err) {
				res.error = `Could not get yellow cards for ${tournamentId}`;
			}

			const $ = cheerio.load(html);
			const players = [];
			$('table tbody tr').each((i, elem) => {
				const playerData = $(elem);
				const place = parseInt($(elem).children('td').eq(0).text().replace('.', ""));
				const name = $(elem).children('td').eq(1).find('a').eq(0).text();
				const team = $(elem).children('td').eq(2).find('a').eq(0).text();
				const yellowCards = parseInt($(elem).children('td').eq(3).text());
				const matches = parseInt($(elem).children('td').eq(4).text());
				const average = parseFloat($(elem).children('td').eq(5).text());
				const playerDataList = [];

				players.push({
					place,
					name,
					team,
					yellowCards,
					matches,
					average
				});
			});
			res.players = players;

			next();
		});
	}
};

export default scraper;
