type SingleThemeConfig = {
	hsl: string;
	contrastHsl: string;
};

export const colors = {
	/** Lit visor gold — the signature color of Serial Designation N */
	gold: {
		light: {
			hsl: '45, 100%, 46%',
			contrastHsl: '258, 50%, 8%',
		},
		dark: {
			hsl: '45, 100%, 58%',
			contrastHsl: '258, 50%, 7%',
		},
	},

	/** Amber of the fur collar and the combat boots */
	amber: {
		light: {
			hsl: '30, 78%, 45%',
			contrastHsl: '30, 70%, 7%',
		},
		dark: {
			hsl: '31, 88%, 58%',
			contrastHsl: '30, 70%, 6%',
		},
	},

	/** Violet of N's coat and V's hair */
	violet: {
		light: {
			hsl: '266, 56%, 52%',
			contrastHsl: '266, 60%, 98%',
		},
		dark: {
			hsl: '266, 74%, 68%',
			contrastHsl: '266, 60%, 7%',
		},
	},

	/** Deep navy of the cave scene the wallpaper is set in */
	indigo: {
		light: {
			hsl: '233, 62%, 50%',
			contrastHsl: '233, 60%, 98%',
		},
		dark: {
			hsl: '232, 82%, 70%',
			contrastHsl: '232, 60%, 7%',
		},
	},

	/** Icy blue haze behind the drones */
	ice: {
		light: {
			hsl: '200, 82%, 44%',
			contrastHsl: '200, 80%, 98%',
		},
		dark: {
			hsl: '200, 92%, 68%',
			contrastHsl: '200, 80%, 6%',
		},
	},

	/** Uzi's magenta visor and hair streak */
	magenta: {
		light: {
			hsl: '338, 78%, 51%',
			contrastHsl: '338, 80%, 98%',
		},
		dark: {
			hsl: '338, 92%, 68%',
			contrastHsl: '338, 80%, 6%',
		},
	},

	/** Pale lilac of the drone plating */
	lilac: {
		light: {
			hsl: '254, 48%, 60%',
			contrastHsl: '258, 48%, 8%',
		},
		dark: {
			hsl: '254, 62%, 76%',
			contrastHsl: '258, 48%, 8%',
		},
	},

	/** Crimson of the blood-red sky over the city */
	crimson: {
		light: {
			hsl: '355, 72%, 48%',
			contrastHsl: '355, 80%, 98%',
		},
		dark: {
			hsl: '355, 86%, 64%',
			contrastHsl: '355, 80%, 6%',
		},
	},

	/** Emerald of the toxic green glow */
	emerald: {
		light: {
			hsl: '152, 62%, 36%',
			contrastHsl: '152, 70%, 98%',
		},
		dark: {
			hsl: '152, 66%, 54%',
			contrastHsl: '152, 70%, 6%',
		},
	},

	/** Teal of the sea-glass highlights */
	teal: {
		light: {
			hsl: '178, 70%, 34%',
			contrastHsl: '178, 70%, 98%',
		},
		dark: {
			hsl: '178, 72%, 58%',
			contrastHsl: '178, 70%, 6%',
		},
	},
} satisfies Record<string, { light: SingleThemeConfig; dark: SingleThemeConfig }>;
