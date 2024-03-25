// imports
import type { Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';

// Action to check game server code
export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const code = data.get('code')?.toString();
		const game = 'guess_the_prompt'; //todo
		if (code?.length !== 5) {
			return fail(400, {
				error: 'Game ID Must be of 5 characters....'
			});
		}
		return redirect(301, `/game/${game}/${code}/player`);
	}
};
