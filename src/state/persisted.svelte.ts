import { auto_destroy_effect_root } from './auto-destroy-effect-root.svelte.ts';

type Primitive = string | null | symbol | boolean | number | undefined | bigint;

const is_primitive = (val: any): val is Primitive => {
	return val !== Object(val) || val === null;
};

/**
 * Reads persisted state defensively: storage can be unavailable (private mode,
 * blocked cookies) and its contents can be corrupt or edited by hand, either of
 * which used to throw and take the whole desktop down.
 */
function read_persisted<T>(key: string, initial: T): T {
	let existing: string | null = null;

	try {
		existing = localStorage.getItem(key);
	} catch {
		return initial;
	}

	if (!existing) return initial;

	try {
		const parsed = JSON.parse(existing) as T;

		if (is_primitive(initial)) {
			return is_primitive(parsed) ? parsed : initial;
		}

		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return initial;

		// Merge over the defaults so keys added in a later version still resolve.
		return { ...initial, ...parsed } as T;
	} catch {
		return initial;
	}
}

export function persisted<T>(key: string, initial: T) {
	const primitive = is_primitive(initial);
	const parsed_value = read_persisted(key, initial);

	const initial_state = (primitive ? { value: parsed_value } : parsed_value) as T extends Primitive
		? { value: T }
		: T;

	let state = $state<T extends Primitive ? { value: T } : T>(initial_state);

	auto_destroy_effect_root(() => {
		$effect(() => {
			try {
				// @ts-ignore
				localStorage.setItem(key, JSON.stringify(primitive ? state.value : state));
			} catch {
				// Storage full or unavailable; in-memory state still works
			}
		});
	});

	return state;
}
