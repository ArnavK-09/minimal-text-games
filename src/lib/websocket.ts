// imports
import prisma from './server/prisma';
import { Server } from 'socket.io';
import owoify from 'owoify-js';
import { findAcuracy, genImage, randomSentence } from './server/openai';
import type { Game } from '@prisma/client';

// base payload of ws input
export type gamesT = 'guess_the_prompt' | 'owoify_text';
export type wsPayload = {
	gameID: string;
	userID: string;
	game: gamesT;
};
export type PlayerResult = {
	pos: number;
	name: string;
	accuracy: number | string;
	score: number | string;
	role: 'host' | 'against';
};
export interface Results {
	gameID: string;
	winner: string;
	looser: string;
	game: string;
	scores: PlayerResult[];
}

export type GameMetaQuestion = {
	expected: string;
	question: string;
};

const genGameResult = async ({
	expectedSentence,
	hostSentence,
	againstSentence,
	game
}: {
	expectedSentence: string;
	hostSentence: string;
	againstSentence: string;
	game: Game;
}): Promise<PlayerResult[]> => {
	const results: PlayerResult[] = [];
	const hostRes = await findAcuracy(expectedSentence, hostSentence);
	const againstRes = await findAcuracy(expectedSentence, againstSentence);

	results.push({
		pos: hostRes.score > againstRes.score ? 1 : 2,
		name: game.host,
		accuracy: hostRes.accuracy,
		score: hostRes.score,
		role: 'host'
	});

	results.push({
		pos: againstRes.score > hostRes.score ? 1 : 2,
		name: game.host,
		accuracy: againstRes.accuracy,
		score: againstRes.score,
		role: 'against'
	});

	return results;
};

// const DEP_GAMES_RESULTS: {
// 	owoify_text: ({
// 		expectedSentence,
// 		hostSentence,
// 		againstSentence,
// 		game
// 	}: {
// 		expectedSentence: string;
// 		hostSentence: string;
// 		againstSentence: string;
// 		game: Game;
// 	}) => PlayerResult[];
// 	guess_the_prompt: ({
// 		expectedSentence,
// 		hostSentence,
// 		againstSentence,
// 		game
// 	}: {
// 		expectedSentence: string;
// 		hostSentence: string;
// 		againstSentence: string;
// 		game: Game;
// 	}) => PlayerResult[];
// } = {
// 	owoify_text: ({ expectedSentence, hostSentence, againstSentence, game }) => {
// 		return [
// 			{
// 				pos: 1,
// 				name: game.host,
// 				accuracy: 1,
// 				score: 1,
// 				role: 'host'
// 			},
// 			{
// 				pos: 2,
// 				name: game.against!.toString(),
// 				accuracy: 1,
// 				score: 1,
// 				role: 'against'
// 			}
// 		];
// 	},
// 	guess_the_prompt: () => {
// 		return [
// 			{
// 				pos: 1,
// 				name: 'hi',
// 				accuracy: 1,
// 				score: 1,
// 				role: 'host'
// 			},
// 			{
// 				pos: 2,
// 				name: 'hi',
// 				accuracy: 1,
// 				score: 1,
// 				role: 'against'
// 			}
// 		];
// 	}
// };

const GAMES_META: {
	owoify_text: () => Promise<GameMetaQuestion>;
	guess_the_prompt: () => Promise<GameMetaQuestion>;
} = {
	owoify_text: async () => {
		const sentence = await randomSentence();
		// @ts-expect-error - wrong types imported
		const res = owoify.default(sentence, 'uvu');

		return {
			expected: sentence,
			question: res
		};
	},
	guess_the_prompt: async () => {
		const data = await genImage();
		return {
			expected: data.title,
			question: data.image.toString()
		};
	}
};

/**
 * Err Handler
 */
process.on('unhandledRejection', (e) => console.error(e));

