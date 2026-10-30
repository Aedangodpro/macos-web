<script lang="ts">
	import { onMount } from 'svelte';
	import { quintInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import AppleIcon from '~icons/mdi/apple';
	import { elevation } from '🍎/actions';
	import { asset_url } from '🍎/helpers/asset-url.ts';
	import { fade_out } from '🍎/helpers/fade.ts';
	import { sleep } from '🍎/helpers/sleep';

	// Shorter in dev so the splash doesn't get in the way of hot reloads
	const boot_duration = import.meta.env.DEV ? 1600 : 3000;

	let hidden_splash_screen = $state(false);
	let progress_val = tweened(100, { duration: boot_duration, easing: quintInOut });

	onMount(async () => {
		$progress_val = 0;
		await sleep(boot_duration);
		hidden_splash_screen = true;
	});
</script>

{#if !hidden_splash_screen}
	<div out:fade_out={{ duration: 500 }} class="splash-screen" use:elevation={'bootup-screen'}>
		<div class="logo">
			<AppleIcon />
		</div>

		<div
			class="progress"
			role="progressbar"
			aria-valuenow={100 - $progress_val}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuetext="Starting Serial Designation N"
		>
			<div class="indicator" style:translate="-{$progress_val}% 0"></div>
		</div>
	</div>
{/if}

<!-- iframe => firefox support: will always make sound available on start or F5 -->
{#if import.meta.env.PROD}
	<iframe
		id="audio"
		src={asset_url('/sounds/mac-startup-sound.mp3')}
		allow="autoplay"
		title="Startup sound"
	></iframe>
{/if}

<style>
	.splash-screen {
		position: fixed;
		inset: 0;

		height: 100vh;
		width: 100vw;

		cursor: none;

		display: grid;
		place-items: center;

		animation-fill-mode: forwards;

		background-color: hsl(258, 46%, 5%);
		background-image:
			radial-gradient(
				55% 42% at 50% 44%,
				hsla(var(--system-color-primary-hsl), 0.14) 0%,
				transparent 72%
			),
			radial-gradient(120% 80% at 50% 118%, hsla(258, 74%, 42%, 0.32) 0%, transparent 62%);

		.logo {
			display: grid;
			place-items: center;

			:global(svg) {
				font-size: 100px;
				color: var(--system-color-primary);

				filter: drop-shadow(0 0 22px hsla(var(--system-color-primary-hsl), 0.45));
			}
		}
	}

	.progress {
		position: absolute;
		left: 50%;
		bottom: 2.5rem;
		transform: translateX(-50%);

		border-radius: 50px;

		height: 4px;
		width: min(18rem, 55vw);

		overflow-x: hidden;

		background-color: hsla(258, 30%, 30%, 0.75);

		box-shadow:
			inset 0 1px 2px hsla(258, 70%, 3%, 0.6),
			0 0 14px hsla(var(--system-color-primary-hsl), 0.14);
	}

	.indicator {
		background-color: var(--system-color-primary);
		box-shadow: 0 0 10px hsla(var(--system-color-primary-hsl), 0.8);

		border-radius: inherit;

		width: 100%;
		height: 100%;

		transform: translateX(-0%);
	}

	#audio {
		position: absolute;
		z-index: -9999;

		display: none;
	}
</style>
