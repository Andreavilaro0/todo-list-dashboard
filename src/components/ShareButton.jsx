import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * ShareButton: Genera un link para compartir una tarea.
 * Codifica los datos de la tarea en un hash URL que se puede enviar.
 */
function ShareButton({ task }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';
	const [copied, setCopied] = useState(false);

	const generateShareLink = () => {
		const shareData = {
			t: task.text,
			n: task.notes || '',
			p: task.priority,
			c: task.category,
			d: task.dueDate || '',
			h: task.dueTime || '',
			a: task.address || '',
			l: task.links || [],
			tg: task.tags || [],
		};
		const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
		return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
	};

	const handleShare = async () => {
		const link = generateShareLink();

		// Intentar usar Web Share API primero
		if (navigator.share) {
			try {
				await navigator.share({
					title: task.text,
					text: `Tarea: ${task.text}${task.dueDate ? ` - Vence: ${task.dueDate}` : ''}`,
					url: link,
				});
				return;
			} catch {
				// Si el usuario cancela, caer al clipboard
			}
		}

		// Fallback: copiar al clipboard
		try {
			await navigator.clipboard.writeText(link);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback para navegadores sin clipboard API
			const input = document.createElement('input');
			input.value = link;
			document.body.appendChild(input);
			input.select();
			document.execCommand('copy');
			document.body.removeChild(input);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<button
			onClick={handleShare}
			className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium transition-all duration-200 ${
				copied
					? 'bg-green-100 text-green-700'
					: isDark
						? 'bg-gray-600/50 text-gray-300 hover:bg-gray-600'
						: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
			}`}
		>
			{copied ? (
				<>
					<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
					</svg>
					Link copiado
				</>
			) : (
				<>
					<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
					</svg>
					Compartir
				</>
			)}
		</button>
	);
}

export default ShareButton;
