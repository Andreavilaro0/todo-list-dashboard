import { useMemo, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * TaskMapWidget: Mapa interactivo que muestra pins de todas las tareas con dirección.
 * Usa Google Maps embed con marcadores. Click en una tarea para centrar en ella.
 */
function TaskMapWidget({ tasks, onOpenDetail }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const [selectedTask, setSelectedTask] = useState(null);

	// Filtrar tareas que tienen dirección
	const tasksWithAddress = useMemo(() => {
		return tasks.filter((t) => t.address && t.address.trim());
	}, [tasks]);

	const handleTaskClick = (task) => {
		setSelectedTask(task);
		onOpenDetail(task);
	};

	const handleShowAll = () => {
		setSelectedTask(null);
	};

	if (tasksWithAddress.length === 0) {
		return (
			<div className={`rounded-3xl p-6 min-h-[300px] flex flex-col items-center justify-center transition-colors ${
				isDark ? 'bg-gray-700/40 shadow-lg shadow-black/10' : 'bg-white/80 shadow-lg shadow-gray-200/30'
			}`}>
				<svg className={`w-10 h-10 mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
					<path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
				<p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Sin ubicaciones</p>
			</div>
		);
	}

	// Construir URL del mapa con la dirección seleccionada o la primera
	const mapAddress = selectedTask?.address || tasksWithAddress[0]?.address;
	const mapQuery = encodeURIComponent(mapAddress);

	const priorityDot = { alta: 'bg-red-500', media: 'bg-amber-400', baja: 'bg-green-500' };
	const statusBadge = {
		todo: { label: 'To do', cls: isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600' },
		progress: { label: 'En curso', cls: 'bg-amber-500/15 text-amber-500' },
		done: { label: 'Hecho', cls: 'bg-green-500/15 text-green-500' },
	};

	return (
		<div className={`rounded-3xl overflow-hidden transition-colors ${
			isDark ? 'bg-gray-700/40 shadow-lg shadow-black/10' : 'bg-white/80 shadow-lg shadow-gray-200/30'
		}`}>
			{/* Mapa */}
			<div className="relative">
				<iframe
					title="Mapa de tareas"
					width="100%"
					height="350"
					src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
					className="border-none"
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
				/>
				{/* Badge de cantidad */}
				<div className={`absolute top-3 left-3 px-3 py-1.5 rounded-2xl text-xs font-semibold backdrop-blur-md ${
					isDark ? 'bg-gray-900/80 text-white' : 'bg-white/90 text-gray-800 shadow-md'
				}`}>
					{tasksWithAddress.length} ubicacion{tasksWithAddress.length !== 1 ? 'es' : ''}
				</div>
				{/* Ver todas button */}
				{selectedTask && (
					<button
						onClick={handleShowAll}
						className={`absolute top-3 right-3 px-3 py-1.5 rounded-2xl text-xs font-semibold backdrop-blur-md transition-all duration-200 ${
							isDark
								? 'bg-indigo-500/80 text-white hover:bg-indigo-500'
								: 'bg-indigo-500 text-white shadow-md hover:bg-indigo-600'
						}`}
					>
						Ver todas
					</button>
				)}
			</div>

			{/* Lista de tareas con ubicación */}
			<div className="p-4 space-y-1.5 max-h-[260px] overflow-y-auto">
				<h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
					Tareas con ubicacion
				</h4>
				{tasksWithAddress.map((task) => {
					const isSelected = selectedTask?.id === task.id;
					const taskStatus = task.status || (task.completed ? 'done' : 'todo');
					const badge = statusBadge[taskStatus] || statusBadge.todo;

					return (
						<button
							key={task.id}
							onClick={() => handleTaskClick(task)}
							onMouseEnter={() => setSelectedTask(task)}
							className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all duration-200 ${
								isSelected
									? isDark
										? 'bg-indigo-500/20 ring-2 ring-indigo-500/40'
										: 'bg-indigo-50 ring-2 ring-indigo-400/40'
									: isDark ? 'hover:bg-gray-600/40' : 'hover:bg-gray-50'
							}`}
						>
							<div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${priorityDot[task.priority]}`} />
							<div className="flex-1 min-w-0">
								<p className={`text-sm font-medium truncate ${
									task.completed
										? 'line-through text-gray-400'
										: isDark ? 'text-gray-200' : 'text-gray-800'
								}`}>
									{task.text}
								</p>
								<div className="flex items-center gap-2 mt-1">
									{/* Status badge */}
									<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${badge.cls}`}>
										{badge.label}
									</span>
									{/* Time */}
									{task.dueTime && (
										<span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
											{task.dueTime}
										</span>
									)}
								</div>
								<div className="flex items-center gap-2 mt-1">
									<svg className={`w-3 h-3 shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									</svg>
									<p className={`text-[11px] truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
										{task.address}
									</p>
								</div>
							</div>
							<svg className={`w-4 h-4 shrink-0 mt-1 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
							</svg>
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default TaskMapWidget;
