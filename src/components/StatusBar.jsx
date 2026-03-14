import { useTheme } from '../context/ThemeContext';

function StatusBar({ savedIndicator, totalCount, completedCount }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	return (
		<>
			{savedIndicator && (
				<div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-2xl text-xs font-medium shadow-xl animate-bounce-in backdrop-blur-xl ${
					isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-500 text-white'
				}`}>
					Cambios guardados
				</div>
			)}

			<div className={`mt-6 rounded-3xl px-5 py-3 text-center text-xs ${isDark ? 'text-gray-600 bg-gray-700/20' : 'text-gray-400 bg-white/40'}`}>
				{totalCount} tareas · {completedCount} completadas · {totalCount - completedCount} pendientes
			</div>
		</>
	);
}

export default StatusBar;
