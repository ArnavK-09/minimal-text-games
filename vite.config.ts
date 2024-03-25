import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import wsocketPlugin from './websocket';

export default defineConfig({
	plugins: [sveltekit(), wsocketPlugin]
});
