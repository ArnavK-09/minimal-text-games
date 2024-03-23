// See https://kit.svelte.dev/docs/types#app
import type { ExtendedWebSocket } from '$lib/server/ws';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			wss: ExtendedWebSocket;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
