// imports
import { joinGame, startNewGame } from './src/lib/server/mindsdb';
import { Server } from 'socket.io';

// base payload of ws input
type wsPayload = {
	gameID: string;
	userID: string;
	game: 'guess_the_prompt' | 'owoify_text';
};

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
			// log
			console.log(`Client Connected with ID:- ${socket.id}`);

			// on text-game player entry submission
			socket.on('updateUserEntry', (data: wsPayload & { ENTRY_VALUE: string; against: string }) => {
				io.emit('resultsPublished', {
					gameID: data.gameID,
					winnder: data.userID,
					looser: data.against
				});
			});

			// on new game
			socket.on('startGame', async (data: wsPayload) => {
				const id = data.gameID;
				const user = data.userID;
				const game = data.game;

				if (game == 'guess_the_prompt') {
					await startNewGame(user, game, id).then((x) => {
						if (x.type == 'error') {
							io.emit('serverError', {
								gameID: id,
								message: x.error_message
							})
							return
						}
						socket.emit('statusUpdate', {
							status: 'waiting',
							gameID: id,
							user,
							game
						});
					})
				}
			});

			// on join game
			socket.on('joinGame', async (data: wsPayload) => {
				const gameID = data.gameID;
				const hostID = data.userID;
				const userID = data.userID;
				const game = data.game;

				if (game == 'guess_the_prompt') {
					socket.emit('statusUpdate', {
						status: 'loading',
						gameID: gameID,
						user: userID,
						game,
						player: {
							id: hostID
						}
					});
					// meta @TODO
					const expectedText = 'TODO';
					const meta = 'IMAGE_LINK'
					await joinGame(gameID, userID, expectedText, meta).then((x) => {
						if (x.type == 'error') {
							io.emit('serverError', {
								gameID,
								message: x.error_message
							})
							return
						}
						io.emit('statusUpdate', {
							status: 'player_joined',
							gameID: gameID,
							user: hostID,
							game,
							player: {
								id: userID
							}
						});
					})
				}
			});

			socket.on('close', () => {
				console.log(`Client Disconnected with ID:- ${socket.id}`);
			});
		});
	}
};
