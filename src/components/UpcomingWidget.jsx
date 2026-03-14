import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

function UpcomingWidget({ tasks, onOpenDetail }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	const upcoming = useMemo(() => {
		const today = new Date().toISOString().split('T')[0];
		return tasks
			.filter((t) => !t.completed && t.dueDate && t.dueDate > today)
			.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
			.slice(0, 5);
	}, [tasks]);

	const priorityDot = { alta: 'bg-red-500', media: 'bg-amber-400', baja: 'bg-green-500' };

	return (
		<div className={`rounded-3xl p-6 min-h-[220px] flex flex-col transition-colors ${isDark ? 'bg-gray-700/40 shadow-lg shadow-black/10' : 'bg-white/80 shadow-lg shadow-gray-300/30'}`}>
			<div className="flex items-center justify-between mb-4">
				<h3 className={`text-base font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
					Proximas entregas
				</h3>
				<span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
					{upcoming.length}
				</span>
			</div>
			{upcoming.length === 0 ? (
				<div className="flex-1 flex items-center justify-center">
					<p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Sin entregas pendientes</p>
				</div>
			) : (
				<div className="space-y-2 flex-1">
					{upcoming.map((task) => (
						<button
							key={task.id}
							onClick={() => onOpenDetail(task)}
							className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-colors ${
								isDark ? 'hover:bg-gray-600/50' : 'hover:bg-gray-50'
							}`}
						>
							<div className={`w-2.5 h-2.5 rounded-full shrink-0 ${priorityDot[task.priority]}`} />
							<div className="flex-1 min-w-0">
								<p className={`text-sm font-medium truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
									{task.text}
								</p>
								<p className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
									{task.dueDate}{task.dueTime ? ` · ${task.dueTime}` : ''}
								</p>
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}

export default UpcomingWidget;
