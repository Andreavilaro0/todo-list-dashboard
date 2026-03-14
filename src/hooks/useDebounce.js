import { useState, useEffect } from 'react';

/**
 * Custom hook: useDebounce
 * Retrasa la actualización de un valor hasta que el usuario deje de escribir.
 * Incluye cleanup del timer para evitar memory leaks.
 */
function useDebounce(value, delay = 300) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Cleanup: cancelar timer anterior si el valor cambia antes del delay
		return () => clearTimeout(timer);
	}, [value, delay]);

	return debouncedValue;
}

export default useDebounce;
