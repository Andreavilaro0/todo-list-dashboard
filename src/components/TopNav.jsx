import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function TopNav({ tabs, activeCategory, onCategoryChange, onAddTab, onRemoveTab, onOpenNew, onToggleSearch, onToggleStats, searchOpen }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const [showAddInput, setShowAddInput] = useState(false);
	const [newTabName, setNewTabName] = useState('');

	const handleAddTab = () => {
		const name = newTabName.trim();
		if (name && !tabs.find((t) => t.name === name)) {
			onAddTab(name);
			setNewTabName('');
			setShowAddInput(false);
		}
	};

	const actionBtn = `w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
		isDark
			? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
			: 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 shadow-sm'
	}`;

	return (
		<header className="flex items-center justify-between px-8 py-5">
			{/* Left: Title + Category tabs */}
			<div className="flex items-center gap-4 flex-1 min-w-0">
				<h1 className={`text-lg font-semibold shrink-0 ${isDark ? 'text-white' : 'text-gray-900'}`}>
					Mis Tareas
				</h1>

				<nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
					{tabs.map((tab) => {
						const isActive = activeCategory === tab.name;
						return (
							<div key={tab.name} className="relative group shrink-0">
								<button
									onClick={() => onCategoryChange(tab.name)}
									className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
										isActive
											? isDark
												? 'bg-white text-gray-900'
												: 'bg-gray-900 text-white'
											: isDark
												? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
												: 'text-gray-500 hover:text-gray-700 hover:bg-white/80'
									}`}
									style={isActive && tab.color ? {
										backgroundColor: isDark ? tab.color : tab.color,
										color: 'white',
									} : undefined}
								>
									{tab.name}
								</button>
								{/* Delete button for custom tabs */}
								{tab.custom && (
									<button
										onClick={(e) => { e.stopPropagation(); onRemoveTab(tab.name); }}
										className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
									>
										&times;
									</button>
								)}
							</div>
						);
					})}

					{/* Add tab button */}
					{showAddInput ? (
						<div className="flex items-center gap-1 shrink-0">
							<input
								type="text"
								value={newTabName}
								onChange={(e) => setNewTabName(e.target.value)}
								onKeyDown={(e) => { if (e.key === 'Enter') handleAddTab(); if (e.key === 'Escape') setShowAddInput(false); }}
								placeholder="Nombre..."
								autoFocus
								className={`w-24 px-3 py-1.5 text-xs rounded-full border-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
									isDark ? 'bg-gray-700 text-white placeholder-gray-500' : 'bg-white text-gray-800 placeholder-gray-400'
								}`}
							/>
							<button onClick={handleAddTab} className="w-7 h-7 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center hover:bg-indigo-600">
								+
							</button>
							<button onClick={() => setShowAddInput(false)} className={`w-7 h-7 rounded-full text-xs flex items-center justify-center ${isDark ? 'text-gray-500 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}>
								&times;
							</button>
						</div>
					) : (
						<button
							onClick={() => setShowAddInput(true)}
							className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
								isDark ? 'text-gray-500 hover:bg-gray-700/50 hover:text-gray-300' : 'text-gray-400 hover:bg-white/80 hover:text-gray-600'
							}`}
							title="Agregar pestaña"
						>
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
							</svg>
						</button>
					)}
				</nav>
			</div>

			{/* Right: Action buttons */}
			<div className="flex items-center gap-2 shrink-0 ml-4">
				<button onClick={onOpenNew} className={actionBtn} title="Nueva tarea">
					<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
					</svg>
				</button>
				<button
					onClick={onToggleSearch}
					className={`${actionBtn} ${searchOpen ? (isDark ? 'bg-gray-600' : 'bg-gray-200') : ''}`}
					title="Buscar"
				>
					<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</button>
				<button onClick={onToggleStats} className={actionBtn} title="Estadisticas">
					<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
					</svg>
				</button>
			</div>
		</header>
	);
}

export default TopNav;
