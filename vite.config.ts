import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import wsocketsPlugin from './websockets';

export default defineConfig({
	plugins: [sveltekit(), wsocketsPlugin]
});
