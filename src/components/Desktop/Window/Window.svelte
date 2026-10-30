<script lang="ts">
	import {
		bounds,
		BoundsFrom,
		Compartment,
		ControlFrom,
		controls,
		disabled,
		draggable,
		events,
		position,
	} from '@neodrag/svelte';
	import { onMount, untrack } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { rand_int } from '🍎/helpers/random.ts';
	import { sleep } from '🍎/helpers/sleep';
	import { apps, type AppID } from '🍎/state/apps.svelte.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';

	import AppNexus from '../../apps/AppNexus.svelte';
	import TrafficLights from './TrafficLights.svelte';

	const { app_id }: { app_id: AppID } = $props();

	let dragging_enabled = $state(true);

	let is_maximized = $state(false);
	let minimized_transform = $state<string>();

	let windowEl = $state<HTMLElement>();

	const { height, width } = $derived(apps_config[app_id]);

	const remModifier = $derived(+height * 1.2 >= window.innerHeight ? 24 : 16);

	const randX = rand_int(-600, 600);
	const randY = rand_int(-100, 100);

	let defaultPosition = {
		x: (document.body.clientWidth / 2 + randX) / 2,
		y: (100 + randY) / 2,
	};

	const disabledComp = Compartment.of(() => disabled(!dragging_enabled));

	$effect(() => {
		apps.active_z_index;

		if (apps.active === app_id) {
			untrack(() => (apps.z_indices[app_id] = apps.active_z_index));
		}
	});

	function focusApp() {
		apps.active = app_id;
	}

	function windowCloseTransition(
		el: HTMLElement,
		{ duration = preferences.reduced_motion ? 0 : 300 }: SvelteTransitionConfig = {},
	): SvelteTransitionReturnType {
		const existingTransform = getComputedStyle(el).transform;

		return {
			duration,
			easing: sineInOut,
			css: (t) => `opacity: ${t}; transform: ${existingTransform} scale(${t})`,
		};
	}

	async function maximizeApp() {
		if (!preferences.reduced_motion) {
			windowEl.style.transition = 'height 0.3s ease, width 0.3s ease, transform 0.3s ease';
		}

		if (!is_maximized) {
			dragging_enabled = false;

			minimized_transform = windowEl.style.transform;
			windowEl.style.transform = `translate(0px, 0px)`;

			windowEl.style.width = `100%`;
			// windowEl.style.height = 'calc(100vh - 1.7rem - 5.25rem)';
			windowEl.style.height = 'calc(100vh - 1.7rem)';
		} else {
			dragging_enabled = true;
			windowEl.style.transform = minimized_transform;

			windowEl.style.width = `${+width / remModifier}rem`;
			windowEl.style.height = `${+height / remModifier}rem`;
		}

		is_maximized = !is_maximized;

		apps.fullscreen[app_id] = is_maximized;

		await sleep(300);

		if (!preferences.reduced_motion) windowEl.style.transition = '';
	}

	function closeApp() {
		apps.open[app_id] = false;
		apps.fullscreen[app_id] = false;
		apps.minimized[app_id] = false;
	}

	function minimizeApp() {
		apps.minimized[app_id] = true;
		apps.fullscreen[app_id] = false;

		// Hand focus to the next visible window so the desktop isn't "focused" on
		// something the user can no longer see.
		const next_visible_app = (Object.keys(apps.open) as AppID[]).find(
			(other_app) => other_app !== app_id && apps.open[other_app] && !apps.minimized[other_app],
		);

		if (next_visible_app) apps.active = next_visible_app;
	}

	function onAppDragStart() {
		focusApp();
		apps.is_being_dragged = true;
	}

	function onAppDragEnd() {
		apps.is_being_dragged = false;
	}

	onMount(() => windowEl?.focus());
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
	role="application"
	class="container"
	class:dark={preferences.theme.scheme === 'dark'}
	class:active={apps.active === app_id}
	class:minimized={apps.minimized[app_id]}
	style:width="{+width / remModifier}rem"
	style:height="{+height / remModifier}rem"
	style:z-index={apps.z_indices[app_id]}
	tabindex="-1"
	bind:this={windowEl}
	{@attach draggable(() => [
		controls({ allow: ControlFrom.selector('.app-window-drag-handle') }),
		bounds(BoundsFrom.viewport({ bottom: -6000, top: 27.2, left: -6000, right: -6000 })),
		disabledComp,
		position({ default: defaultPosition }),
		events({ onDragStart: onAppDragStart, onDragEnd: onAppDragEnd }),
	])}
	onclick={focusApp}
	onkeydown={() => {}}
	out:windowCloseTransition
>
	<div class="tl-container {app_id}" use:elevation={'window-traffic-lights'}>
		<TrafficLights
			{app_id}
			on_maximize_click={maximizeApp}
			on_minimize_click={minimizeApp}
			on_close_app={closeApp}
		/>
	</div>

	<AppNexus {app_id} is_being_dragged={apps.is_being_dragged} />
</section>

<style>
	.container {
		--elevated-shadow: 0px 10px 24px hsla(258, 70%, 2%, 0.34), 0px 40px 72px hsla(258, 70%, 2%, 0.42);

		width: 100%;
		height: 100%;

		display: grid;
		grid-template-rows: 1fr;

		position: absolute;

		will-change: width, height, opacity, scale;

		border-radius: 0.85rem;
		box-shadow: var(--elevated-shadow);

		transform-origin: 50% 50%;
		transition:
			opacity 220ms ease,
			scale 220ms ease;

		cursor: var(--system-cursor-default), auto;

		&.active {
			/* // --elevated-shadow: 0px 6.7px 12px rgba(0, 0, 0, 0.218), 0px 22.3px 40.2px rgba(0, 0, 0, 0.322),
      //   0px 100px 180px rgba(0, 0, 0, 0.54); */
			--elevated-shadow: 0px 12px 28px hsla(258, 70%, 2%, 0.44), 0px 48px 88px hsla(258, 70%, 2%, 0.56);
		}

		&.dark {
			& > :global(section),
			& > :global(div) {
				border-radius: inherit;
				box-shadow:
					inset 0 0 0 0.5px hsla(var(--system-color-rim-hsl), 0.16),
					var(--elevated-shadow);
			}
		}
	}

	.container.minimized {
		opacity: 0;
		scale: 0.72;

		visibility: hidden;
		pointer-events: none;

		transition:
			opacity 180ms ease,
			scale 180ms ease,
			visibility 0s linear 180ms;
	}

	.tl-container {
		position: absolute;
		top: 0.9rem;
		left: 1rem;

		/* // Necessary, as `.container` tries to apply shadow on it */
		box-shadow: none !important;
	}
</style>
