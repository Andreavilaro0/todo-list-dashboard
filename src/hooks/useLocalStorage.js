import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook: useLocalStorage
 * Sincroniza un estado con localStorage automáticamente.
 */
function useLocalStorage(key, initialValue) {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			return initialValue;
		}
	});

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		try {
			localStorage.setItem(key, JSON.stringify(storedValue));
		} catch (error) {
			// silently ignore storage errors
		}
	}, [key, storedValue]);

	return [storedValue, setStoredValue];
}

export default useLocalStorage;
