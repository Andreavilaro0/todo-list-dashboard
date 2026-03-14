import { useEffect } from 'react';

function UndoToast({ task, onUndo, onDismiss }) {
	useEffect(() => {
		const timer = setTimeout(onDismiss, 5000);
		return () => clearTimeout(timer);
	}, [onDismiss]);

	return (
		<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
			<div className="bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 backdrop-blur-xl">
				<span className="text-sm">Tarea eliminada: <strong className="text-indigo-300">{task.text}</strong></span>
				<button
					onClick={onUndo}
					className="px-4 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-400 rounded-xl font-semibold transition-colors"
				>
					Deshacer
				</button>
				<button onClick={onDismiss} className="text-gray-500 hover:text-white text-lg leading-none transition-colors">&times;</button>
			</div>
		</div>
	);
}

export default UndoToast;
