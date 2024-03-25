/**
 * Imports
 */
import { writable } from 'svelte/store';

/**
 * Types
 */
export interface GameState {
	ws: unknown;
	game: string;
	userID: string;
}

/**
 * Check if established websocket
 */
export const isWebsocketEstablised = writable<boolean>(false);

/**
 * Current user game state
 */
export const gameState = writable<GameState>();
