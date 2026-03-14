/**
 * Genera un archivo .ics para exportar una tarea a cualquier calendario.
 * Compatible con Google Calendar, Apple Calendar, Outlook, etc.
 */
export function exportToICS(task) {
	try {
		const now = new Date();
		const formatDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

		let dtStart, dtEnd;
		if (task.dueDate) {
			const base = new Date(task.dueDate + 'T00:00:00');
			if (task.dueTime) {
				const [h, m] = task.dueTime.split(':');
				base.setHours(parseInt(h), parseInt(m));
				dtStart = formatDate(base);
				const end = new Date(base.getTime() + 60 * 60 * 1000);
				dtEnd = formatDate(end);
			} else {
				dtStart = task.dueDate.replace(/-/g, '');
				const nextDay = new Date(base.getTime() + 24 * 60 * 60 * 1000);
				dtEnd = nextDay.toISOString().split('T')[0].replace(/-/g, '');
			}
		} else {
			dtStart = formatDate(now);
			const end = new Date(now.getTime() + 60 * 60 * 1000);
			dtEnd = formatDate(end);
		}

		const description = [
			task.notes ?? '',
			task.address ? `Dirección: ${task.address}` : '',
			task.links?.length ? `Links: ${task.links.join(', ')}` : '',
			task.tags?.length ? `Tags: ${task.tags.join(', ')}` : '',
			`Prioridad: ${task.priority ?? 'media'}`,
			task.category ? `Categoría: ${task.category}` : '',
		]
			.filter(Boolean)
			.join('\\n');

		const isAllDay = !task.dueTime;

		const lines = [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'PRODID:-//MiListaDeTareas//ES',
			'BEGIN:VEVENT',
			`UID:${task.id}@milistatareas`,
			`DTSTAMP:${formatDate(now)}`,
			isAllDay ? `DTSTART;VALUE=DATE:${dtStart}` : `DTSTART:${dtStart}`,
			isAllDay ? `DTEND;VALUE=DATE:${dtEnd}` : `DTEND:${dtEnd}`,
			`SUMMARY:${task.text}`,
			`DESCRIPTION:${description}`,
			task.address ? `LOCATION:${task.address}` : '',
			task.reminder ? `BEGIN:VALARM\nTRIGGER:-PT15M\nACTION:DISPLAY\nDESCRIPTION:Recordatorio\nEND:VALARM` : '',
			'END:VEVENT',
			'END:VCALENDAR',
		]
			.filter(Boolean)
			.join('\r\n');

		const blob = new Blob([lines], { type: 'text/calendar;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${task.text.slice(0, 30).replace(/[^a-zA-Z0-9áéíóúñ ]/g, '')}.ics`;
		a.click();
		URL.revokeObjectURL(url);
	} catch {
		// silently handle export errors
	}
}
