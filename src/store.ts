// imports 
import { writable } from "svelte/store";


/**
 * Check if established websocket 
 */
export const isWebsocketEstablised = writable<boolean>(false);