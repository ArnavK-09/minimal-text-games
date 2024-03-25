import { Server } from 'socket.io';

type wsPayload = {
	gameID: string;
	userID: string;
	game: 'guess_the_prompt' | 'owoify_text';
};

export default {
	name: 'webSocketServer',
	configureServer(server: any) {
		// new server
		const io = new Server(server.httpServer, {
			cookie: true
		});

		io.on('connection', (socket) => {
			console.log(`Client Connected with ID:- ${socket.id}`);

			socket.on('updateUserEntry', (data: wsPayload & { ENTRY_VALUE: string; against: string }) => {
				io.emit('resultsPublished', {
					gameID: data.gameID,
					winnder: data.userID,
					looser: data.against
				});
			});

			socket.on('startGame', (data: wsPayload) => {
				const id = data.gameID;
				const user = data.userID;
				const game = data.game;

				if (game == 'guess_the_prompt') {
					socket.emit('statusUpdate', {
						status: 'waiting',
						gameID: id,
						user,
						game
					});
				}
			});

			socket.on('joinGame', (data: wsPayload) => {
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
					io.emit('statusUpdate', {
						status: 'player_joined',
						gameID: gameID,
						user: hostID,
						game,
						player: {
							id: userID
						}
					});
				}
			});

			socket.on('close', () => {
				console.log(`Client Disconnected with ID:- ${socket.id}`);
			});
		});

		console.log('SocketIO Configured');
	}
};
