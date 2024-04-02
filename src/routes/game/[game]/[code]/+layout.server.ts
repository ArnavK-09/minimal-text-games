// imports
import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import flagsmith from '$lib/flagsmith';
import prisma from '$lib/server/prisma';

// games list
const envFlags = await flagsmith.getEnvironmentFlags();
const games = JSON.parse(envFlags.getFeatureValue('games'));

// verify game details
export const load = async ({ params }: RequestEvent) => {
	// games that can be player single does not require to create multiplayer db instance
	const game_code = params.code;
	const game = params.game;
	const singleGames: Array<unknown> = envFlags.getFeatureValue('single_game') ?? [];

	try {
		if (game_code.length !== 5) throw new Error('Invalid Code');
		if (!singleGames.includes(game)) {
			const GAME = await prisma.game.findUnique({
				where: {
					code: game_code,
					game: game
				}
			});
			if (!GAME) throw new Error('Room not found..');
		}
	} catch (e: any) {
		error(404, e.message ?? 'Not found');
	}

	return {
		game: params.game,
		gameID: game_code,
		game_name: games[params.game]?.toString()
	};
};
