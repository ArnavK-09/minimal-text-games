import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io';
import { defineConfig } from 'vite';
import wsPlugin from './wsPlugin';
export default defineConfig({
	plugins: [
		sveltekit(),
		wsPlugin
		// {
		// 	name: 'sveltekit-socket-io',
		// 	configureServer(server) {
		// 		console.log(12122, server.httpServer)
		// 		const io = new Server(server.httpServer!);
		// 		console.log(33, io)
		// 		// Socket.IO stuff goes here
		// 		// This is located in the svelte config (see above "Socket.IO stuff goes here")
		// 		io.on('connection', (socket) => {
		// 			io.emit("join_player", true)
		// 			// Generate a random username and send it to the client to display it
		// 			let username = `User ${Math.round(Math.random() * 999999)}`;
		// 			socket.emit('name', username);

		// 			// Receive incoming messages and broadcast them
		// 			socket.on('message', (message) => {
		// 				io.emit('message', {
		// 					from: username,
		// 					message: message,
		// 					time: new Date().toLocaleString()
		// 				});
		// 			});
		// 		});

		// 		console.log('SocketIO injected');
		// 	}
		// }
	]
});
