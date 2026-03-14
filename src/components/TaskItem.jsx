import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

const priorityDots = { alta: 'bg-red-500', media: 'bg-amber-400', baja: 'bg-green-500' };

const categoryColors = {
	Personal: 'bg-purple-100 text-purple-700',
	Trabajo: 'bg-blue-100 text-blue-700',
	Estudio: 'bg-teal-100 text-teal-700',
	Otro: 'bg-gray-100 text-gray-600',
};

const statusBadge = {
	todo: { label: 'To do', cls: 'bg-gray-200 text-gray-600', clsDark: 'bg-gray-600 text-gray-300' },
	progress: { label: 'In progress', cls: 'bg-amber-100 text-amber-700', clsDark: 'bg-amber-500/20 text-amber-400' },
	done: { label: 'Done', cls: 'bg-green-100 text-green-700', clsDark: 'bg-green-500/20 text-green-400' },
};

function getCountdown(dueDate, dueTime) {
	if (!dueDate) return null;
	const now = new Date();
	const due = new Date(dueDate + 'T' + (dueTime || '23:59') + ':00');
	const diffMs = due - now;
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

	if (diffMs < 0) {
		const d = Math.abs(diffDays);
		return { text: `${d}d vencida`, color: 'text-red-500 bg-red-50', urgent: true };
	}
	if (diffDays === 0 && diffHours <= 3) return { text: `${diffHours}h`, color: 'text-red-500 bg-red-50', urgent: true };
	if (diffDays === 0) return { text: 'Hoy', color: 'text-amber-600 bg-amber-50', urgent: false };
	if (diffDays === 1) return { text: 'Manana', color: 'text-amber-600 bg-amber-50', urgent: false };
	if (diffDays <= 7) return { text: `${diffDays}d`, color: 'text-blue-600 bg-blue-50', urgent: false };
	return { text: `${diffDays}d`, color: 'text-gray-500 bg-gray-50', urgent: false };
}

function TaskItem({ task, onRemove, onToggle, onOpenDetail, onDragStart, onDragOver, onDrop }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const countdown = useMemo(() => getCountdown(task.dueDate, task.dueTime), [task.dueDate, task.dueTime]);

	const taskStatus = task.status || (task.completed ? 'done' : 'todo');
	const badge = statusBadge[taskStatus] || statusBadge.todo;

	const subtasks = task.subtasks || [];
	const subtasksDone = subtasks.filter((s) => s.done).length;
	const hasSubtasks = subtasks.length > 0;

	return (
		<div
			draggable
			onDragStart={(e) => onDragStart(e, task.id)}
			onDragOver={onDragOver}
			onDrop={(e) => onDrop(e, task.id)}
			className={`group rounded-3xl p-5 transition-all duration-200 cursor-grab active:cursor-grabbing ${
				isDark
					? 'bg-gray-700/40 hover:bg-gray-700/60 shadow-md shadow-black/5'
					: 'bg-white/80 hover:bg-white shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-300/40'
			}`}
		>
			<div className="flex items-start gap-3">
				{/* Checkbox */}
				<button
					onClick={() => onToggle(task.id)}
					className={`w-6 h-6 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200 ${
						task.completed
							? 'bg-indigo-500 border-indigo-500 animate-check'
							: isDark ? 'border-gray-500 hover:border-indigo-400 hover:scale-110' : 'border-gray-300 hover:border-indigo-500 hover:scale-110'
					}`}
				>
					{task.completed && (
						<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					)}
				</button>

				{/* Content */}
				<div
					onClick={() => onOpenDetail(task)}
					className="flex-1 min-w-0 cursor-pointer"
				>
					<div className="flex items-center gap-2 mb-0.5">
						{/* Priority dot */}
						<div className={`w-2 h-2 rounded-full shrink-0 ${priorityDots[task.priority]}`} />
						<span className={`text-sm leading-tight ${
							task.completed
								? 'line-through text-gray-400'
								: isDark ? 'text-gray-200' : 'text-gray-800'
						}`}>
							{task.text}
						</span>
					</div>

					{/* Meta row */}
					<div className="flex flex-wrap items-center gap-1.5 mt-1.5 ml-4">
						{/* Status badge */}
						<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
							isDark ? badge.clsDark : badge.cls
						}`}>
							{badge.label}
						</span>

						{countdown && !task.completed && (
							<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
								isDark ? 'bg-gray-600 ' + countdown.color.split(' ')[0] : countdown.color
							}`}>
								{countdown.text}
							</span>
						)}
						{task.category && (
							<span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
								isDark ? 'bg-gray-600 text-gray-300' : categoryColors[task.category] || categoryColors.Otro
							}`}>
								{task.category}
							</span>
						)}
						{task.tags?.slice(0, 2).map((tag) => (
							<span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full ${
								isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
							}`}>
								#{tag}
							</span>
						))}
						{task.tags?.length > 2 && (
							<span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>+{task.tags.length - 2}</span>
						)}
						{task.notes && (
							<span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>📝</span>
						)}
						{task.links?.length > 0 && (
							<span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>🔗{task.links.length}</span>
						)}
						{task.image && (
							<span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>🖼️</span>
						)}
						{task.address && (
							<span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>📍</span>
						)}
					</div>

					{/* Subtask progress bar */}
					{hasSubtasks && (
						<div className="flex items-center gap-2 mt-2 ml-4">
							<div className={`flex-1 h-1.5 rounded-full overflow-hidden max-w-[120px] ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
								<div
									className="h-full rounded-full bg-indigo-500 transition-all duration-300"
									style={{ width: `${(subtasksDone / subtasks.length) * 100}%` }}
								/>
							</div>
							<span className={`text-[10px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
								{subtasksDone}/{subtasks.length}
							</span>
						</div>
					)}
				</div>

				{/* Actions (visible on hover) */}
				<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
					<button
						onClick={() => onOpenDetail(task)}
						className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
							isDark ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
						}`}
						title="Editar"
					>
						<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
						</svg>
					</button>
					<button
						onClick={() => onRemove(task.id)}
						className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
							isDark ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
						}`}
						title="Eliminar"
					>
						<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</button>
				</div>
			</div>

			{/* Image preview */}
			{task.image && (
				<div className="mt-3 ml-8">
					<img src={task.image} alt="" className="h-14 rounded-xl opacity-80" />
				</div>
			)}
		</div>
	);
}

export default TaskItem;
