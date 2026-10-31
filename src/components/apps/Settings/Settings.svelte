<script lang="ts">
	import { colors } from '🍎/configs/theme/colors.config';
	import { preferences } from '🍎/state/preferences.svelte.ts';

	type Pane = 'appearance' | 'accessibility' | 'performance';

	const panes: { id: Pane; label: string; color: string }[] = [
		{ id: 'appearance', label: 'Appearance', color: 'hsl(258, 60%, 56%)' },
		{ id: 'accessibility', label: 'Accessibility', color: 'hsl(211, 90%, 52%)' },
		{ id: 'performance', label: 'Performance', color: 'hsl(140, 52%, 42%)' },
	];

	let pane = $state<Pane>('appearance');

	function setScheme(scheme: 'light' | 'dark') {
		preferences.theme.scheme = scheme;
	}
</script>

<div class="settings" class:dark={preferences.theme.scheme === 'dark'}>
	<nav class="sidebar" aria-label="Settings sections">
		<div class="search" aria-hidden="true">Search</div>

		<ul>
			{#each panes as item (item.id)}
				<li>
					<button
						type="button"
						class:active={pane === item.id}
						aria-current={pane === item.id ? 'page' : undefined}
						onclick={() => (pane = item.id)}
					>
						<span class="badge" style:background-color={item.color}></span>
						{item.label}
					</button>
				</li>
			{/each}
		</ul>
	</nav>

	<main class="content">
		<h2>{panes.find((item) => item.id === pane)?.label}</h2>

		{#if pane === 'appearance'}
			<section class="group" aria-label="Appearance">
				<div class="row">
					<div class="row-text">
						<p class="row-title">Appearance</p>
						<p class="row-hint">Light or dark interface</p>
					</div>
					<div class="segmented" role="radiogroup" aria-label="Appearance">
						<button
							type="button"
							role="radio"
							aria-checked={preferences.theme.scheme === 'light'}
							class:active={preferences.theme.scheme === 'light'}
							onclick={() => setScheme('light')}
						>
							Light
						</button>
						<button
							type="button"
							role="radio"
							aria-checked={preferences.theme.scheme === 'dark'}
							class:active={preferences.theme.scheme === 'dark'}
							onclick={() => setScheme('dark')}
						>
							Dark
						</button>
					</div>
				</div>

				<div class="row column">
					<div class="row-text">
						<p class="row-title">Accent colour</p>
						<p class="row-hint">{preferences.theme.primaryColor}</p>
					</div>
					<div class="swatches" role="group" aria-label="Accent colour">
						{#each Object.keys(colors) as colorID (colorID)}
							{@const { hsl } = colors[colorID][preferences.theme.scheme]}
							<button
								type="button"
								class="swatch"
								class:active={preferences.theme.primaryColor === colorID}
								style:--swatch={hsl}
								title="{colorID} accent"
								aria-label="Use the {colorID} accent colour"
								aria-pressed={preferences.theme.primaryColor === colorID}
								onclick={() => (preferences.theme.primaryColor = colorID)}
							></button>
						{/each}
					</div>
				</div>
			</section>
		{:else if pane === 'accessibility'}
			<section class="group" aria-label="Motion">
				<label class="row">
					<div class="row-text">
						<p class="row-title">Reduce motion</p>
						<p class="row-hint">Turns off window and menu animations</p>
					</div>
					<input type="checkbox" class="switch" bind:checked={preferences.reduced_motion} />
				</label>
			</section>
		{:else}
			<section class="group" aria-label="Performance">
				<label class="row">
					<div class="row-text">
						<p class="row-title">Low detail mode</p>
						<p class="row-hint">Removes blur, glass and heavy shadows to run smoother</p>
					</div>
					<input type="checkbox" class="switch" bind:checked={preferences.low_detail} />
				</label>
			</section>
		{/if}
	</main>
</div>

<style>
	.settings {
		--text: hsl(0, 0%, 12%);
		--muted: hsla(0, 0%, 0%, 0.5);
		--sidebar: hsla(0, 0%, 96%, 0.9);
		--panel: hsl(0, 0%, 99%);
		--group: hsl(0, 0%, 100%);
		--divider: hsla(0, 0%, 0%, 0.1);
		--control: hsla(0, 0%, 0%, 0.08);

		width: 100%;
		height: 100%;

		display: grid;
		grid-template-columns: 11.5rem 1fr;

		font-family: var(--system-font-family);
		font-size: 0.85rem;
		color: var(--text);

		background-color: var(--panel);

		&.dark {
			--text: hsl(0, 0%, 96%);
			--muted: hsla(0, 0%, 100%, 0.5);
			--sidebar: hsla(0, 0%, 17%, 0.92);
			--panel: hsl(0, 0%, 12%);
			--group: hsl(0, 0%, 17%);
			--divider: hsla(0, 0%, 100%, 0.1);
			--control: hsla(0, 0%, 100%, 0.12);
		}
	}

	.sidebar {
		padding: 0.75rem 0.6rem;
		background-color: var(--sidebar);
		border-right: 0.5px solid var(--divider);
		overflow-y: auto;

		.search {
			margin-bottom: 0.75rem;
			padding: 0.3rem 0.5rem;
			border-radius: 0.4rem;
			background-color: var(--control);
			color: var(--muted);
			font-size: 0.8rem;
		}

		ul {
			list-style: none;
			margin: 0;
			padding: 0;
			display: grid;
			gap: 0.1rem;
		}

		button {
			width: 100%;
			display: flex;
			align-items: center;
			gap: 0.55rem;
			padding: 0.35rem 0.5rem;
			border: none;
			border-radius: 0.4rem;
			background: transparent;
			color: var(--text);
			font: inherit;
			text-align: left;
			cursor: var(--system-cursor-pointer), pointer;

			&:hover {
				background-color: var(--control);
			}

			&.active {
				background-color: hsla(var(--system-color-primary-hsl), 0.22);
			}
		}

		.badge {
			width: 1.1rem;
			height: 1.1rem;
			border-radius: 0.3rem;
			flex-shrink: 0;
		}
	}

	.content {
		padding: 1.25rem 1.5rem;
		overflow-y: auto;

		h2 {
			margin: 0 0 0.9rem;
			font-size: 1.3rem;
			font-weight: 700;
		}
	}

	.group {
		display: grid;
		background-color: var(--group);
		border-radius: 0.6rem;
		overflow: hidden;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.6rem 0.85rem;
		cursor: var(--system-cursor-pointer), pointer;

		& + .row {
			border-top: 0.5px solid var(--divider);
		}

		&.column {
			flex-direction: column;
			align-items: stretch;
		}
	}

	.row-title {
		margin: 0;
		font-weight: 500;
	}

	.row-hint {
		margin: 0.1rem 0 0;
		color: var(--muted);
		font-size: 0.75rem;
		text-transform: capitalize;
	}

	.segmented {
		display: flex;
		padding: 0.15rem;
		border-radius: 0.45rem;
		background-color: var(--control);

		button {
			padding: 0.25rem 0.8rem;
			border: none;
			border-radius: 0.35rem;
			background: transparent;
			color: var(--text);
			font: inherit;
			cursor: var(--system-cursor-pointer), pointer;

			&.active {
				background-color: var(--group);
				box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.18);
			}
		}
	}

	.swatches {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		margin-top: 0.6rem;
	}

	.swatch {
		width: 1.4rem;
		height: 1.4rem;
		padding: 0;
		border: none;
		border-radius: 50%;
		background-color: hsl(var(--swatch));
		cursor: var(--system-cursor-pointer), pointer;

		&.active {
			box-shadow:
				0 0 0 2px var(--group),
				0 0 0 4px hsl(var(--swatch));
		}
	}

	.switch {
		appearance: none;
		width: 2.4rem;
		height: 1.45rem;
		flex-shrink: 0;
		border-radius: 999px;
		background-color: var(--control);
		position: relative;
		cursor: var(--system-cursor-pointer), pointer;
		transition: background-color 150ms ease;

		&::after {
			content: '';
			position: absolute;
			top: 0.125rem;
			left: 0.125rem;
			width: 1.2rem;
			height: 1.2rem;
			border-radius: 50%;
			background-color: #fff;
			box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.3);
			transition: transform 150ms ease;
		}

		&:checked {
			background-color: var(--system-color-primary);
		}

		&:checked::after {
			transform: translateX(1rem);
		}
	}
</style>
