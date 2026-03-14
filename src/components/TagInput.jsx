import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function TagInput({ tags = [], onChange }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const [input, setInput] = useState('');

	const addTag = () => {
		const trimmed = input.trim().toLowerCase();
		if (trimmed && !tags.includes(trimmed)) {
			onChange([...tags, trimmed]);
		}
		setInput('');
	};

	const removeTag = (tag) => {
		onChange(tags.filter((t) => t !== tag));
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag();
		}
		if (e.key === 'Backspace' && !input && tags.length > 0) {
			removeTag(tags[tags.length - 1]);
		}
	};

	return (
		<div>
			{tags.length > 0 && (
				<div className="flex flex-wrap gap-1.5 mb-2">
					{tags.map((tag) => (
						<span
							key={tag}
							className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
								isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
							}`}
						>
							#{tag}
							<button
								onClick={() => removeTag(tag)}
								className="hover:text-red-500 font-bold leading-none transition-colors"
							>
								&times;
							</button>
						</span>
					))}
				</div>
			)}
			<div className="flex gap-2">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Agregar tag..."
					className={`flex-1 px-3 py-2 text-sm border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
						isDark ? 'bg-gray-700/60 text-white placeholder-gray-500' : 'bg-gray-50 text-gray-800 placeholder-gray-400'
					}`}
				/>
				<button
					onClick={addTag}
					disabled={!input.trim()}
					className="px-3 py-2 text-xs bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					+
				</button>
			</div>
		</div>
	);
}

export default TagInput;
