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
		value1,
		value2,
		value3
	};
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
			getStatistics(constants.YELLOW_CARD_STATISTICS, 230),
			getStatistics(constants.YELLOW_CARD_STATISTICS, 231)
		];

		axios
			.all(urls)
			.then(
				axios.spread((pl, ch) => {
					res.players = {
						pl,
						ch
					};
					next();
				})
			)
			.catch(err => {
				res.players = {
					pl: [],
					ch: []
				};
				next();
			});
	}
};

export default scraper;
