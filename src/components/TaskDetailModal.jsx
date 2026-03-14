import { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { exportToICS } from '../utils/calendar';
import TagInput from './TagInput';
import ShareButton from './ShareButton';
import MapWidget from './MapWidget';

const BASE_CATEGORIES = ['Personal', 'Trabajo', 'Estudio', 'Otro'];

const STATUS_OPTIONS = [
	{ key: 'todo', label: 'To do', cls: 'bg-gray-200 text-gray-700', clsActive: 'bg-gray-700 text-white', clsDark: 'bg-gray-600 text-gray-300', clsDarkActive: 'bg-gray-300 text-gray-900' },
	{ key: 'progress', label: 'In progress', cls: 'bg-amber-100 text-amber-700', clsActive: 'bg-amber-500 text-white', clsDark: 'bg-amber-500/20 text-amber-400', clsDarkActive: 'bg-amber-500 text-white' },
	{ key: 'done', label: 'Done', cls: 'bg-green-100 text-green-700', clsActive: 'bg-green-500 text-white', clsDark: 'bg-green-500/20 text-green-400', clsDarkActive: 'bg-green-500 text-white' },
];

function TaskDetailModal({ task, onSave, onClose, onUpdateStatus, onAddSubtask, onToggleSubtask, onRemoveSubtask, categories = BASE_CATEGORIES }) {
	const { theme } = useTheme();
	const modalRef = useRef(null);
	const titleRef = useRef(null);

	const [form, setForm] = useState({
		text: task?.text || '',
		notes: task?.notes || '',
		priority: task?.priority || 'media',
		category: task?.category || 'Personal',
		dueDate: task?.dueDate || '',
		dueTime: task?.dueTime || '',
		reminder: task?.reminder || '',
		address: task?.address || '',
		links: task?.links || [],
		tags: task?.tags || [],
		image: task?.image || null,
		status: task?.status || (task?.completed ? 'done' : 'todo'),
		subtasks: task?.subtasks || [],
	});

	const [linkInput, setLinkInput] = useState('');
	const [subtaskInput, setSubtaskInput] = useState('');
	const [imagePreview, setImagePreview] = useState(task?.image || null);
	const fileRef = useRef(null);

	// Enfocar titulo al abrir
	useEffect(() => {
		if (titleRef.current) titleRef.current.focus();
	}, []);

	// Cerrar con Escape
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, [onClose]);

	// Cerrar al hacer clic fuera del modal
	const handleBackdropClick = (e) => {
		if (e.target === modalRef.current) onClose();
	};

	const updateField = useCallback((field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	}, []);

	// Status change
	const handleStatusChange = useCallback((newStatus) => {
		updateField('status', newStatus);
	}, [updateField]);

	// Subtask handlers
	const handleAddSubtask = useCallback(() => {
		const text = subtaskInput.trim();
		if (!text) return;
		setForm((prev) => ({
			...prev,
			subtasks: [...prev.subtasks, { id: Date.now(), text, done: false }],
		}));
		setSubtaskInput('');
	}, [subtaskInput]);

	const handleToggleSubtask = useCallback((subtaskId) => {
		setForm((prev) => ({
			...prev,
			subtasks: prev.subtasks.map((s) =>
				s.id === subtaskId ? { ...s, done: !s.done } : s
			),
		}));
	}, []);

	const handleRemoveSubtask = useCallback((subtaskId) => {
		setForm((prev) => ({
			...prev,
			subtasks: prev.subtasks.filter((s) => s.id !== subtaskId),
		}));
	}, []);

	// Imagen
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				const MAX = 400;
				let w = img.width, h = img.height;
				if (w > MAX || h > MAX) {
					if (w > h) { h = (h / w) * MAX; w = MAX; }
					else { w = (w / h) * MAX; h = MAX; }
				}
				canvas.width = w;
				canvas.height = h;
				canvas.getContext('2d').drawImage(img, 0, 0, w, h);
				const compressed = canvas.toDataURL('image/jpeg', 0.7);
				updateField('image', compressed);
				setImagePreview(compressed);
			};
			img.src = event.target.result;
		};
		reader.readAsDataURL(file);
	};

	const removeImage = () => {
		updateField('image', null);
		setImagePreview(null);
		if (fileRef.current) fileRef.current.value = '';
	};

	// Links
	const addLink = () => {
		const trimmed = linkInput.trim();
		if (trimmed && !form.links.includes(trimmed)) {
			updateField('links', [...form.links, trimmed]);
		}
		setLinkInput('');
	};

	const removeLink = (link) => {
		updateField('links', form.links.filter((l) => l !== link));
	};

	// Guardar
	const handleSave = () => {
		if (!form.text.trim()) return;
		const completed = form.status === 'done';
		onSave({
			...task,
			...form,
			text: form.text.trim(),
			id: task?.id || Date.now(),
			completed,
			createdAt: task?.createdAt || new Date().toISOString().split('T')[0],
		});
		onClose();
	};

	// Exportar a calendario
	const handleExportCalendar = () => {
		exportToICS({ ...task, ...form, id: task?.id || Date.now() });
	};

	const isDark = theme === 'dark';
	const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
	const inputClass = `w-full px-3 py-2.5 text-sm border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors ${
		isDark ? 'bg-gray-700/60 text-white placeholder-gray-500' : 'bg-gray-50 text-gray-800 placeholder-gray-400'
	}`;
	const labelClass = `block text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`;

	return (
		<div
			ref={modalRef}
			onClick={handleBackdropClick}
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-fade-in"
		>
			<div className={`${cardBg} rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-in`}>
				{/* Header */}
				<div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
					<h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
						{task?.id ? 'Editar tarea' : 'Nueva tarea'}
					</h2>
					<button onClick={onClose} className={`text-2xl leading-none ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-800'}`}>
						&times;
					</button>
				</div>

				<div className="p-5 space-y-4">
					{/* Titulo */}
					<div>
						<label className={labelClass}>Titulo *</label>
						<input
							ref={titleRef}
							type="text"
							value={form.text}
							onChange={(e) => updateField('text', e.target.value)}
							placeholder="Nombre de la tarea"
							className={inputClass}
						/>
					</div>

					{/* Status selector */}
					<div>
						<label className={labelClass}>Estado</label>
						<div className="flex gap-2">
							{STATUS_OPTIONS.map((opt) => (
								<button
									key={opt.key}
									onClick={() => handleStatusChange(opt.key)}
									className={`flex-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
										form.status === opt.key
											? isDark ? opt.clsDarkActive : opt.clsActive
											: isDark ? opt.clsDark : opt.cls
									}`}
								>
									{opt.label}
								</button>
							))}
						</div>
					</div>

					{/* Notas */}
					<div>
						<label className={labelClass}>Notas</label>
						<textarea
							value={form.notes}
							onChange={(e) => updateField('notes', e.target.value)}
							placeholder="Anade notas, detalles, instrucciones..."
							rows={3}
							className={inputClass + ' resize-none'}
						/>
					</div>

					{/* Subtasks */}
					<div>
						<label className={labelClass}>Subtareas</label>
						<div className="flex gap-2 mb-2">
							<input
								type="text"
								value={subtaskInput}
								onChange={(e) => setSubtaskInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
								placeholder="Anadir subtarea..."
								className={inputClass}
							/>
							<button
								onClick={handleAddSubtask}
								disabled={!subtaskInput.trim()}
								className="px-3 py-2 text-xs bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
							>
								+
							</button>
						</div>
						{form.subtasks.length > 0 && (
							<div className="space-y-1">
								{form.subtasks.map((sub) => (
									<div
										key={sub.id}
										className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
											isDark ? 'bg-gray-700/40' : 'bg-gray-50'
										}`}
									>
										<button
											onClick={() => handleToggleSubtask(sub.id)}
											className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all ${
												sub.done
													? 'bg-green-500 border-green-500'
													: isDark ? 'border-gray-500' : 'border-gray-300'
											}`}
										>
											{sub.done && (
												<svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
													<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
												</svg>
											)}
										</button>
										<span className={`flex-1 text-sm ${
											sub.done
												? 'line-through text-gray-400'
												: isDark ? 'text-gray-200' : 'text-gray-700'
										}`}>
											{sub.text}
										</span>
										<button
											onClick={() => handleRemoveSubtask(sub.id)}
											className="text-red-400 hover:text-red-600 text-sm font-bold shrink-0"
										>
											&times;
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Prioridad y Categoria */}
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className={labelClass}>Prioridad</label>
							<div className="flex gap-1.5">
								{['baja', 'media', 'alta'].map((p) => (
									<button
										key={p}
										onClick={() => updateField('priority', p)}
										className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
											form.priority === p
												? 'bg-indigo-600 text-white'
												: isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
										}`}
									>
										{p.charAt(0).toUpperCase() + p.slice(1)}
									</button>
								))}
							</div>
						</div>
						<div>
							<label className={labelClass}>Categoria</label>
							<select
								value={form.category}
								onChange={(e) => updateField('category', e.target.value)}
								className={inputClass}
							>
								{categories.map((c) => (
									<option key={c} value={c}>{c}</option>
								))}
							</select>
						</div>
					</div>

					{/* Fecha y Hora */}
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className={labelClass}>Fecha limite</label>
							<input
								type="date"
								value={form.dueDate}
								onChange={(e) => updateField('dueDate', e.target.value)}
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>Horario</label>
							<input
								type="time"
								value={form.dueTime}
								onChange={(e) => updateField('dueTime', e.target.value)}
								className={inputClass}
							/>
						</div>
					</div>

					{/* Recordatorio */}
					<div>
						<label className={labelClass}>Recordatorio</label>
						<input
							type="datetime-local"
							value={form.reminder}
							onChange={(e) => updateField('reminder', e.target.value)}
							className={inputClass}
						/>
					</div>

					{/* Direccion */}
					<div>
						<label className={labelClass}>Direccion / Ubicacion</label>
						<input
							type="text"
							value={form.address}
							onChange={(e) => updateField('address', e.target.value)}
							placeholder="Ej: Calle Principal 123, Ciudad"
							className={inputClass}
						/>
					</div>

					{/* Links */}
					<div>
						<label className={labelClass}>Links</label>
						{form.links.length > 0 && (
							<div className="space-y-1 mb-2">
								{form.links.map((link) => (
									<div key={link} className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
										<a
											href={link}
											target="_blank"
											rel="noopener noreferrer"
											className="flex-1 text-indigo-500 hover:underline truncate"
										>
											{link}
										</a>
										<button onClick={() => removeLink(link)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
									</div>
								))}
							</div>
						)}
						<div className="flex gap-2">
							<input
								type="url"
								value={linkInput}
								onChange={(e) => setLinkInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
								placeholder="https://..."
								className={inputClass}
							/>
							<button
								onClick={addLink}
								disabled={!linkInput.trim()}
								className="px-3 py-2 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
							>
								+
							</button>
						</div>
					</div>

					{/* Tags */}
					<div>
						<label className={labelClass}>Tags</label>
						<TagInput tags={form.tags} onChange={(tags) => updateField('tags', tags)} />
					</div>

					{/* Mapa (si hay direccion) */}
					{form.address && (
						<div>
							<label className={labelClass}>Mapa</label>
							<MapWidget address={form.address} />
						</div>
					)}

					{/* Imagen */}
					<div>
						<label className={labelClass}>Imagen</label>
						{imagePreview ? (
							<div className="relative inline-block">
								<img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg border border-gray-300" />
								<button
									onClick={removeImage}
									className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600"
								>
									&times;
								</button>
							</div>
						) : (
							<button
								onClick={() => fileRef.current.click()}
								className={`w-full py-3 border-2 border-dashed rounded-lg text-sm transition-colors ${
									isDark ? 'border-gray-600 text-gray-500 hover:border-gray-500' : 'border-gray-300 text-gray-400 hover:border-gray-400'
								}`}
							>
								Haz clic para subir una imagen
							</button>
						)}
						<input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
					</div>
				</div>

				{/* Footer */}
				<div className={`flex items-center justify-between p-5 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
					<div className="flex items-center gap-2">
						<button
							onClick={handleExportCalendar}
							className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium transition-colors ${
								isDark ? 'bg-gray-600/50 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
							}`}
						>
							<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							Calendario
						</button>
						{task?.id && <ShareButton task={{ ...task, ...form }} />}
					</div>
					<div className="flex gap-2">
						<button
							onClick={onClose}
							className={`px-4 py-2 text-sm rounded-xl transition-colors ${
								isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							Cancelar
						</button>
						<button
							onClick={handleSave}
							disabled={!form.text.trim()}
							className="px-6 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
						>
							Guardar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TaskDetailModal;
