import { useTheme } from '../context/ThemeContext';

function MapWidget({ address }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	if (!address) return null;

	const encoded = encodeURIComponent(address);

	return (
		<div className={`rounded-2xl overflow-hidden transition-colors ${
			isDark ? 'bg-gray-700/40' : 'bg-gray-50'
		}`}>
			<iframe
				title="Mapa"
				width="100%"
				height="160"
				src={`https://maps.google.com/maps?q=${encoded}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
				className="border-none"
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
			/>
			<div className="px-4 py-3 flex items-center justify-between">
				<div className="flex items-center gap-2 min-w-0">
					<span className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
						{address}
					</span>
				</div>
				<a
					href={`https://maps.google.com/?q=${encoded}`}
					target="_blank"
					rel="noopener noreferrer"
					className="text-[11px] text-indigo-500 hover:text-indigo-600 font-medium shrink-0 ml-2"
				>
					Abrir mapa
				</a>
			</div>
		</div>
	);
}

export default MapWidget;
