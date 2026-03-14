import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Crear el contexto
const ThemeContext = createContext();

/**
 * ThemeProvider: Provee el tema (light/dark) a toda la app.
 * Usa useLocalStorage para persistir la preferencia del usuario.
 * Demuestra useContext.
 */
export function ThemeProvider({ children }) {
	const [theme, setTheme] = useLocalStorage('theme', 'light');

	const toggleTheme = () => {
		setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
	};

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

/**
 * Custom hook para acceder al tema.
 * Lanza error si se usa fuera del ThemeProvider.
 */
export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme debe usarse dentro de un ThemeProvider');
	}
	return context;
}
