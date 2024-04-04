// imports
import prisma from '$lib/server/prisma';
import type { Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';

// Action to check game server code
export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const code = data.get('code')?.toString();

		if (code?.length !== 5) {
			return fail(400, {
				error: 'Game ID Must be of 5 characters....'
			});
		}
		const game = await prisma.game.findUnique({
			where: {
				code: code
			}
		});

		if (!game) {
			return fail(400, {
				error: 'No game found with that code...'
			});
		}

		return redirect(301, `/game/${game?.game}/${game?.code}/player`);
	}
};
