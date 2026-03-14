import { useTheme } from '../context/ThemeContext';

const SORT_OPTIONS = [
	{ key: 'prioridad', label: 'Prioridad' },
	{ key: 'fecha', label: 'Recientes' },
	{ key: 'vencimiento', label: 'Vencimiento' },
	{ key: 'alfabetico', label: 'A-Z' },
];

function SortSelector({ activeSort, onSortChange }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	return (
		<select
			value={activeSort}
			onChange={(e) => onSortChange(e.target.value)}
			className={`text-xs px-3 py-1.5 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors cursor-pointer ${
				isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-white/60 text-gray-600'
			}`}
		>
			{SORT_OPTIONS.map(({ key, label }) => (
				<option key={key} value={key}>Ordenar: {label}</option>
			))}
		</select>
	);
}

export default SortSelector;
