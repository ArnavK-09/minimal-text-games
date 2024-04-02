// imports
import * as gemini from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import { RPG_PROMPT } from '$lib/utils';

export async function contactGemini(message: string = 'Guide me...') {
	try {
		const genAI = new gemini.GoogleGenerativeAI(GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

		const CHAT = model.startChat();
		const result = await CHAT.sendMessage([
			{
				text: RPG_PROMPT + '\n' + message
			}
		]);
		const response = result.response;
		const text = response.text();
		return text;
	} catch {
		throw new Error('Internal issue');
	}
}
