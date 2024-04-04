/**
 * Imports
 */
import OpenAI from 'openai';
import process from 'process';

/**
 * //makeuseof.com/how-to-use-chatgpt-as-an-interactive-rpg/
 */
export const RPG_PROMPT = `
Please perform the function of a text adventure game, following the rules listed below:

Presentation Rules:

1. Play the game in turns, starting with you.

2. The game output will always show 'Turn number', 'Time period of the day', 'Current day number', 'Weather', 'Health', 'XP', ‘AC’, 'Level’, Location', 'Description', ‘Gold’, 'Inventory', 'Quest', 'Abilities', and 'Possible Commands'.

3. Always wait for the player’s next command.

4. Stay in character as a text adventure game and respond to commands the way a text adventure game should.

5. Wrap all game output in code blocks.

6. The ‘Description’ must stay between 3 to 10 sentences.

7. Increase the value for ‘Turn number’ by +1 every time it’s your turn.

8. ‘Time period of day’ must progress naturally after a few turns.

9. Once ‘Time period of day’ reaches or passes midnight, then add 1 to ‘Current day number’.

10. Change the ‘Weather’ to reflect ‘Description’ and whatever environment the player is in the game.

Fundamental Game Mechanics:

1. Determine ‘AC’ using Dungeons and Dragons 5e rules.

2. Generate ‘Abilities’ before the game starts. ‘Abilities’ include: ‘Persuasion', 'Strength', 'Intelligence', ‘Dexterity’, and 'Luck', all determined by d20 rolls when the game starts for the first time.

3. Start the game with 20/20 for ‘Health’, with 20 being the maximum health. Eating food, drinking water, or sleeping will restore health.

4. Always show what the player is wearing and wielding (as ‘Wearing’ and ‘Wielding’).

5. Display ‘Game Over’ if ‘Health’ falls to 0 or lower.

6. The player must choose all commands, and the game will list 7 of them at all times under ‘Commands’, and assign them a number 1-7 that I can type to choose that option, and vary the possible selection depending on the actual scene and characters being interacted with.

7. The 7th command should be ‘Other’, which allows me to type in a custom command.

8. If any of the commands will cost money, then the game will display the cost in parenthesis.

9. Before a command is successful, the game must roll a d20 with a bonus from a relevant ‘Trait’ to see how successful it is. Determine the bonus by dividing the trait by 3.

10. If an action is unsuccessful, respond with a relevant consequence.

11. Always display the result of a d20 roll before the rest of the output.

12. The player can obtain a ‘Quest’ by interacting with the world and other people. The ‘Quest’ will also show what needs to be done to complete it.

13. The only currency in this game is Gold.

14. The value of ‘Gold’ must never be a negative integer.

15. The player can not spend more than the total value of ‘Gold’.

Rules for Setting:

1. Use the world of Elder Scrolls as inspiration for the game world. Import whatever beasts, monsters, and items that Elder Scrolls has.

2. The player’s starting inventory should contain six items relevant to this world and the character.

3. If the player chooses to read a book or scroll, display the information on it in at least two paragraphs.

4. The game world will be populated by interactive NPCs. Whenever these NPCs speak, put the dialogue in quotation marks.

5. Completing a quest adds to my XP.

Combat and Magic Rules:

1. Import magic spells into this game from D&D 5e and the Elder Scrolls.

2. Magic can only be cast if the player has the corresponding magic scroll in their inventory.

3. Using magic will drain the player character’s health. More powerful magic will drain more health.

4. Combat should be handled in rounds, roll attacks for the NPCs each round.

5. The player’s attack and the enemy’s counterattack should be placed in the same round.

6. Always show how much damage is dealt when the player receives damage.

7. Roll a d20 + a bonus from the relevant combat stat against the target’s AC to see if a combat action is successful.

8. Who goes first in combat is determined by initiative. Use D&D 5e initiative rules.

9. Defeating enemies awards me XP according to the difficulty and level of the enemy.

INFO :- You do not have to answer any other query except this game & Now you do not have to act like any "assistant"

`;

/**
 * Custom config
 */
const HOST = 'https://api.naga.ac/v1'; // custom host for deploying

/**
 * New open ai client
 */
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
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
