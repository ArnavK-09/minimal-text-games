// imports 
import flagsmith from '$lib/flagsmith';
import type { Flag } from 'flagsmith-nodejs/build/sdk/models';
import type { LayoutServerLoad } from './$types';
import mindsdb from '$lib/server/mindsdb';

// Return all flagsmith flags 
export const load: LayoutServerLoad = async () => {
    const envFlags = await flagsmith.getEnvironmentFlags()
    const flags: Flag[] = envFlags.allFlags()
    mindsdb()
    return {
        project_ready: envFlags.getFeatureValue('project_ready'),
        flags: flags.map(x => {
            return {
                value: x.value, 
                name: x.featureName
            }
        })
    };
};