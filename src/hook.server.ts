// imports 
import { building } from '$app/environment';
import { GlobalThisWSS } from '$lib/server/ws';
import type { Handle } from '@sveltejs/kit';
import type { ExtendedGlobal, ExtendedWebSocket } from '$lib/server/ws';
import { nanoid } from 'nanoid';

// Starting up websocket
let wssInitialized = false;
const startupWebsocketServer = () => {
  if (wssInitialized) return;
  console.log('[wss:kit] setup');
  const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
  if (wss !== undefined) {
    wss.on('connection', (ws: ExtendedWebSocket) => {
      // rest 
      console.log(`[wss:kit] client connected (${ws.socketId})`);
      ws.send(`Hello from SvelteKit ${new Date().toLocaleString()} (${ws.socketId})]`);

      ws.on('close', () => {
        console.log(`[wss:kit] client disconnected (${ws.socketId})`);
      });
    });
    wssInitialized = true;
  }
};

// Handling server 
export const handle = (async ({ event, resolve }) => {
  startupWebsocketServer();
  // Skip WebSocket server when pre-rendering pages
  if (!building) {
    const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
    if (wss !== undefined) {
      event.locals.wss = wss;
    }
  }
  const response = await resolve(event, {
    filterSerializedResponseHeaders: name => name === 'content-type',
  });
  return response;
}) satisfies Handle;