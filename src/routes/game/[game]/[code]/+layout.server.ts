// imports
import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import flagsmith from '$lib/flagsmith';
// games list
const envFlags = await flagsmith.getEnvironmentFlags();
const games = JSON.parse(envFlags.getFeatureValue('games'));

// verify game details
export const load = async ({ params }: RequestEvent) => {
	const game_code = params.code;
	try {
		if (game_code.length !== 5) throw new Error();
	} catch (e) {
		error(404, 'Not found');
	}

	return {
		game: params.game,
		gameID: game_code,
		game_name: games[params.game]?.toString()
	};
};
