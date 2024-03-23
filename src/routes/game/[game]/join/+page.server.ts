// imports
import type { Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';

// Action to check game server code
export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const code = data.get('code');
		if (code?.length !== 5) {
			return fail(400, {
				error: 'Invalid Game ID Provided for Joining....'
			});
		}
		return redirect(301, `/game/${code}`);
	}
};
