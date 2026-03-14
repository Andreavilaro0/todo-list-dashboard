import { useMemo } from 'react';

function TodayWidget({ tasks, onOpenDetail }) {
	const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

	const todayTasks = useMemo(() => {
		return tasks
			.filter((t) => !t.completed && t.dueDate === todayStr)
			.sort((a, b) => (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59'));
	}, [tasks, todayStr]);

	return (
		<div className="rounded-3xl p-6 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white min-h-[220px] flex flex-col shadow-lg shadow-amber-500/20">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-base font-semibold">Hoy</h3>
				<span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">
					{todayTasks.length}
				</span>
			</div>

			{todayTasks.length === 0 ? (
				<div className="flex-1 flex items-center justify-center">
					<p className="text-sm text-white/60">Sin tareas para hoy</p>
				</div>
			) : (
				<div className="space-y-2 flex-1">
					{todayTasks.slice(0, 5).map((task) => (
						<button
							key={task.id}
							onClick={() => onOpenDetail(task)}
							className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/15 hover:bg-white/25 transition-colors text-left"
						>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium truncate">{task.text}</p>
								{task.dueTime && (
									<p className="text-[11px] text-white/60 mt-0.5">{task.dueTime}</p>
								)}
							</div>
							<svg className="w-4 h-4 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
							</svg>
						</button>
					))}
				</div>
			)}
		</div>
	);
}

export default TodayWidget;
