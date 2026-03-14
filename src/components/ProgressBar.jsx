import { useTheme } from '../context/ThemeContext';

function ProgressBar({ total, completed }) {
	const { theme } = useTheme();
	const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
	const pending = total - completed;

	return (
		<div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white min-h-[200px] flex items-center gap-8 shadow-lg shadow-indigo-500/20">
			{/* Left: big number */}
			<div className="shrink-0">
				<div className={`text-6xl font-bold leading-none ${percentage === 100 ? 'text-green-300' : 'text-white'}`}>
					{percentage}%
				</div>
				<p className="text-sm text-white/50 mt-2">completado</p>
			</div>

			{/* Right: details + bar */}
			<div className="flex-1">
				<h3 className="text-base font-semibold text-white/90 mb-1">Progreso del dia</h3>
				<div className="flex gap-4 text-xs text-white/50 mb-4">
					<span><strong className="text-white">{completed}</strong> hechas</span>
					<span><strong className="text-white">{pending}</strong> pendientes</span>
					<span><strong className="text-white">{total}</strong> total</span>
				</div>
				<div className="w-full h-3 rounded-full overflow-hidden bg-white/20">
					<div
						className={`h-full rounded-full transition-all duration-700 ease-out ${
							percentage === 100 ? 'bg-green-300' : 'bg-white'
						}`}
						style={{ width: `${percentage}%` }}
					/>
				</div>
			</div>
		</div>
	);
}

export default ProgressBar;
