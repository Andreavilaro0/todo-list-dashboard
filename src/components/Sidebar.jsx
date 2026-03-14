import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
	{ key: 'home', icon: 'home', label: 'Inicio' },
	{ key: 'tasks', icon: 'tasks', label: 'Tareas' },
	{ key: 'stats', icon: 'stats', label: 'Estadisticas' },
	{ key: 'calendar', icon: 'calendar', label: 'Calendario' },
];

const BOTTOM_ITEMS = [
	{ key: 'settings', icon: 'settings', label: 'Ajustes' },
];

const icons = {
	home: (
		<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
		</svg>
	),
	tasks: (
		<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
		</svg>
	),
	stats: (
		<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
		</svg>
	),
	calendar: (
		<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
		</svg>
	),
	settings: (
		<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
			<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
		</svg>
	),
	moon: (
		<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
		</svg>
	),
	sun: (
		<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
		</svg>
	),
};

function Sidebar({ activeView, onViewChange, tasks = [] }) {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === 'dark';

	const counts = useMemo(() => {
		const todayStr = new Date().toISOString().split('T')[0];
		const total = tasks.length;
		const overdue = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < todayStr).length;
		return { total, overdue };
	}, [tasks]);

	const btnClass = (isActive) =>
		`relative w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 ${
			isActive
				? isDark
					? 'bg-white text-gray-900 shadow-lg'
					: 'bg-gray-900 text-white shadow-lg'
				: isDark
					? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50'
					: 'text-gray-400 hover:text-gray-600 hover:bg-white/60'
		}`;

	const getBadge = (key) => {
		if (key === 'tasks' && counts.total > 0) {
			return (
				<span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center text-[9px] font-bold bg-indigo-500 text-white rounded-full px-1">
					{counts.total}
				</span>
			);
		}
		if (key === 'calendar' && counts.overdue > 0) {
			return (
				<span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full px-1">
					{counts.overdue}
				</span>
			);
		}
		return null;
	};

	return (
		<aside className="w-[72px] flex flex-col items-center py-6 shrink-0">
			{/* Logo */}
			<div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-8 ${
				isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'
			}`}>
				<div className="grid grid-cols-3 gap-[2px]">
					{[...Array(9)].map((_, i) => (
						<div
							key={i}
							className={`w-[5px] h-[5px] rounded-full ${
								[0, 2, 4, 6, 8].includes(i)
									? 'bg-indigo-500'
									: [1, 3].includes(i)
										? 'bg-orange-400'
										: 'bg-purple-400'
							}`}
						/>
					))}
				</div>
			</div>

			{/* Navigation */}
			<nav className={`flex flex-col items-center gap-2 px-2 py-3 rounded-2xl ${
				isDark ? 'bg-gray-800/50' : 'bg-white/40'
			}`}>
				{NAV_ITEMS.map(({ key, icon, label }) => (
					<button
						key={key}
						onClick={() => onViewChange(key)}
						className={btnClass(activeView === key)}
						title={label}
					>
						{icons[icon]}
						{getBadge(key)}
					</button>
				))}
			</nav>

			<div className="flex-1" />

			{/* Bottom actions */}
			<div className="flex flex-col items-center gap-2">
				{BOTTOM_ITEMS.map(({ key, icon, label }) => (
					<button
						key={key}
						onClick={() => onViewChange(key)}
						className={btnClass(activeView === key)}
						title={label}
					>
						{icons[icon]}
					</button>
				))}

				{/* Theme toggle */}
				<button
					onClick={toggleTheme}
					className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 ${
						isDark
							? 'text-yellow-400 hover:bg-gray-700/50'
							: 'text-gray-400 hover:text-gray-600 hover:bg-white/60'
					}`}
					title={isDark ? 'Modo claro' : 'Modo oscuro'}
				>
					{icons[isDark ? 'sun' : 'moon']}
				</button>

				{/* Avatar */}
				<div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mt-2 ${
					isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
				}`}>
					A
				</div>
			</div>
		</aside>
	);
}

export default Sidebar;
