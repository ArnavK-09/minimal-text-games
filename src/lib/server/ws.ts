import { parse } from 'url';
import { WebSocketServer } from 'ws';
import { nanoid } from 'nanoid';
import type { RawData, WebSocket as WebSocketBase } from 'ws';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';

export const GlobalThisWSS = Symbol.for('sveltekit.wss');

export interface ExtendedWebSocket extends WebSocketBase {
	socketId?: string;
	// userId: string;
}

export const events: Array<string> = ['join_game', 'start_game', 'enter_input'];

// You can define server-wide functions or class instances here
// export interface ExtendedServer extends Server<ExtendedWebSocket> {};

export type ExtendedWebSocketServer = WebSocketServer;

export type ExtendedGlobal = typeof globalThis & {
	[GlobalThisWSS]: ExtendedWebSocketServer;
};

export const onHttpServerUpgrade = (req: IncomingMessage, sock: Duplex, head: Buffer) => {
	const pathname = req.url ? parse(req.url).pathname : null;
	if (pathname !== '/websocket') return;

	const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];

	wss.handleUpgrade(req, sock, head, (ws: ExtendedWebSocket) => {
		wss.emit('connection', ws, req);
	});
};

export const createWSSGlobalInstance = () => {
	const wss = new WebSocketServer({ noServer: true });
	(globalThis as ExtendedGlobal)[GlobalThisWSS] = wss;

	wss.on('connection', (ws: ExtendedWebSocket) => {
		ws.socketId = nanoid();
		console.log(`[WSS] client connected (${ws.socketId})`);

		ws.on('close', () => {
			console.log(`[WSS] client disconnected (${ws.socketId})`);
		});

		ws.on('message', (e: RawData) => {
			console.log(e.toString());
			let data;
			try {
				data = JSON.parse(e.toString());
			} catch {
				return;
			}

			if (data.event == 'join_game') {
				let id = data.gameID;
				let user = data.userID;
				let game = data.game;

				if (game == 'describe_img') {
					wss.emit('player_joined', {
						gameID: id,
						playerID: user,
						game
					});
				}
			}

			if (data.event == 'start_game') {
				let id = data.gameID;
				let user = data.userID;
				let game = data.game;

				if (game == 'describe_img') {
					ws.send(
						JSON.stringify({
							to: id,
							player: user,
							event: 'waiting'
						})
					);
					console.log(ws.emit('player_joined', 'hi'), 2);
					console.log(wss.emit('player_joined', ws), wss.clients);
					console.log(wss.eventNames(), 23);
					console.log(
						wss.emit('player_joined', {
							gameID: id,
							playerID: user,
							game
						}),
						4
					);
				}
			}
		});
	});

	return wss;
};
