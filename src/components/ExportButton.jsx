import { useTheme } from '../context/ThemeContext';

function ExportButton({ tasks }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	const exportJSON = () => {
		const data = JSON.stringify(tasks, null, 2);
		downloadFile(data, 'tareas.json', 'application/json');
	};

	const exportTXT = () => {
		const lines = tasks.map((t) => {
			const status = t.completed ? '[x]' : '[ ]';
			const priority = `(${t.priority})`;
			const category = t.category ? `[${t.category}]` : '';
			const due = t.dueDate ? `- Vence: ${t.dueDate}${t.dueTime ? ' ' + t.dueTime : ''}` : '';
			const tags = t.tags?.length ? `[${t.tags.map((tag) => '#' + tag).join(' ')}]` : '';
			const notes = t.notes ? `\n   Notas: ${t.notes}` : '';
			const address = t.address ? `\n   Lugar: ${t.address}` : '';
			const links = t.links?.length ? `\n   Links: ${t.links.join(', ')}` : '';
			return `${status} ${priority} ${category} ${tags} ${t.text} ${due}${notes}${address}${links}`.trim();
		});
		downloadFile(lines.join('\n\n'), 'tareas.txt', 'text/plain');
	};

	const downloadFile = (content, filename, type) => {
		const blob = new Blob([content], { type });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	};

	const btnClass = `text-xs px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
		isDark
			? 'bg-gray-600/50 text-gray-300 hover:bg-gray-600'
			: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
	}`;

	return (
		<div className="flex gap-2 items-center">
			<button onClick={exportJSON} className={btnClass}>Exportar JSON</button>
			<button onClick={exportTXT} className={btnClass}>Exportar TXT</button>
		</div>
	);
}

export default ExportButton;
