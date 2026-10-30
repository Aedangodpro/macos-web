import { mount } from 'svelte';
import Desktop from './components/Desktop/Desktop.svelte';
import './css/global.css';

const target = document.getElementById('root');

let desktop: ReturnType<typeof mount> | undefined;

try {
	desktop = mount(Desktop, { target });
} catch (error) {
	// Without this the page keeps whatever the boot screen rendered and never
	// recovers. Show the fallback with a reload instead of a silent hang.
	console.error('Desktop failed to mount', error);

	const fallback = document.getElementById('boot-fallback');

	if (fallback) {
		fallback.hidden = false;

		const detail = fallback.querySelector('p');

		if (detail) {
			detail.textContent =
				'The desktop hit an error while starting. Reloading usually clears it.';
		}
	}
}

export default desktop;
