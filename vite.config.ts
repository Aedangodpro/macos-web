import { svelte } from '@sveltejs/vite-plugin-svelte';
import UnpluginIcons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { VitePWA } from 'vite-plugin-pwa';

import { prefetch } from './prefetch-plugin';

// GitHub Pages serves project sites from /<repo>/, Cloudflare (and vite dev)
// from the root. Default to root and let the Pages workflow pass the subpath.
function normalize_base(raw: string | undefined) {
	if (!raw) return '/';
	const trimmed = raw.replace(/^\/+|\/+$/g, '');
	return trimmed ? `/${trimmed}/` : '/';
}

// No Node type definitions in this project, so read the env defensively.
const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;

export default defineConfig({
	base: normalize_base(env?.BASE_PATH),
	plugins: [
		svelte(),
		prefetch(),

		UnpluginIcons({ autoInstall: true, compiler: 'svelte' }),
		VitePWA({
			// Let vite-plugin-pwa handle the web manifest + registration, but write
			// our own service worker (src/sw.ts) powered by Serwist instead of
			// workbox's generateSW. The precache list is injected as self.__WB_MANIFEST.
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'sw.ts',
			includeAssets: [
				'robots.txt',
				'app-icons/finder/32.png',
				'cover-image.png',
				'cursors/(normal|link|text|help)-select.svg',
				'**/*.mp3',
			],				manifest: {
					name: 'Serial Designation N',
					short_name: 'Serial N',
					theme_color: '#120c22',
					background_color: '#120c22',
					description: 'A macOS desktop painted in violet ink and visor gold.',
				icons: [
					{
						src: 'app-icons/finder/128.png',
						sizes: '128x128',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/256.png',
						sizes: '256x256',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
			},
		}),
		imagetools(),
	],
	resolve: {
		alias: {
			'🍎': new URL('./src/', import.meta.url).pathname,
		},
	},
	// Vite 8 (Rolldown) minifies JS with its built-in minifier and CSS with
	// lightningcss by default — no explicit build/css config needed.
});
