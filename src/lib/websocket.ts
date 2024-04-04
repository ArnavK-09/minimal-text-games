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
		pos: hostRes.score >= againstRes.score ? 1 : 2,
		name: game.host,
		accuracy: hostRes.accuracy,
		score: hostRes.score,
		role: 'host'
	});

	results.push({
		pos: results[0].pos == 1 ? 2 : 1,
		name: game.against,
		accuracy: againstRes.accuracy,
		score: againstRes.score,
		role: 'against'
	});

	return results;
};

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

					const checkRes = async () => {
						const GaME = await prisma.game.findUnique({
							where: {
								code: gameID,
								game: game
							}
						});
						if (GaME.hostEntry && GaME.againstEntry) {
							const results: PlayerResult[] = await genGameResult({
								expectedSentence: GaME.expectedResult!,
								hostSentence: GaME.hostEntry,
								againstSentence: GaME.againstEntry,
								game: GaME
							});

							io.emit('resultsPublished', {
								gameID: data.gameID,
								winner: results.find((x) => x.pos == 1) ?? GaME.host,
								looser: results.find((x) => x.pos == 2) ?? GaME.against,
								game: GaME.game,
								scores: results
							} as Results);

							await prisma.game.delete({
								where: {
									id: GaME.id,
									code: gameID
								}
							});
						}
					};

					if (GAME.host == user) {
						prisma.game
							.update({
								where: {
									id: GAME.id
								},
								data: {
									hostEntry: data.ENTRY_VALUE
								}
							})
							.then(() => {
								checkRes();
								io.emit('notifyPlayer', {
									message:
										'Host player just submitted their entry...Waiting for your submission...',
									gameID: gameID,
									userID: data.against
								});
							});

						checkRes();
					} else {
						prisma.game
							.update({
								where: {
									id: GAME.id
								},
								data: {
									againstEntry: data.ENTRY_VALUE
								}
							})
							.then(() => {
								checkRes();
								io.emit('notifyPlayer', {
									message:
										'Host player just submitted their entry...Waiting for your submission...',
									gameID: gameID,
									userID: data.against
								});
							});
						checkRes();
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
