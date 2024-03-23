// imports
// import { isWebsocketEstablised } from "./store";

/**
 * Function to connect to websocket
 */
export default () => {
	let wsEnable = false;
	// isWebsocketEstablised.subscribe(x => {
	//     if (x == true) wsEnable = true
	// })
	if (wsEnable) return;
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	let ws = new WebSocket(`${protocol}//${window.location.host}/websocket`);
	ws.addEventListener('open', (event) => {
		// isWebsocketEstablised.set(true);
		console.log('[websocket] connection open', event);
	});
	ws.addEventListener('close', (event) => {
		console.log('[websocket] connection closed', event);
	});
	ws.addEventListener('message', (event) => {
		console.log('[websocket] message received', event);
	});
};
