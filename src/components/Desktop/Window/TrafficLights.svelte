<script lang="ts">
	import CloseIcon from '🍎/components/SVG/traffic-lights/CloseSVG.svelte';
	import GreenLight from '🍎/components/SVG/traffic-lights/GreenLight.svelte';
	import MinimizeSvg from '🍎/components/SVG/traffic-lights/MinimizeSVG.svelte';
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { apps, type AppID } from '🍎/state/apps.svelte.ts';

	const {
		app_id,
		on_close_app,
		on_maximize_click,
	}: { app_id: AppID; on_close_app: () => void; on_maximize_click: () => void } = $props();
</script>

<div class="container" class:unfocused={apps.active !== app_id}>
	<button class="close-light" onclick={on_close_app}> <CloseIcon /> </button>
	<button class="minimize-light"> <MinimizeSvg /> </button>
	<button class="stretch-light" onclick={on_maximize_click}>
		<GreenLight expandable={apps_config[app_id].expandable} />
	</button>
</div>

<style>
	.container {
		--button-size: 0.8rem;

		/* // pointer-events: none; */

		display: grid;
		grid-template-columns: repeat(3, var(--button-size));
		align-items: center;
		gap: 0.6rem;

		height: 100%;

		&.unfocused button {
			--bgcolor: hsl(255, 12%, 74%);
			--border-color: hsla(var(--system-color-dark-hsl), 0.45);
			--glow-hsl: 255, 12%, 80%;
		}

		:global(svg) {
			opacity: 0;
		}

		&:hover {
			button {
				transform: scale(1.15);

				box-shadow:
					inset 0 0 0 0.5px var(--border-color),
					inset 0 1.5px 1px hsla(0, 0%, 100%, 0.55),
					0 1px 2.5px hsla(258, 60%, 4%, 0.55),
					0 0 9px hsla(var(--glow-hsl), 0.55);
			}

			:global(svg) {
				opacity: 1;
			}
		}
	}

	button {
		height: var(--button-size);
		width: var(--button-size);

		/* // pointer-events: initial; */

		border-radius: 50%;

		background-color: var(--bgcolor);
		/* // Glossy glass: specular highlight top-left, darkened lower edge */
		background-image:
			radial-gradient(
				85% 85% at 30% 24%,
				hsla(0, 0%, 100%, 0.7) 0%,
				hsla(0, 0%, 100%, 0) 58%
			),
			linear-gradient(180deg, hsla(0, 0%, 100%, 0.22) 0%, hsla(258, 60%, 5%, 0.22) 100%);

		box-shadow:
			inset 0 0 0 0.5px var(--border-color),
			inset 0 1.5px 1px hsla(0, 0%, 100%, 0.5),
			0 1px 2.5px hsla(258, 60%, 4%, 0.5);

		transition:
			transform 100ms ease-in,
			box-shadow 150ms ease-in;
	}

	.close-light {
		--bgcolor: hsl(342, 88%, 58%);
		--border-color: hsl(342, 68%, 40%);
		--glow-hsl: 342, 90%, 64%;
	}

	.stretch-light {
		--bgcolor: hsl(258, 62%, 62%);
		--border-color: hsl(258, 52%, 40%);
		--glow-hsl: 258, 75%, 72%;

		:global(svg) {
			transform: rotate(90deg);
		}
	}

	.minimize-light {
		--bgcolor: hsl(45, 100%, 56%);
		--border-color: hsl(43, 82%, 38%);
		--glow-hsl: 45, 100%, 62%;
	}
</style>
