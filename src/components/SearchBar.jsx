import { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

function SearchBar({ value, onChange }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current.focus();
	}, []);

	return (
		<div className="mb-5">
			<div className={`flex items-center gap-3 px-5 py-3.5 rounded-3xl transition-colors ${
				isDark ? 'bg-gray-700/40' : 'bg-white/80'
			}`}>
				<svg className={`w-4 h-4 shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input
					ref={inputRef}
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder="Buscar tareas, notas, tags..."
					className={`flex-1 bg-transparent text-sm focus:outline-none ${
						isDark ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
					}`}
				/>
				{value && (
					<button onClick={() => onChange('')} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
						&times;
					</button>
				)}
			</div>
		</div>
	);
}

export default SearchBar;
