import { colors } from '🍎/configs/theme/colors.config.ts';
import type { WallpaperID } from '🍎/configs/wallpapers/wallpaper.config.ts';
import { persisted } from './persisted.svelte.ts';

export type WallpaperSettings = {
	id: WallpaperID;
	image: string;
	canControlTheme: boolean;
};

export type Theme = {
	scheme: 'light' | 'dark';
	primaryColor: keyof typeof colors;
};

export const preferences = persisted('serial-designation-n:preferences', {
	reduced_motion: matchMedia('(prefers-reduced-motion)').matches,
	theme: {
		scheme: 'dark',
		primaryColor: 'gold',
	} as Theme,
	wallpaper: {
		image: '',
		id: 'murder-drones',
		canControlTheme: false,
	} as WallpaperSettings,
});

$effect.root(() => {
	$effect(() => {
		// Color scheme
		const { classList } = document.body;
		classList.remove('light', 'dark');
		classList.add(preferences.theme.scheme);

		// Primary color (fall back to the visor gold if a stored palette name is gone)
		const palette = colors[preferences.theme.primaryColor] as
			| (typeof colors)[keyof typeof colors]
			| undefined;
		const colorObj = (palette ?? colors.gold)[preferences.theme.scheme];
		document.body.style.setProperty('--system-color-primary', `hsl(${colorObj.hsl})`);
		document.body.style.setProperty('--system-color-primary-hsl', `${colorObj.hsl}`);
		document.body.style.setProperty(
			'--system-color-primary-contrast',
			`hsl(${colorObj.contrastHsl})`,
		);
		document.body.style.setProperty(
			'--system-color-primary-contrast-hsl',
			`${colorObj.contrastHsl}`,
		);
	});
});
