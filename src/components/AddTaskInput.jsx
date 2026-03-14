import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

function AddTaskInput({ onAdd, onOpenNew }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const [input, setInput] = useState('');
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current.focus();
	}, []);

	const handleQuickAdd = () => {
		if (input.trim()) {
			onAdd(input.trim());
			setInput('');
			inputRef.current.focus();
		}
	};

	return (
		<div className={`rounded-3xl p-5 transition-colors ${isDark ? 'bg-gray-700/40 shadow-lg shadow-black/10' : 'bg-white/80 shadow-lg shadow-gray-300/20'}`}>
			<div className="flex items-center gap-3">
				<div className={`w-5 h-5 rounded-full border-2 shrink-0 ${isDark ? 'border-gray-500' : 'border-gray-300'}`} />
				<input
					ref={inputRef}
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
					placeholder="Añadir nueva tarea..."
					className={`flex-1 bg-transparent text-sm focus:outline-none ${
						isDark ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
					}`}
				/>
				<button
					onClick={onOpenNew}
					className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
						isDark
							? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
							: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
					}`}
				>
					+ Detalle
				</button>
			</div>
		</div>
	);
}

export default AddTaskInput;
