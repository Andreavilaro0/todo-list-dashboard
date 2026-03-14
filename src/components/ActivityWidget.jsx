import { useMemo } from 'react';

function ActivityWidget({ tasks }) {
	const stats = useMemo(() => {
		const total = tasks.length;
		const completed = tasks.filter((t) => t.completed).length;
		const active = total - completed;
		const todayStr = new Date().toISOString().split('T')[0];
		const overdue = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < todayStr).length;
		const inProgress = tasks.filter((t) => t.status === 'progress').length;
		const pct = total ? Math.round((completed / total) * 100) : 0;
		return { total, completed, active, overdue, inProgress, pct };
	}, [tasks]);

	const radius = 55;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (stats.pct / 100) * circumference;
	const innerRadius = 42;
	const innerCircumference = 2 * Math.PI * innerRadius;
	const innerOffset = innerCircumference - (stats.inProgress / (stats.total || 1)) * innerCircumference;

	return (
		<div className="rounded-3xl p-6 bg-gray-900 text-white min-h-[200px] flex flex-col items-center justify-between shadow-lg shadow-gray-900/30">
			<h3 className="text-base font-semibold self-start">Actividad</h3>

			{/* Doble ring chart */}
			<div className="relative w-32 h-32">
				<svg className="w-32 h-32 -rotate-90" viewBox="0 0 130 130">
					<circle cx="65" cy="65" r={radius} fill="none" stroke="#1f2937" strokeWidth="8" />
					<circle
						cx="65" cy="65" r={radius} fill="none"
						stroke="#818cf8" strokeWidth="8" strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						className="transition-all duration-700"
					/>
					<circle cx="65" cy="65" r={innerRadius} fill="none" stroke="#1f2937" strokeWidth="6" />
					<circle
						cx="65" cy="65" r={innerRadius} fill="none"
						stroke="#34d399" strokeWidth="6" strokeLinecap="round"
						strokeDasharray={innerCircumference}
						strokeDashoffset={innerOffset}
						className="transition-all duration-700"
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className="text-2xl font-bold">{stats.pct}%</span>
				</div>
			</div>

			{/* Legend */}
			<div className="flex gap-4 text-[11px]">
				<div className="flex items-center gap-1.5">
					<div className="w-2 h-2 rounded-full bg-indigo-400" />
					<span className="text-gray-400">{stats.completed} hechas</span>
				</div>
				<div className="flex items-center gap-1.5">
					<div className="w-2 h-2 rounded-full bg-emerald-400" />
					<span className="text-gray-400">{stats.inProgress} en curso</span>
				</div>
				{stats.overdue > 0 && (
					<div className="flex items-center gap-1.5">
						<div className="w-2 h-2 rounded-full bg-red-400" />
						<span className="text-red-400">{stats.overdue} vencidas</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default ActivityWidget;
