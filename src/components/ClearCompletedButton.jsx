import { useTheme } from '../context/ThemeContext';

function ClearCompletedButton({ count = 0, onClear }) {
	const { theme } = useTheme();
	if (!count) return null;
	const isDark = theme === 'dark';

	return (
		<div className="mt-4 text-center">
			<button
				onClick={onClear}
				className={`px-5 py-2 text-xs font-medium rounded-full transition-all duration-200 ${
					isDark
						? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
						: 'bg-red-50 text-red-600 hover:bg-red-100'
				}`}
			>
				Limpiar {count} completada{count > 1 ? 's' : ''}
			</button>
		</div>
	);
}

export default ClearCompletedButton;
