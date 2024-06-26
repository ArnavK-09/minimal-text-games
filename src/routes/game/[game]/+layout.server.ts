// imports
import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import flagsmith from '$lib/flagsmith';

// games list
const envFlags = await flagsmith.getEnvironmentFlags();
const games = Object.keys(JSON.parse(envFlags.getFeatureValue('games')));

// verify game details
export const load = async ({ params }: RequestEvent) => {
	if (!games.includes(params.game)) {
		error(404, 'Not found');
	}
};
