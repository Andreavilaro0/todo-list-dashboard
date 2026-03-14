import { useRef } from 'react';
import TaskItem from './TaskItem';
import ClearCompletedButton from './ClearCompletedButton';
import { useTheme } from '../context/ThemeContext';

function TaskList({ tasks, onRemove, onToggle, onOpenDetail, onClear, onReorder, completedCount }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const dragItemId = useRef(null);

	const handleDragStart = (e, id) => {
		dragItemId.current = id;
		e.dataTransfer.effectAllowed = 'move';
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	const handleDrop = (e, targetId) => {
		e.preventDefault();
		if (dragItemId.current !== null && dragItemId.current !== targetId) {
			onReorder(dragItemId.current, targetId);
		}
		dragItemId.current = null;
	};

	if (tasks.length === 0) {
		return (
			<div className={`rounded-3xl p-12 text-center ${isDark ? 'bg-gray-700/20' : 'bg-white/40'}`}>
				<div className={`text-4xl mb-3 ${isDark ? 'opacity-30' : 'opacity-20'}`}>
					<svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
				</div>
				<p className={`text-sm font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
					No se encontraron tareas
				</p>
				<p className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
					Crea una nueva tarea para empezar
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{tasks.map((task) => (
				<TaskItem
					key={task.id}
					task={task}
					onRemove={onRemove}
					onToggle={onToggle}
					onOpenDetail={onOpenDetail}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				/>
			))}
			<ClearCompletedButton count={completedCount} onClear={onClear} />
		</div>
	);
}

export default TaskList;
