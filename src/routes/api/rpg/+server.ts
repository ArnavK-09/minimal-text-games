import { contactRPG } from '$lib/server/openai';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (e) => {
	const message: string = e.url.searchParams.get('query') ?? '';
	const res = await contactRPG(message).catch((e) => e.message + '\nInternal Error..');
	return new Response(res.toString());
};
