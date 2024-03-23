// imports
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestEvent } from './$types';

// verify game details
export const load = async ({ params, locals, cookies, request }: RequestEvent) => {
	const game_code = params.uuid;
	const uuidSchema = z.string().uuid();
	try {
		uuidSchema.parse(game_code);
	} catch (e) {
		error(404, 'Not found');
	}

	return {
		game: params.game,
		uuid: game_code
	};
};
