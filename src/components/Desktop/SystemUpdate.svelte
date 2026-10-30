<script lang="ts">
	import { untrack } from 'svelte';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import { asset_url } from '🍎/helpers/asset-url.ts';
	import { system_needs_update } from '🍎/state/system.svelte';
	import SystemDialog from '../SystemUI/SystemDialog.svelte';

	let system_update_dialog = $state<SystemDialog>();

	// replaced dynamically
	const build_date = '__DATE__';

	// Will store the update event, so we can use this value on AppStore to show the badge.
	// If the user click on Later instead Restart, the dialog is closed but the update is still there.
	// We don't need to store it on localStorage since the new sw is on skip waiting state, and so
	// a refresh or reopening the browser will prompt again the dialog to restart.
	// Once updateServiceWorker is called, there is a full reload, so the app will be loaded again.

	// Guards the auto-apply below so a worker that never finishes activating can't
	// reload the page in a loop.
	const AUTO_UPDATE_KEY = 'serial-designation-n:auto-updated';

	const { needRefresh, updateServiceWorker } = useRegisterSW({
		onRegistered(swr) {
			console.log(`SW registered: ${swr}`);
		},
		onRegisteredSW(_sw_url, registration) {
			if (!registration) return;

			// A waiting worker is easy to miss, and until it activates the browser keeps
			// serving the previous build — including builds that fail to boot. Poll for a
			// new worker on return visits and hourly in long sessions.
			const check_for_update = () => void registration.update().catch(() => {});

			setInterval(check_for_update, 60 * 60 * 1000);

			document.addEventListener('visibilitychange', () => {
				if (document.visibilityState === 'visible') check_for_update();
			});
		},
		onRegisterError(error) {
			console.log('SW registration error', error);
		},
	});

	// Apply a pending update while the tab is hidden, so the user comes back to the
	// fixed build instead of staying pinned to a stale one until they open App Store.
	$effect(() => {
		if (!$needRefresh) return;

		function update_while_hidden() {
			if (document.visibilityState !== 'hidden') return;
			if (sessionStorage.getItem(AUTO_UPDATE_KEY)) return;

			sessionStorage.setItem(AUTO_UPDATE_KEY, '1');
			updateServiceWorker(true);
		}

		document.addEventListener('visibilitychange', update_while_hidden);

		return () => document.removeEventListener('visibilitychange', update_while_hidden);
	});

	$effect(() => {
		if ($needRefresh) {
			system_update_dialog?.open();
		}
	});

	$effect(() => {
		$needRefresh;

		untrack(() => (system_needs_update.value = $needRefresh));
	});

	function close() {
		system_update_dialog.close();
		needRefresh.set(false);
	}

	async function handle_update_app() {
		updateServiceWorker();
	}
</script>

<SystemDialog bind:this={system_update_dialog}>
	<section class="system-update-section">
		<img
			width="128"
			height="128"
			src={asset_url('/app-icons/system-preferences/256.webp')}
			alt="AppStore app"
			draggable="false"
		/>

		<h3>Updates Available</h3>
		<p>Do you want to restart to install these updates now?</p>

		<div class="buttons">
			<button onclick={close}>Later</button>
			<button class="confirm" onclick={handle_update_app}> Update </button>
		</div>
	</section>
</SystemDialog>

<div class="pwa-date">{build_date}</div>

<style>
	.pwa-date {
		visibility: hidden;

		height: 0;
		width: 0;
	}

	.system-update-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		padding: 1rem 0 0;

		width: 20rem;

		color: var(--system-color-dark);

		h3,
		p {
			text-align: center;
		}

		h3 {
			font-size: 1.2rem;
			font-weight: 500;
		}

		p {
			font-size: 0.9rem;
		}

		.buttons {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.5rem;

			width: 100%;

			button {
				width: 100%;
				height: 2rem;

				font-weight: 500;

				border-radius: 0.5rem;

				background-color: hsla(var(--system-color-dark-hsl), 0.2);

				&:hover {
					background-color: hsla(var(--system-color-dark-hsl), 0.3);
				}

				&.confirm {
					background-color: var(--system-color-primary);

					color: var(--system-color-primary-contrast);

					&:hover {
						background-color: hsla(var(--system-color-primary-hsl), 0.8);
					}
				}
			}
		}
	}
</style>
