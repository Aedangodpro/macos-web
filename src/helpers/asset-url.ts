/**
 * Turn a path in `public/` into a URL that survives being served from a subpath
 * (GitHub Pages serves this app from /macos-web/). Vite only rewrites asset
 * paths it can see at build time, so templates that build a path from a string
 * — `/app-icons/${app_id}/256.webp` — have to rebase it themselves.
 */
export function asset_url(path: string) {
	const base = import.meta.env.BASE_URL || '/';
	return `${base}${path.replace(/^\/+/, '')}`;
}
