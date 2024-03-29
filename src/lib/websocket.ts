// imports
import prisma from './prisma';
import { Server } from 'socket.io';

// base payload of ws input
type wsPayload = {
	gameID: string;
	userID: string;
	game: 'guess_the_prompt' | 'owoify_text';
};
type PlayerResult = {
	pos: number;
	name: string;
	accuracy: number;
	score: number;
	role: 'host' | 'against';
};
interface Results {
	gameID: string;
	winner: string;
	looser: string;
	game: string;
	scores: PlayerResult[];
}

process.on('unhandledRejection', (e) => console.error(e));

// vite ws handler
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
							io.emit('resultsPublished', {
								gameID: data.gameID,
								winner: GAME.host,
								looser: GAME.against,
								game: GAME.game,
								scores: [
									{
										pos: 1,
										name: GAME.host,
										accuracy: 1,
										score: 1,
										role: 'host'
									},
									{
										pos: 2,
										name: GAME.against,
										accuracy: 1,
										score: 1,
										role: 'against'
									}
								]
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
						user,
						game
					});
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
					await prisma.game.update({
						where: {
							code: gameID,
							game: game
						},
						data: {
							against: userID
						}
					});
					socket.emit('statusUpdate', {
						status: 'player_joined',
						gameID: gameID,
						user: userID,
						game,
						meta: 'TOOD',
						player: {
							id: GAME.host
						}
					});
					io.emit('statusUpdate', {
						status: 'player_joined',
						gameID: gameID,
						user: GAME.host,
						game,
						meta: 'TOOD',
						player: {
							id: userID
						}
					});
				}
			});

			socket.on('close', () => {
				console.info(`Client Disconnected with ID:- ${socket.id}`);
			});
		});
	}
};
