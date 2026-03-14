import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

function StatsPanel({ tasks }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	const stats = useMemo(() => {
		const now = new Date();
		const todayStr = now.toISOString().split('T')[0];
		const completed = tasks.filter((t) => t.completed);
		const pending = tasks.filter((t) => !t.completed);
		const overdue = pending.filter((t) => t.dueDate && t.dueDate < todayStr);
		const dueToday = pending.filter((t) => t.dueDate === todayStr);

		// By priority
		const byPriority = { alta: 0, media: 0, baja: 0 };
		for (const task of tasks) {
			if (task.priority && byPriority[task.priority] !== undefined) {
				byPriority[task.priority]++;
			}
		}

		// By status
		const byStatus = { todo: 0, progress: 0, done: 0 };
		for (const task of tasks) {
			const s = task.status || (task.completed ? 'done' : 'todo');
			if (byStatus[s] !== undefined) byStatus[s]++;
		}

		// By category
		const byCategory = {};
		for (const task of tasks) {
			const cat = task.category || 'Sin categoria';
			if (!byCategory[cat]) byCategory[cat] = { total: 0, completed: 0 };
			byCategory[cat].total++;
			if (task.completed) byCategory[cat].completed++;
		}

		// Weekly activity (last 7 days)
		const weeklyActivity = [];
		const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
		for (let i = 6; i >= 0; i--) {
			const d = new Date();
			d.setDate(d.getDate() - i);
			const dateStr = d.toISOString().split('T')[0];
			const count = completed.filter((t) => t.dueDate === dateStr || t.createdAt === dateStr).length;
			weeklyActivity.push({
				day: dayNames[d.getDay()],
				date: dateStr,
				count,
				isToday: i === 0,
			});
		}
		const maxWeekly = Math.max(...weeklyActivity.map((d) => d.count), 1);

		return {
			total: tasks.length,
			completed: completed.length,
			pending: pending.length,
			overdue: overdue.length,
			dueToday: dueToday.length,
			rate: tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0,
			byPriority,
			byStatus,
			byCategory,
			weeklyActivity,
			maxWeekly,
		};
	}, [tasks]);

	// Donut chart SVG
	const donutRadius = 70;
	const donutStroke = 12;
	const donutCircumference = 2 * Math.PI * donutRadius;
	const donutOffset = donutCircumference - (stats.rate / 100) * donutCircumference;

	const cardBase = `rounded-3xl p-5 transition-colors ${isDark ? 'bg-gray-700/40 shadow-lg shadow-black/10' : 'bg-white/80 shadow-lg shadow-gray-200/30'}`;

	return (
		<div className="space-y-5">
			{/* Row 1: Donut + Status cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* Completion donut */}
				<div className={`${cardBase} flex flex-col items-center justify-center animate-widget`}>
					<h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
						Progreso general
					</h4>
					<div className="relative">
						<svg width="170" height="170" viewBox="0 0 170 170">
							<circle
								cx="85" cy="85" r={donutRadius}
								fill="none"
								stroke={isDark ? '#374151' : '#e5e7eb'}
								strokeWidth={donutStroke}
							/>
							<circle
								cx="85" cy="85" r={donutRadius}
								fill="none"
								stroke="url(#donutGrad)"
								strokeWidth={donutStroke}
								strokeLinecap="round"
								strokeDasharray={donutCircumference}
								strokeDashoffset={donutOffset}
								transform="rotate(-90 85 85)"
								className="transition-all duration-1000 ease-out"
							/>
							<defs>
								<linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stopColor="#6366f1" />
									<stop offset="100%" stopColor="#a855f7" />
								</linearGradient>
							</defs>
						</svg>
						<div className="absolute inset-0 flex flex-col items-center justify-center">
							<span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
								{stats.rate}%
							</span>
							<span className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
								completado
							</span>
						</div>
					</div>
					<div className={`flex gap-6 mt-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
						<span><strong className={isDark ? 'text-white' : 'text-gray-900'}>{stats.completed}</strong> hechas</span>
						<span><strong className={isDark ? 'text-white' : 'text-gray-900'}>{stats.pending}</strong> pendientes</span>
					</div>
				</div>

				{/* Status cards grid */}
				<div className="grid grid-cols-1 gap-4 animate-widget animate-widget-d1">
					{/* To do */}
					<div className={`${cardBase} flex items-center gap-4`}>
						<div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-gray-600/50' : 'bg-gray-100'}`}>
							<svg className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
							</svg>
						</div>
						<div className="flex-1">
							<p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.byStatus.todo}</p>
							<p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>To do</p>
						</div>
					</div>
					{/* In progress */}
					<div className={`${cardBase} flex items-center gap-4`}>
						<div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/15">
							<svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div className="flex-1">
							<p className="text-2xl font-bold text-amber-500">{stats.byStatus.progress}</p>
							<p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>In progress</p>
						</div>
					</div>
					{/* Done */}
					<div className={`${cardBase} flex items-center gap-4`}>
						<div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-500/15">
							<svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div className="flex-1">
							<p className="text-2xl font-bold text-green-500">{stats.byStatus.done}</p>
							<p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Done</p>
						</div>
					</div>
				</div>
			</div>

			{/* Row 2: Priority bars + Overdue alert */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* Tasks by priority */}
				<div className={`${cardBase} animate-widget animate-widget-d2`}>
					<h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
						Por prioridad
					</h4>
					<div className="space-y-4">
						{[
							{ key: 'alta', label: 'Alta', color: 'bg-red-500', textColor: 'text-red-500' },
							{ key: 'media', label: 'Media', color: 'bg-amber-400', textColor: 'text-amber-500' },
							{ key: 'baja', label: 'Baja', color: 'bg-green-500', textColor: 'text-green-500' },
						].map(({ key, label, color, textColor }) => {
							const count = stats.byPriority[key];
							const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
							return (
								<div key={key}>
									<div className="flex justify-between items-center mb-1.5">
										<span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
										<span className={`text-sm font-bold ${textColor}`}>{count}</span>
									</div>
									<div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-100'}`}>
										<div
											className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
											style={{ width: `${pct}%` }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Overdue alert or Due Today */}
				<div className="space-y-4 animate-widget animate-widget-d3">
					{stats.overdue > 0 && (
						<div className="rounded-3xl p-5 bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/5">
							<div className="flex items-center gap-3 mb-2">
								<div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center">
									<svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
									</svg>
								</div>
								<div>
									<p className="text-red-500 font-bold text-lg">{stats.overdue} vencida{stats.overdue !== 1 ? 's' : ''}</p>
									<p className={`text-xs ${isDark ? 'text-red-400/70' : 'text-red-400'}`}>
										Tareas con fecha pasada sin completar
									</p>
								</div>
							</div>
						</div>
					)}

					{stats.dueToday > 0 && (
						<div className={`rounded-3xl p-5 ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200/50'} shadow-lg`}>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center">
									<svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div>
									<p className="text-amber-500 font-bold text-lg">{stats.dueToday} para hoy</p>
									<p className={`text-xs ${isDark ? 'text-amber-400/70' : 'text-amber-600/60'}`}>
										Tareas que vencen hoy
									</p>
								</div>
							</div>
						</div>
					)}

					{stats.overdue === 0 && stats.dueToday === 0 && (
						<div className={`${cardBase} flex items-center gap-3`}>
							<div className="w-10 h-10 rounded-2xl bg-green-500/15 flex items-center justify-center">
								<svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<div>
								<p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Todo al dia</p>
								<p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No hay tareas vencidas</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Row 3: Weekly Activity */}
			<div className={`${cardBase} animate-widget animate-widget-d3`}>
				<h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
					Actividad semanal
				</h4>
				<div className="flex items-end gap-2 h-32">
					{stats.weeklyActivity.map((day) => {
						const height = day.count > 0 ? Math.max((day.count / stats.maxWeekly) * 100, 8) : 4;
						return (
							<div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
								<span className={`text-[10px] font-semibold ${day.count > 0 ? (isDark ? 'text-white' : 'text-gray-700') : (isDark ? 'text-gray-600' : 'text-gray-300')}`}>
									{day.count > 0 ? day.count : ''}
								</span>
								<div
									className={`w-full max-w-[36px] rounded-xl transition-all duration-700 ease-out ${
										day.isToday
											? 'bg-gradient-to-t from-indigo-500 to-purple-500'
											: day.count > 0
												? isDark ? 'bg-indigo-500/40' : 'bg-indigo-200'
												: isDark ? 'bg-gray-700' : 'bg-gray-100'
									}`}
									style={{ height: `${height}%` }}
								/>
								<span className={`text-[10px] ${
									day.isToday
										? 'text-indigo-500 font-bold'
										: isDark ? 'text-gray-600' : 'text-gray-400'
								}`}>
									{day.day}
								</span>
							</div>
						);
					})}
				</div>
			</div>

			{/* Row 4: Category breakdown */}
			{Object.keys(stats.byCategory).length > 0 && (
				<div className={`${cardBase} animate-widget animate-widget-d4`}>
					<h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
						Por categoria
					</h4>
					<div className="space-y-3">
						{Object.entries(stats.byCategory).map(([cat, data]) => {
							const pct = data.total ? Math.round((data.completed / data.total) * 100) : 0;
							const catColors = {
								Personal: 'from-purple-500 to-pink-500',
								Trabajo: 'from-blue-500 to-cyan-500',
								Estudio: 'from-teal-500 to-emerald-500',
								Otro: 'from-amber-500 to-orange-500',
							};
							const gradient = catColors[cat] || 'from-indigo-500 to-purple-500';
							return (
								<div key={cat}>
									<div className="flex justify-between items-center mb-1.5">
										<span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{cat}</span>
										<span className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
											{data.completed}/{data.total} ({pct}%)
										</span>
									</div>
									<div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-600' : 'bg-gray-100'}`}>
										<div
											className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 ease-out`}
											style={{ width: `${pct}%` }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

export default StatsPanel;
