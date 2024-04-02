import { contactGemini } from '$lib/server/gemini';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (e) => {
	const message: string = e.url.searchParams.get('query') ?? '';
	const res = await contactGemini(message).catch(() => 'Internal Error..');
	return new Response(res.toString());
};
