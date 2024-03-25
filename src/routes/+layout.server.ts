// imports
import flagsmith from '$lib/flagsmith';
import type { Flag } from 'flagsmith-nodejs/build/sdk/models';
import type { LayoutServerLoad } from './$types';
import { nanoid } from 'nanoid';

// Return all flagsmith flags
export const load: LayoutServerLoad = async (event) => {
	const envFlags = await flagsmith.getEnvironmentFlags();
	const flags: Flag[] = envFlags.allFlags();

	// user auth
	let userID = event.cookies.get('userID');
	if (!userID) {
		userID = nanoid(16);
		event.cookies.set('userID', userID, {
			httpOnly: true,
			maxAge: 1000 * 60 * 24,
			path: '/'
		});
	}

	return {
		project_ready: envFlags.getFeatureValue('project_ready'),
		games: JSON.parse(envFlags.getFeatureValue('games')),
		icons: JSON.parse(envFlags.getFeatureValue('games_icons')),
		userID: event.cookies.get('userID')!.toString(),
		flags: flags.map((x) => {
			return {
				value: x.value,
				name: x.featureName
			};
		})
	};
};
