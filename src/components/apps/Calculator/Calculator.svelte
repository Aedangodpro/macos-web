<script lang="ts">
	import Plus from '~icons/ic/outline-plus';
	import Equal from '~icons/ic/round-equals';
	import Minus from '~icons/ic/round-minus';
	import PlusMinus from '~icons/majesticons/plus-minus-2';
	import Division from '~icons/ph/divide-bold';
	import Multiply from '~icons/uil/multiply';

	import { apps } from '🍎/state/apps.svelte.ts';

	type Operator = '+' | '−' | '×' | '÷';

	const MAX_DIGITS = 12;

	let display = $state('0');
	let stored_value = $state<number | null>(null);
	let pending_operator = $state<Operator | null>(null);
	/** True right after an operator, equals or clear: the next digit starts fresh. */
	let replace_display = $state(true);
	let repeat_operator = $state<Operator | null>(null);
	let repeat_operand = $state<number | null>(null);
	let is_error = $state(false);

	function current_value() {
		return Number(display);
	}

	function format(value: number) {
		if (!Number.isFinite(value)) return 'Error';

		const magnitude = Math.abs(value);

		if (magnitude !== 0 && (magnitude >= 1e12 || magnitude < 1e-9)) {
			return value.toExponential(6);
		}

		// toPrecision trims binary float noise (0.1 + 0.2 -> 0.3).
		return String(Number(value.toPrecision(MAX_DIGITS)));
	}

	function reset() {
		display = '0';
		stored_value = null;
		pending_operator = null;
		replace_display = true;
		repeat_operator = null;
		repeat_operand = null;
		is_error = false;
	}

	function clear() {
		// AC clears everything; a second press while already zero is harmless.
		reset();
	}

	function fail() {
		display = 'Error';
		is_error = true;
		stored_value = null;
		pending_operator = null;
		replace_display = true;
	}

	function input_digit(digit: string) {
		if (is_error) reset();

		if (replace_display || display === '0') {
			display = digit;
			replace_display = false;
			return;
		}

		if (display.replace(/[-.]/g, '').length >= MAX_DIGITS) return;

		display += digit;
	}

	function input_decimal() {
		if (is_error) reset();

		if (replace_display) {
			display = '0.';
			replace_display = false;
			return;
		}

		if (!display.includes('.')) display += '.';
	}

	function toggle_sign() {
		if (is_error || display === '0') return;

		display = display.startsWith('-') ? display.slice(1) : `-${display}`;
	}

	function percent() {
		if (is_error) return;

		display = format(current_value() / 100);
		replace_display = true;
	}

	function backspace() {
		if (is_error) return reset();
		if (replace_display) return;

		display = display.length > 1 ? display.slice(0, -1) : '0';
		if (display === '-') display = '0';
	}

	function compute(a: number, b: number, operator: Operator) {
		switch (operator) {
			case '+':
				return a + b;
			case '−':
				return a - b;
			case '×':
				return a * b;
			case '÷':
				return b === 0 ? Number.NaN : a / b;
		}
	}

	function choose_operator(operator: Operator) {
		if (is_error) return;

		if (pending_operator && !replace_display && stored_value !== null) {
			// Chained input: 2 + 3 + ... folds the pending pair first.
			const result = compute(stored_value, current_value(), pending_operator);

			if (!Number.isFinite(result)) return fail();

			display = format(result);
			stored_value = result;
		} else {
			stored_value = current_value();
		}

		pending_operator = operator;
		replace_display = true;
		repeat_operator = null;
		repeat_operand = null;
	}

	function equals() {
		if (is_error) return;

		let left: number;
		let right: number;
		let operator: Operator;

		if (pending_operator !== null && stored_value !== null) {
			left = stored_value;
			right = current_value();
			operator = pending_operator;

			// Keep the pair so pressing = again repeats the same operation.
			repeat_operator = operator;
			repeat_operand = right;
		} else if (repeat_operator !== null && repeat_operand !== null) {
			left = current_value();
			right = repeat_operand;
			operator = repeat_operator;
		} else {
			return;
		}

		const result = compute(left, right, operator);

		if (!Number.isFinite(result)) return fail();

		display = format(result);
		stored_value = null;
		pending_operator = null;
		replace_display = true;
	}

	function handle_key(event: KeyboardEvent) {
		// The calculator only reacts while it is the front window.
		if (apps.active !== 'calculator') return;

		const { key } = event;

		if (/^[0-9]$/.test(key)) {
			input_digit(key);
		} else if (key === '.' || key === ',') {
			input_decimal();
		} else if (key === '+') {
			choose_operator('+');
		} else if (key === '-') {
			choose_operator('−');
		} else if (key === '*' || key === 'x' || key === 'X') {
			choose_operator('×');
		} else if (key === '/') {
			choose_operator('÷');
		} else if (key === '=' || key === 'Enter') {
			event.preventDefault();
			equals();
		} else if (key === 'Escape') {
			clear();
		} else if (key === 'Backspace') {
			event.preventDefault();
			backspace();
		} else if (key === '%') {
			percent();
		}
	}
</script>

<svelte:window onkeydown={handle_key} />

