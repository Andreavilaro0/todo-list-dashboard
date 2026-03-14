import { useState, useEffect, useCallback, useRef } from 'react';

const POMODORO_SECONDS = 25 * 60;

function PomodoroWidget() {
	const [secondsLeft, setSecondsLeft] = useState(POMODORO_SECONDS);
	const [isRunning, setIsRunning] = useState(false);
	const intervalRef = useRef(null);

	useEffect(() => {
		if (isRunning && secondsLeft > 0) {
			intervalRef.current = setInterval(() => {
				setSecondsLeft((prev) => {
					if (prev <= 1) { setIsRunning(false); return 0; }
					return prev - 1;
				});
			}, 1000);
		}
		return () => clearInterval(intervalRef.current);
	}, [isRunning, secondsLeft]);

	const toggleTimer = useCallback(() => {
		if (secondsLeft === 0) { setSecondsLeft(POMODORO_SECONDS); setIsRunning(true); }
		else { setIsRunning((prev) => !prev); }
	}, [secondsLeft]);

	const resetTimer = useCallback(() => {
		setIsRunning(false);
		setSecondsLeft(POMODORO_SECONDS);
	}, []);

	const minutes = Math.floor(secondsLeft / 60);
	const seconds = secondsLeft % 60;
	const progress = ((POMODORO_SECONDS - secondsLeft) / POMODORO_SECONDS) * 100;
	const radius = 55;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (progress / 100) * circumference;

	return (
		<div className="rounded-3xl p-6 bg-gray-900 text-white min-h-[200px] flex flex-col items-center justify-between shadow-lg shadow-gray-900/30">
			<h3 className="text-base font-semibold text-gray-300 self-start">Time to focus</h3>

			<div className="relative w-32 h-32">
				<svg className="w-32 h-32 -rotate-90" viewBox="0 0 130 130">
					<circle cx="65" cy="65" r={radius} fill="none" stroke="#1f2937" strokeWidth="7" />
					<circle
						cx="65" cy="65" r={radius} fill="none"
						stroke="#f97316" strokeWidth="7" strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						className="transition-all duration-500"
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className="text-3xl font-bold tabular-nums">
						{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
					</span>
					<span className="text-[10px] text-gray-500 mt-0.5">
						{isRunning ? 'Enfocando...' : 'Pomodoro'}
					</span>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<button
					onClick={toggleTimer}
					className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors ${
						isRunning
							? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
							: 'bg-orange-500 text-white hover:bg-orange-600'
					}`}
				>
					{secondsLeft === 0 ? 'Reiniciar' : isRunning ? 'Pausar' : 'Iniciar'}
				</button>
				{(isRunning || secondsLeft < POMODORO_SECONDS) && secondsLeft > 0 && (
					<button onClick={resetTimer} className="px-4 py-2 rounded-full text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600">
						Reset
					</button>
				)}
			</div>
		</div>
	);
}

export default PomodoroWidget;
