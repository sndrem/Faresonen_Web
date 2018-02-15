const constants = {
	START_LIMIT: 0,
	MAX_LIMIT: 1000,
	TABLE_URL: 'http://api.tv2.no/sport/resources/table',
	MATCHES_URL: 'http://api.tv2.no/sport/resources/matches',
	ROUNDS_URL: 'http://api.tv2.no/sport/resources/rounds',
	SPECIFIC_ROUND_URL (id) { return `http://api.tv2.no/sport/resources/rounds/${id}/matches/`; },
	PLAYERS_URL: 'http://api.tv2.no/sport/resources/people'
};

export default constants;
