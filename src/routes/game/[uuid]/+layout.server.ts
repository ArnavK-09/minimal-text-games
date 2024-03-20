// imports 
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../../$types';
import { z } from 'zod';


// verify game details 
export const load: LayoutServerLoad = async ({ params }) => {
    const game_code = (params.uuid)
    const uuidSchema = z.string().uuid();
    try {
        uuidSchema.parse(game_code)
    } catch (e) {
        error(404, 'Not found');
    }
};
