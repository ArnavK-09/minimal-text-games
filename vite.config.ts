import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import wsocketPlugin from './src/lib/websocket';

export default defineConfig({
	plugins: [sveltekit(), wsocketPlugin]
});
