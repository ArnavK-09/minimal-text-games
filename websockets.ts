import { Server } from 'socket.io';

export default {
	name: 'webSocketServer',
	configureServer(server: any) {
		// new server
		const io = new Server(server.httpServer, {
			cookie: true
		});

		io.on('connection', (socket) => {
			console.log(`Client Connected with ID:- ${socket.id}`);

			socket.on('startGame', (data) => {
				const id = data.gameID;
				const user = data.userID;
				const game = data.game;

				if (game == 'describe_img') {
					socket.emit('statusUpdate', {
						status: 'waiting',
						gameID: id,
						user,
						game
					});
				}
			});

			socket.on('joinGame', (data) => {
				const gameID = data.gameID;
				const ownerID = data.userID;
				const game = data.game;

				if (game == 'describe_img') {
					io.emit('statusUpdate', {
						status: 'player_joined',
						gameID: gameID,
						user: ownerID,
						game,
						player: {
							id: data.userID
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
