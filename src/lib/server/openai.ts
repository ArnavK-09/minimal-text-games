/**
 * Imports
 */
import OpenAI from 'openai';
import { RPG_PROMPT } from '$lib/utils';
// import { OPENAI_API_KEY } from '$env/static/private';

/**
 * Custom config
 */
const HOST = 'https://api.naga.ac/v1'; // custom host for deploying

/**
 * New open ai client
 */
const openai = new OpenAI({
	// apiKey: OPENAI_API_KEY,
	baseURL: HOST
});

/**
 * Generates random single line sentence
 */
export const randomSentence = async (): Promise<string> => {
	const PROMPT =
		'Type me a minimal single line sentence, at least 12 words, in pure english and no mistakes! Just respond with text nothing else.';
	const chatCompletion = await openai.chat.completions.create({
		messages: [{ role: 'user', content: PROMPT }],
		model: 'gpt-3.5-turbo'
	});
	return (
		chatCompletion.choices[0].message.content?.toString() ??
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Interdum velit laoreet id donec ultrices tincidunt arcu.'
	);
};

/**
 * Returns stats of player's text according to expected text
 */
export const findAcuracy = async (
	expectedText: string,
	playerSentence: string
): Promise<{ score: string; accuracy: string }> => {
	const PROMPT = `Act like a score & accuracy calculator & respond with score and accuracy of User, if sentence more matches expected text increase score and accuracy or vice versa!\nRespond in this format on: <score>||<accuracy> (ie seperate score and accuracy by ||).\n Score should be number ranges from 10-100 and accuracy should be float from 0.1-10.0! Make sure you response accuratly and in format, DO NOT ADD ANYTHING EXTRA! Don't be strict, be leanient in marking.  Expected Text: ${expectedText}\nUser Entered Sentence: ${playerSentence}`;
	const chatCompletion = await openai.chat.completions.create({
		messages: [{ role: 'user', content: PROMPT }],
		model: 'gpt-3.5-turbo'
	});
	const res: string = chatCompletion.choices[0].message.content ?? '50||6.9';
	const results = res.split('||');
	console.log(res);
	return {
		score: results[0],
		accuracy: results[1]
	};
};

/**
 * Generated image
 */
export const genImage = async (): Promise<{ image: string; title: string }> => {
	const imgPrompt =
		(
			await openai.chat.completions.create({
				messages: [
					{
						role: 'user',
						content:
							'Type me a minimal single line PROMPT FOR DALLE IMAGE GENERATOR, at least 12 words, use simple filter too, make sure to use simple prompt that a user can guess by just looking at image, in pure english and no mistakes! Just respond with text nothing else.'
					}
				],
				model: 'gpt-3.5-turbo'
			})
		).choices[0].message.content ?? 'an image of earth';

	const image = await openai.images.generate({
		prompt: imgPrompt,
		n: 1,
		size: '1024x1024',
		model: 'sdxl'
	});

	return {
		image: image.data[0].url ?? '/loading.svg',
		title: imgPrompt
	};
};

/**
 * For chat RPG
 */
export async function contactRPG(message: string = 'Guide me...') {
	const chatCompletion = await openai.chat.completions.create({
		messages: [{ role: 'user', content: RPG_PROMPT + '\n' + message }],
		model: 'gpt-3.5-turbo'
	});
	return chatCompletion.choices[0].message.content ?? 'Internal Issue...';
}
