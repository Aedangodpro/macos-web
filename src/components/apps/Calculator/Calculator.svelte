<script lang="ts">
	import Plus from '~icons/ic/outline-plus';
	import Equal from '~icons/ic/round-equals';
	import Minus from '~icons/ic/round-minus';
	import PlusMinus from '~icons/majesticons/plus-minus-2';
	import Division from '~icons/ph/divide-bold';
	import Multiply from '~icons/uil/multiply';
</script>

<section class="container">
	<header class="app-window-drag-handle"></header>

	<section class="show-area">0</section>

	<section class="buttons-container">
		<button class="top-row-button"> AC </button>
		<button class="top-row-button">
			<PlusMinus />
		</button>
		<button class="top-row-button"> % </button>
		<button class="operation-button">
			<Division />
		</button>
		<button class="number-button"> 7 </button>
		<button class="number-button"> 8 </button>
		<button class="number-button"> 9 </button>
		<button class="operation-button">
			<Multiply />
		</button>
		<button class="number-button"> 4 </button>
		<button class="number-button"> 5 </button>
		<button class="number-button"> 6 </button>
		<button class="operation-button">
			<Minus />
		</button>
		<button class="number-button"> 1 </button>
		<button class="number-button"> 2 </button>
		<button class="number-button"> 3 </button>
		<button class="operation-button"> <Plus /> </button>
		<button class="number-button curved-bottom-left-button" style:grid-column="1 / span 2">
			0
		</button>
		<button class="number-button"> . </button>
		<button class="operation-button curved-bottom-right-button"> <Equal /> </button>
	</section>
</section>

<style>
	header {
		padding: 1rem;
	}

	.container {
		height: 100%;
		width: 100%;

		background-color: hsla(258, 42%, 8%, 0.72);
		background-image: var(--system-glass-sheen);
		backdrop-filter: blur(15px);

		border-radius: inherit;

		display: grid;
		grid-template-rows: auto auto 1fr;

		font-family: var(--system-font-family) !important;
	}

	.buttons-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 1px;

		margin: 1.5px;

		& > button {
			font-size: 1.414rem;
			font-weight: 400 !important;
			color: white;
			fill: white;
		}

		:global(svg) {
			font-size: 1.2rem;
		}
	}

	.top-row-button {
		background-color: hsla(258, 30%, 26%, 0.45);
	}

	.number-button {
		background-color: hsla(255, 22%, 74%, 0.22);
	}

	.operation-button {
		background-color: hsl(var(--system-color-primary-hsl));
		color: var(--system-color-primary-contrast) !important;
		fill: var(--system-color-primary-contrast);
	}

	.curved-bottom-left-button {
		border-radius: 0 0 0 0.7rem;
	}

	.curved-bottom-right-button {
		border-radius: 0 0 0.7rem 0;
	}

	.show-area {
		font-size: 3rem;
		color: var(--system-color-light-contrast);
		text-align: end;
		font-weight: 200;

		overflow: auto;

		padding: 0.5rem 1rem;
	}

	:global(.tl-container.calculator) {
		top: 0.7rem;
		left: 0.7rem;
	}
</style>
