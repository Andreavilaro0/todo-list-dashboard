import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook: useFetch
 * Realiza peticiones HTTP con AbortController para cancelar requests.
 * Maneja: data, loading, error, refetch y race conditions.
 */
function useFetch(url) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const fetchIdRef = useRef(0);

	const fetchData = useCallback(
		async (signal) => {
			// Incrementar ID para evitar race conditions
			const fetchId = ++fetchIdRef.current;

			setLoading(true);
			setError(null);

			try {
				const response = await fetch(url, { signal });

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const json = await response.json();

				// Solo actualizar si es la petición más reciente (evitar race conditions)
				if (fetchId === fetchIdRef.current) {
					setData(json);
				}
			} catch (err) {
				if (err.name !== 'AbortError' && fetchId === fetchIdRef.current) {
					setError(err.message);
				}
			} finally {
				if (fetchId === fetchIdRef.current) {
					setLoading(false);
				}
			}
		},
		[url],
	);

	useEffect(() => {
		if (!url) {
			setLoading(false);
			return;
		}

		const controller = new AbortController();
		fetchData(controller.signal);

		// Cleanup: abortar la petición si el componente se desmonta o la URL cambia
		return () => controller.abort();
	}, [fetchData]);

	const refetch = useCallback(() => {
		const controller = new AbortController();
		fetchData(controller.signal);
	}, [fetchData]);

	return { data, loading, error, refetch };
}

export default useFetch;
