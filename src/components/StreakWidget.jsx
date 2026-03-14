import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

function StreakWidget({ tasks }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	const stats = useMemo(() => {
		const completed = tasks.filter((t) => t.completed).length;
		const streak = Math.min(completed, 7);

		const week = [];
		for (let i = 6; i >= 0; i--) {
			const d = new Date();
			d.setDate(d.getDate() - i);
			const dateStr = d.toISOString().split('T')[0];
			const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
			const dayCompleted = dayTasks.filter((t) => t.completed).length;
			week.push({
				label: d.toLocaleDateString('es-ES', { weekday: 'narrow' }).toUpperCase(),
				active: dayCompleted > 0,
				total: dayTasks.length,
				isToday: i === 0,
			});
		}

		return { streak, week };
	}, [tasks]);

	return (
		<div className={`rounded-3xl p-5 h-full flex flex-col items-center justify-between transition-colors ${
			isDark
				? 'bg-gradient-to-b from-emerald-900/40 to-teal-900/40 shadow-lg shadow-emerald-900/20'
				: 'bg-gradient-to-b from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20'
		} text-white`}>
			<h3 className="text-xs font-semibold text-white/70 self-start">Racha</h3>

			<div className="text-center">
				<div className="text-5xl font-bold animate-count">{stats.streak}</div>
				<p className="text-[10px] text-white/50 mt-1">dias</p>
			</div>

			{/* Week dots - vertical for narrow widget */}
			<div className="flex flex-col gap-1 w-full">
				{stats.week.map((day, i) => (
					<div key={i} className="flex items-center gap-2">
						<span className={`text-[9px] w-3 font-medium ${day.isToday ? 'text-white/90' : 'text-white/30'}`}>
							{day.label}
						</span>
						<div className={`flex-1 h-2 rounded-full transition-all ${
							day.active
								? 'bg-white/40'
								: 'bg-white/10'
						}`} />
						{day.active && <span className="text-[8px] text-white/60">✓</span>}
					</div>
				))}
			</div>
		</div>
	);
}

export default StreakWidget;
