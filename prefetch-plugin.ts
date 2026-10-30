import type { HtmlTagDescriptor, Plugin, ResolvedConfig } from 'vite';

export function prefetch(): Plugin {
	// The injected hrefs are built by hand instead of going through Vite's asset
	// handling, so they have to be prefixed with the configured base themselves —
	// otherwise a build served from a subpath (GitHub Pages) prefetches 404s.
	let base = '/';

	return {
		name: 'prefetch',

		enforce: 'post',
		apply: 'build',

		configResolved(config: ResolvedConfig) {
			base = config.base.endsWith('/') ? config.base : `${config.base}/`;
		},

		transformIndexHtml: (html, ctx) => {
			const tags = Object.keys(ctx.bundle)
				.filter((v) => !v.toString().endsWith('webp'))
				.map(
					(chunkName) =>
						({
							injectTo: 'head',
							tag: 'link',
							attrs: {
								rel: 'prefetch',
								href: `${base}${String(chunkName).replace(/^\//, '')}`,
							},
						}) as HtmlTagDescriptor,
				);

			return {
				html,
				tags,
			};
		},
	};
}