export default {
	name: 'webSocketServer',
	configureServer(server: any) {
		// new server
		const io = new Server(server.httpServer, {
			cookie: true
		});

		// on connection
		io.on('connection', (socket) => {
			// on text-game player entry submission
			socket.on(
				'updateUserEntry',
				async (data: wsPayload & { ENTRY_VALUE: string; against: string }) => {
					const gameID = data.gameID;
					const user = data.userID;
					const game = data.game;
					const GAME = await prisma.game.findUnique({
						where: {
							code: gameID,
							game: game
						}
					});
					if (!GAME) {
						return socket.emit('serverError', {
							gameID: gameID,
							message: 'No game found with that code...'
						});
					}

					try {
						if (GAME.host == user) {
							await prisma.game.update({
								where: {
									id: GAME.id
								},
								data: {
									hostEntry: data.ENTRY_VALUE
								}
							});
							io.emit('notifyPlayer', {
								message: 'Host player just submitted their entry...Waiting for your submission...',
								gameID: gameID,
								userID: data.against
							});
						} else if (GAME.host !== user) {
							await prisma.game.update({
								where: {
									id: GAME.id
								},
								data: {
									againstEntry: data.ENTRY_VALUE
								}
							});
							io.emit('notifyPlayer', {
								message: 'Other player just submitted their entry...Waiting for your submission...',
								gameID: gameID,
								userID: GAME.host
							});
						}
					} catch {
						io.emit('serverError', {
							gameID: gameID,
							message: 'Internal error...'
						});
					} finally {
						if (GAME.hostEntry && GAME.againstEntry) {
							const results: PlayerResult[] = await genGameResult({
								expectedSentence: GAME.expectedResult!,
								hostSentence: GAME.hostEntry,
								againstSentence: GAME.againstEntry,
								game: GAME
							});

							io.emit('resultsPublished', {
								gameID: data.gameID,
								winner: results.find((x) => x.pos == 1) ?? GAME.host,
								looser: results.find((x) => x.pos == 2) ?? GAME.against,
								game: GAME.game,
								scores: results
							} as Results);

							await prisma.game.delete({
								where: {
									id: GAME.id,
									code: gameID
								}
							});
						}
					}
				}
			);

			// on new game
			socket.on('startGame', async (data: wsPayload) => {
				const id = data.gameID;
				const user = data.userID;
				const game = data.game;

				const GAME = await prisma.game.findUnique({
					where: {
						code: id,
						host: user,
						game: game
					}
				});

				if (!GAME) {
					io.emit('serverError', {
						gameID: id,
						message: 'No game found with that code...'
					});
				} else {
					socket.emit('statusUpdate', {
						status: 'waiting',
						gameID: id,
						userID: user,
						game
					} as wsPayload);
				}
			});
			// on join game
			socket.on('joinGame', async (data: wsPayload) => {
				const gameID = data.gameID;
				const userID = data.userID;
				const game = data.game;

				const GAME = await prisma.game.findUnique({
					where: {
						code: gameID,
						game: game
					}
				});

				if (!GAME) {
					socket.emit('serverError', {
						gameID: gameID,
						message: 'No game found with that code...'
					});
				} else {
					const GAME_DATA: GameMetaQuestion =
						typeof GAMES_META[game] == 'function'
							? await GAMES_META[game]()
							: ({ question: 'Internal error....' } as GameMetaQuestion);

					await prisma.game.update({
						where: {
							code: gameID,
							game: game
						},
						data: {
							against: userID,
							expectedResult: GAME_DATA.expected.toString()
						}
					});
					socket.emit('statusUpdate', {
						status: 'player_joined',
						gameID: gameID,
						userID: userID,
						game,
						meta: GAME_DATA.question,
						player: {
							id: GAME.host
						}
					} as wsPayload & {
						meta: string;
						player: {
							id: string;
						};
					});
					io.emit('statusUpdate', {
						status: 'player_joined',
						gameID: gameID,
						userID: GAME.host,
						game,
						meta: GAME_DATA.question,
						player: {
							id: userID
						}
					} as wsPayload & {
						meta: string;
						player: {
							id: string;
						};
					});
				}
			});

			socket.on('close', () => {
				console.info(`Client Disconnected with ID:- ${socket.id}`);
			});
		});
	}
};
