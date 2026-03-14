import { useTheme } from '../context/ThemeContext';

function ResetAppButton({ onReset, onClearStorage }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const cls = `text-xs transition-colors ${isDark ? 'text-gray-600 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`;

	return (
		<div className="flex gap-4">
			<button onClick={onReset} className={cls}>Resetear</button>
			<button onClick={onClearStorage} className={cls}>Limpiar storage</button>
		</div>
	);
}

export default ResetAppButton;