<section class="container">
	<header class="app-window-drag-handle"></header>

	<section class="show-area" class:error={is_error} aria-live="polite" aria-atomic="true">
		{display}
	</section>

	<section class="buttons-container">
		<button class="utility-button" onclick={clear} aria-label="Clear"> AC </button>
		<button class="utility-button" onclick={toggle_sign} aria-label="Toggle sign">
			<PlusMinus />
		</button>
		<button class="utility-button" onclick={percent} aria-label="Percent"> % </button>
		<button
			class="operation-button"
			class:selected={pending_operator === '÷' && replace_display}
			onclick={() => choose_operator('÷')}
			aria-label="Divide"
		>
			<Division />
		</button>
		<button class="number-button" onclick={() => input_digit('7')}> 7 </button>
		<button class="number-button" onclick={() => input_digit('8')}> 8 </button>
		<button class="number-button" onclick={() => input_digit('9')}> 9 </button>
		<button
			class="operation-button"
			class:selected={pending_operator === '×' && replace_display}
			onclick={() => choose_operator('×')}
			aria-label="Multiply"
		>
			<Multiply />
		</button>
		<button class="number-button" onclick={() => input_digit('4')}> 4 </button>
		<button class="number-button" onclick={() => input_digit('5')}> 5 </button>
		<button class="number-button" onclick={() => input_digit('6')}> 6 </button>
		<button
			class="operation-button"
			class:selected={pending_operator === '−' && replace_display}
			onclick={() => choose_operator('−')}
			aria-label="Subtract"
		>
			<Minus />
		</button>
		<button class="number-button" onclick={() => input_digit('1')}> 1 </button>
		<button class="number-button" onclick={() => input_digit('2')}> 2 </button>
		<button class="number-button" onclick={() => input_digit('3')}> 3 </button>
		<button
			class="operation-button"
			class:selected={pending_operator === '+' && replace_display}
			onclick={() => choose_operator('+')}
			aria-label="Add"
		>
			<Plus />
		</button>
		<button
			class="number-button curved-bottom-left-button"
			style:grid-column="1 / span 2"
			onclick={() => input_digit('0')}
		>
			0
		</button>
		<button class="number-button" onclick={input_decimal} aria-label="Decimal point"> . </button>
		<button
			class="equals-button curved-bottom-right-button"
			onclick={equals}
			aria-label="Equals"
		>
			<Equal />
		</button>
	</section>
</section>

<style>
	header {
		height: 2.1rem;
	}

	.container {
		height: 100%;
		width: 100%;

		background-color: hsla(258, 42%, 8%, 0.82);
		background-image: var(--system-glass-sheen);
		backdrop-filter: blur(24px) saturate(120%);

		border-radius: inherit;

		display: grid;
		grid-template-rows: auto auto 1fr;

		font-family: var(--system-font-family) !important;
		user-select: none;
	}

	.buttons-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 0.4rem;

		padding: 0 0.7rem 0.75rem;

		& > button {
			font-size: 1.2rem;
			font-weight: 400 !important;
			color: hsla(var(--system-color-light-contrast-hsl), 0.94);

			border-radius: 0.6rem;

			transition:
				background-color 120ms ease,
				filter 120ms ease,
				transform 90ms ease;

			&:hover {
				filter: brightness(1.18);
			}

			&:active {
				transform: scale(0.97);
			}

			&:focus-visible {
				box-shadow: 0 0 0 0.2rem hsla(var(--system-color-primary-hsl), 0.4);
			}
		}

		:global(svg) {
			font-size: 1.05rem;
		}
	}

	.number-button {
		background-color: hsla(255, 28%, 82%, 0.09);

		&:hover {
			background-color: hsla(255, 28%, 82%, 0.15);
		}
	}

	.utility-button {
		background-color: hsla(255, 28%, 82%, 0.14);
		color: hsla(var(--system-color-light-contrast-hsl), 0.82) !important;
		font-size: 1rem !important;

		&:hover {
			background-color: hsla(255, 28%, 82%, 0.2);
		}
	}

	.operation-button {
		background-color: hsla(255, 28%, 82%, 0.09);
		color: hsl(var(--system-color-primary-hsl)) !important;
		fill: hsl(var(--system-color-primary-hsl));
		font-weight: 500 !important;

		&:hover {
			background-color: hsla(255, 28%, 82%, 0.15);
		}

		&.selected {
			background-color: var(--system-color-primary);
			color: var(--system-color-primary-contrast) !important;
			fill: var(--system-color-primary-contrast);
		}
	}

	.equals-button {
		background-color: var(--system-color-primary);
		color: var(--system-color-primary-contrast) !important;
		fill: var(--system-color-primary-contrast);
		font-weight: 600 !important;

		&:hover {
			background-color: hsla(var(--system-color-primary-hsl), 0.86);
		}
	}

	.curved-bottom-left-button {
		border-radius: 0.6rem;
	}

	.curved-bottom-right-button {
		border-radius: 0.6rem;
	}

	.show-area {
		font-size: 2.6rem;
		font-weight: 300;

		color: hsla(var(--system-color-light-contrast-hsl), 0.96);

		text-align: end;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;

		overflow-x: auto;
		overflow-y: hidden;
		white-space: nowrap;

		padding: 0.2rem 1rem 0.75rem;

		&.error {
			color: hsl(342, 80%, 68%);
			font-size: 2rem;
		}
	}

	:global(.tl-container.calculator) {
		top: 0.7rem;
		left: 0.7rem;
	}
</style>
