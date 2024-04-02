// imports
import flagsmith from '$lib/flagsmith.js';
import prisma from '$lib/server/prisma.js';
import type { Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';

const envFlags = await flagsmith.getEnvironmentFlags();

// Action to check game server code
export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const code = data.get('code')?.toString();
		const userID = data.get('userID')!.toString();
		const game = data.get('game')!.toString();
		// games that can be player single does not require to create multiplayer db instance
		const singleGames: Array<unknown> = envFlags.getFeatureValue('single_game') ?? [];

		if (code?.toString().length !== 5) {
			return fail(400, {
				error: 'Invalid code provided...' + envFlags.getFeatureValue('single_game')
			});
		}

		if (!singleGames.includes(game)) {
			try {
				await prisma.game.create({
					data: {
						code: code,
						host: userID,
						game: game
					}
				});
			} catch (e: any) {
				return fail(400, {
					error: e.message ?? 'Internal error...'
				});
			}
		}

		return redirect(301, `${code}`);
	}
};
