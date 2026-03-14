import { useState, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useTheme } from '../context/ThemeContext';

function QuickNotesWidget() {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const [notes, setNotes] = useLocalStorage('quickNotes', '');
	const [isFocused, setIsFocused] = useState(false);
	const textareaRef = useRef(null);

	return (
		<div className={`rounded-3xl p-6 h-full flex flex-col transition-all duration-300 ${
			isDark
				? 'bg-gray-700/40 shadow-lg shadow-black/10'
				: 'bg-gradient-to-br from-yellow-50 to-amber-50 shadow-lg shadow-amber-200/30'
		} ${isFocused ? (isDark ? 'ring-2 ring-indigo-500/30' : 'ring-2 ring-amber-300/50') : ''}`}>
			<div className="flex items-center justify-between mb-3">
				<h3 className={`text-base font-semibold ${isDark ? 'text-gray-200' : 'text-amber-900'}`}>
					Notas rapidas
				</h3>
				{notes && (
					<span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? 'text-gray-500 bg-gray-600/50' : 'text-amber-400 bg-amber-100'}`}>
						{notes.length}
					</span>
				)}
			</div>
			<textarea
				ref={textareaRef}
				value={notes}
				onChange={(e) => setNotes(e.target.value)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				placeholder="Ideas, recordatorios, lo que sea..."
				className={`flex-1 bg-transparent resize-none text-sm focus:outline-none leading-relaxed min-h-[140px] ${
					isDark
						? 'text-gray-300 placeholder-gray-500'
						: 'text-amber-900 placeholder-amber-300'
				}`}
			/>
		</div>
	);
}

export default QuickNotesWidget;
