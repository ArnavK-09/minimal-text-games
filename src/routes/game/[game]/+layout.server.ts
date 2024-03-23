// imports
import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

// games list
const games = ['guess'];

// verify game details
export const load = async ({ params }: RequestEvent) => {
	if (!games.includes(params.game)) {
		error(404, 'Not found');
	}
};
