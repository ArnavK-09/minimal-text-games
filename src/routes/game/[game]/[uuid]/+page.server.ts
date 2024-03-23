// imports
import { type Actions } from '@sveltejs/kit';

// game user logic
export const actions: Actions = {
	default: async ({ request, params }) => {
		const data = await request.formData();
		const user_input = data.get('input');
		const game_code = params.uuid;
	}
};
