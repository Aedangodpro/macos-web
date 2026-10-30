<script lang="ts">
	import CloseIcon from '🍎/components/SVG/traffic-lights/CloseSVG.svelte';
	import GreenLight from '🍎/components/SVG/traffic-lights/GreenLight.svelte';
	import MinimizeSvg from '🍎/components/SVG/traffic-lights/MinimizeSVG.svelte';
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { apps, type AppID } from '🍎/state/apps.svelte.ts';

	const {
		app_id,
		on_close_app,
		on_minimize_click,
		on_maximize_click,
	}: {
		app_id: AppID;
		on_close_app: () => void;
		on_minimize_click: () => void;
		on_maximize_click: () => void;
	} = $props();
</script>

<div class="container" class:unfocused={apps.active !== app_id}>
	<button class="close-light" onclick={on_close_app} aria-label="Close window" title="Close">
		<CloseIcon />
	</button>
	<button
		class="minimize-light"
		onclick={on_minimize_click}
		aria-label="Minimize window"
		title="Minimize"
	>
		<MinimizeSvg />
	</button>
	<button
		class="stretch-light"
		onclick={on_maximize_click}
		aria-label="Zoom window"
		title="Zoom"
	>
		<GreenLight expandable={apps_config[app_id].expandable} />
	</button>
</div>

<style>
	.container {
		--button-size: 0.75rem;

		display: grid;
		grid-template-columns: repeat(3, var(--button-size));
		align-items: center;
		gap: 0.5rem;

		height: 100%;

		/* Unfocused windows show a single muted tone, like macOS. */
		&.unfocused button {
			--bgcolor: hsla(var(--system-color-rim-hsl), 0.18);
			--border-color: hsla(var(--system-color-rim-hsl), 0.12);
			--glyph-color: hsla(var(--system-color-light-contrast-hsl), 0.35);
		}

		:global(svg) {
			opacity: 0;
			color: hsla(258, 45%, 12%, 0.72);
		}

		&:hover :global(svg),
		&:focus-within :global(svg) {
			opacity: 1;
		}
	}

	button {
		height: var(--button-size);
		width: var(--button-size);

		border-radius: 50%;

		color: var(--glyph-color, hsla(258, 45%, 12%, 0.72));

		background-color: var(--bgcolor);
		background-image: linear-gradient(
			180deg,
			hsla(0, 0%, 100%, 0.24) 0%,
			hsla(0, 0%, 100%, 0) 55%,
			hsla(258, 60%, 4%, 0.16) 100%
		);

		box-shadow:
			inset 0 0 0 0.5px var(--border-color),
			inset 0 1px 0 hsla(0, 0%, 100%, 0.35),
			0 0.5px 1.5px hsla(258, 60%, 4%, 0.35);

		transition:
			transform 120ms ease,
			filter 120ms ease;

		&:hover {
			filter: brightness(1.08);
		}

		&:active {
			transform: scale(0.92);
		}

		&:focus-visible {
			box-shadow:
				inset 0 0 0 0.5px var(--border-color),
				0 0 0 0.2rem hsla(var(--system-color-primary-hsl), 0.35);
		}
	}

	/* Classic traffic-light hues — saturated accents belong in the UI, not here. */
	.close-light {
		--bgcolor: hsl(4, 79%, 62%);
		--border-color: hsl(4, 62%, 45%);
	}

	.minimize-light {
		--bgcolor: hsl(43, 96%, 56%);
		--border-color: hsl(40, 70%, 40%);
	}

	.stretch-light {
		--bgcolor: hsl(140, 48%, 49%);
		--border-color: hsl(140, 44%, 33%);

		:global(svg) {
			transform: rotate(90deg);
		}
	}
</style>
