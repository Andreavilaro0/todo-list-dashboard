import { useCallback, useMemo, useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import useDebounce from './hooks/useDebounce';
import { useTheme } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import TaskList from './components/TaskList';
import AddTaskInput from './components/AddTaskInput';
import StatusBar from './components/StatusBar';
import ResetAppButton from './components/ResetAppButton';
import SearchBar from './components/SearchBar';
import ProgressBar from './components/ProgressBar';
import SortSelector from './components/SortSelector';
import StatsPanel from './components/StatsPanel';
import UndoToast from './components/UndoToast';
import ExportButton from './components/ExportButton';
import TaskDetailModal from './components/TaskDetailModal';
import UpcomingWidget from './components/UpcomingWidget';
import ActivityWidget from './components/ActivityWidget';
import PomodoroWidget from './components/PomodoroWidget';
import TodayWidget from './components/TodayWidget';
import QuickNotesWidget from './components/QuickNotesWidget';
import StreakWidget from './components/StreakWidget';
import TaskMapWidget from './components/TaskMapWidget';

const priorityOrder = { alta: 1, media: 2, baja: 3 };

const TODAY = new Date().toISOString().split('T')[0];

// Colores de fondo por pestaña (light mode)
const TAB_COLORS = {
	Todas: { bg: '#e8e4ee', color: null },
	Personal: { bg: '#ede4ee', color: '#a855f7' },
	Trabajo: { bg: '#e4e8ee', color: '#3b82f6' },
	Estudio: { bg: '#e4eee8', color: '#14b8a6' },
	Otro: { bg: '#eee8e4', color: '#f59e0b' },
};
const DEFAULT_TAB_BG = '#e8e4ee';

const DEFAULT_TABS = [
	{ name: 'Todas', custom: false },
	{ name: 'Personal', custom: false },
	{ name: 'Trabajo', custom: false },
	{ name: 'Estudio', custom: false },
	{ name: 'Otro', custom: false },
];

// Colores para pestañas custom (se asignan rotativamente)
const CUSTOM_TAB_PALETTE = [
	{ bg: '#eee4e8', color: '#ec4899' },
	{ bg: '#e4eeec', color: '#06b6d4' },
	{ bg: '#eeeae4', color: '#f97316' },
	{ bg: '#e8e4ee', color: '#8b5cf6' },
	{ bg: '#e4eae4', color: '#22c55e' },
	{ bg: '#eee4e4', color: '#ef4444' },
];

const T = (daysOffset) => {
	const d = new Date();
	d.setDate(d.getDate() + daysOffset);
	return d.toISOString().split('T')[0];
};

const DEFAULT_TASKS = [
	{
		id: 1, text: 'Aprender fundamentos de React',
		notes: 'Revisar todos los hooks del curso: useState para estado local, useEffect para side effects y cleanup, useRef para acceso al DOM, useMemo para optimizacion, useCallback para funciones memorizadas. Hacer los ejercicios del modulo 6 antes del examen.',
		completed: false, priority: 'alta', category: 'Estudio',
		dueDate: TODAY, dueTime: '14:00', reminder: '',
		address: 'UDIT Campus, Calle Guzmán el Bueno 10, Madrid', links: ['https://react.dev/learn'], tags: ['react', 'frontend', 'hooks'],
		image: null, createdAt: T(-4),
		status: 'progress',
		subtasks: [
			{ id: 101, text: 'useState y useEffect', done: true },
			{ id: 102, text: 'useRef y useMemo', done: true },
			{ id: 103, text: 'useCallback', done: false },
			{ id: 104, text: 'useContext', done: false },
			{ id: 105, text: 'Custom hooks', done: false },
		],
	},
	{
		id: 2, text: 'Entregar proyecto de tareas',
		notes: 'Sprint 6 de Frontend I: implementar hooks avanzados (useState, useEffect, useRef, useMemo, useCallback, useContext). El proyecto debe incluir dashboard con widgets, filtros avanzados, persistencia con localStorage y despliegue en produccion.',
		completed: false, priority: 'alta', category: 'Estudio',
		dueDate: T(6), dueTime: '23:59', reminder: '',
		address: 'UDIT Campus, Calle Guzmán el Bueno 10, Madrid', links: ['https://github.com/andreaavila/todo-list'], tags: ['proyecto', 'sprint6', 'react'],
		image: null, createdAt: T(-2),
		status: 'progress',
		subtasks: [
			{ id: 201, text: 'Implementar useLocalStorage', done: true },
			{ id: 202, text: 'Crear componentes base', done: true },
			{ id: 203, text: 'Dashboard de widgets', done: true },
			{ id: 204, text: 'Filtros y ordenacion', done: true },
			{ id: 205, text: 'Desplegar en Vercel', done: false },
			{ id: 206, text: 'Documentar el proyecto', done: false },
		],
	},
	{
		id: 3, text: 'Reunion con equipo de marketing',
		notes: 'Presentar la propuesta de rediseno del sitio web corporativo. Incluir mockups en Figma, metricas de la web actual y plan de migracion. Llevar laptop con el prototipo funcionando.',
		completed: false, priority: 'alta', category: 'Trabajo',
		dueDate: TODAY, dueTime: '10:30', reminder: '',
		address: 'WeWork Paseo de la Castellana 77, Madrid', links: ['https://meet.google.com/abc-defg-hij'], tags: ['reunion', 'marketing', 'presentacion'],
		image: null, createdAt: T(-1),
		status: 'todo',
		subtasks: [
			{ id: 301, text: 'Preparar slides de la propuesta', done: true },
			{ id: 302, text: 'Revisar metricas de Google Analytics', done: false },
			{ id: 303, text: 'Imprimir handout para el equipo', done: false },
		],
	},
	{
		id: 4, text: 'Disenar wireframes del landing page',
		notes: 'Rediseño completo del landing page de producto. Usar Figma con Auto Layout. Incluir versiones responsive: desktop (1440px), tablet (768px) y mobile (375px). Seguir el sistema de diseno establecido.',
		completed: false, priority: 'media', category: 'Trabajo',
		dueDate: T(3), dueTime: '18:00', reminder: '',
		address: 'Cafe Federal, Plaza Comendadoras 9, Madrid', links: ['https://figma.com'], tags: ['diseno', 'wireframes', 'UI', 'figma'],
		image: null, createdAt: T(-3),
		status: 'progress',
		subtasks: [
			{ id: 401, text: 'Hero section con CTA', done: true },
			{ id: 402, text: 'Features section (3 columnas)', done: true },
			{ id: 403, text: 'Pricing section con toggle mensual/anual', done: false },
			{ id: 404, text: 'Footer con newsletter', done: false },
			{ id: 405, text: 'Version mobile completa', done: false },
		],
	},
	{
		id: 5, text: 'Ir al gimnasio - dia de pierna',
		notes: 'Rutina: sentadillas 4x8, prensa 3x12, peso muerto rumano 3x10, extensiones 3x15, curl femoral 3x12. Terminar con 20min de cinta inclinada para cardio.',
		completed: true, priority: 'media', category: 'Personal',
		dueDate: TODAY, dueTime: '07:00', reminder: '',
		address: 'Basic Fit Moncloa, Calle Princesa 25, Madrid', links: [], tags: ['salud', 'gym', 'pierna'],
		image: null, createdAt: TODAY,
		status: 'done', subtasks: [],
	},
	{
		id: 6, text: 'Comprar ingredientes para pasta al pesto',
		notes: 'Lista de compra: pasta penne rigate, albahaca fresca, pinones, parmesano reggiano, ajo, aceite de oliva virgen extra, tomates cherry, mozzarella di bufala. Presupuesto: ~15 EUR.',
		completed: true, priority: 'baja', category: 'Personal',
		dueDate: TODAY, dueTime: '19:00', reminder: '',
		address: 'Mercadona, Gran Via 32, Madrid', links: [], tags: ['compras', 'cocina'],
		image: null, createdAt: TODAY,
		status: 'done', subtasks: [],
	},
	{
		id: 7, text: 'Estudiar para examen de bases de datos',
		notes: 'Temas del parcial: normalizacion (1NF, 2NF, 3NF, BCNF), SQL avanzado (JOINs, subqueries, window functions), transacciones (ACID), indices (B-tree, hash), diseno de esquemas ER. El examen es presencial, sin apuntes.',
		completed: false, priority: 'alta', category: 'Estudio',
		dueDate: T(5), dueTime: '09:00', reminder: '',
		address: 'Biblioteca UDIT, Planta 2, Sala de estudio', links: ['https://sqlzoo.net'], tags: ['examen', 'SQL', 'bases-datos'],
		image: null, createdAt: T(-4),
		status: 'todo',
		subtasks: [
			{ id: 701, text: 'Repasar normalizacion y formas normales', done: true },
			{ id: 702, text: 'Practicar queries SQL complejas', done: false },
			{ id: 703, text: 'Estudiar transacciones y ACID', done: false },
			{ id: 704, text: 'Hacer ejercicios del libro Cap.8', done: false },
		],
	},
	{
		id: 8, text: 'Cita con el dentista',
		notes: 'Limpieza dental semestral. Preguntar por los horarios de tarde para la proxima vez. Llegar 10 min antes para rellenar formulario.',
		completed: false, priority: 'baja', category: 'Personal',
		dueDate: T(2), dueTime: '17:30', reminder: '',
		address: 'Clinica Dental Velazquez, Calle Velazquez 54, Madrid', links: [], tags: ['salud', 'cita', 'dentista'],
		image: null, createdAt: T(-1),
		status: 'todo', subtasks: [],
	},
	{
		id: 9, text: 'Revisar pull request del backend',
		notes: 'PR #142 - Nueva API de autenticacion con JWT + refresh tokens. Revisar: validacion de inputs, rate limiting, manejo de errores, tests de integracion. Verificar que no se rompe la retrocompatibilidad.',
		completed: false, priority: 'media', category: 'Trabajo',
		dueDate: TODAY, dueTime: '16:00', reminder: '',
		address: '', links: ['https://github.com/company/api/pull/142'], tags: ['code-review', 'backend', 'PR', 'auth'],
		image: null, createdAt: TODAY,
		status: 'todo',
		subtasks: [
			{ id: 901, text: 'Revisar cambios en middleware auth', done: false },
			{ id: 902, text: 'Ejecutar tests localmente', done: false },
			{ id: 903, text: 'Verificar migracion de DB', done: false },
			{ id: 904, text: 'Dejar comentarios en el PR', done: false },
		],
	},
	{
		id: 10, text: 'Actualizar portfolio personal',
		notes: 'Agregar los ultimos 3 proyectos del semestre: todo-list app, API REST de e-commerce, y el dashboard de analiticas. Actualizar la seccion About con nuevas skills. Cambiar foto de perfil.',
		completed: false, priority: 'baja', category: 'Personal',
		dueDate: T(8), dueTime: '', reminder: '',
		address: '', links: ['https://andreaavila.dev'], tags: ['portfolio', 'web', 'personal-brand'],
		image: null, createdAt: T(-2),
		status: 'todo',
		subtasks: [
			{ id: 1001, text: 'Agregar proyecto todo-list', done: false },
			{ id: 1002, text: 'Agregar proyecto API REST', done: false },
			{ id: 1003, text: 'Actualizar foto y bio', done: false },
			{ id: 1004, text: 'Mejorar SEO y meta tags', done: false },
		],
	},
	{
		id: 11, text: 'Leer capitulo 5 del libro de JavaScript',
		notes: 'Closures en profundidad, cadena de prototipos, herencia prototipica vs clases ES6. Tomar notas en Notion. Hacer los ejercicios del final del capitulo.',
		completed: true, priority: 'media', category: 'Estudio',
		dueDate: T(-1), dueTime: '', reminder: '',
		address: 'Cafe Toma, Calle de la Palma 49, Madrid', links: [], tags: ['javascript', 'lectura', 'closures'],
		image: null, createdAt: T(-6),
		status: 'done', subtasks: [],
	},
	{
		id: 12, text: 'Enviar factura del freelance',
		notes: 'Proyecto de landing page para StartupXYZ. Desglose: diseno UI (200 EUR), desarrollo frontend (150 EUR), deploy y configuracion (100 EUR). Total: 450 EUR. Enviar a contabilidad@startupxyz.com.',
		completed: true, priority: 'alta', category: 'Trabajo',
		dueDate: T(-2), dueTime: '12:00', reminder: '',
		address: '', links: [], tags: ['factura', 'freelance', 'finanzas'],
		image: null, createdAt: T(-4),
		status: 'done', subtasks: [],
	},
	{
		id: 13, text: 'Configurar ESLint y Prettier para el equipo',
		notes: 'Crear configuracion compartida con eslint-config-custom. Incluir reglas para React, hooks, imports ordenados, y prettier integrado. Publicar como paquete npm interno.',
		completed: true, priority: 'media', category: 'Trabajo',
		dueDate: T(-3), dueTime: '', reminder: '',
		address: 'WeWork Paseo de la Castellana 77, Madrid', links: [], tags: ['tooling', 'config', 'DX'],
		image: null, createdAt: T(-5),
		status: 'done', subtasks: [],
	},
	{
		id: 14, text: 'Presentacion de UX Research',
		notes: 'Resultados de 8 entrevistas con usuarios del dashboard. Hallazgos clave: la navegacion lateral confunde, los filtros no son descubribles, el 60% quiere dark mode. 12 slides + recording de Loom.',
		completed: true, priority: 'alta', category: 'Estudio',
		dueDate: T(-4), dueTime: '11:00', reminder: '',
		address: 'UDIT Campus, Aula 204, Madrid', links: [], tags: ['UX', 'research', 'presentacion'],
		image: null, createdAt: T(-7),
		status: 'done',
		subtasks: [
			{ id: 1401, text: 'Analizar transcripciones de entrevistas', done: true },
			{ id: 1402, text: 'Crear affinity map', done: true },
			{ id: 1403, text: 'Disenar slides', done: true },
			{ id: 1404, text: 'Ensayar presentacion (10 min)', done: true },
		],
	},
	{
		id: 15, text: 'Correr 5km en el Retiro',
		notes: 'Ruta habitual: entrada Puerta de Alcala -> lago -> Palacio de Cristal -> vuelta. Tiempo objetivo: sub-25 min. Llevar AirPods y playlist de running.',
		completed: true, priority: 'baja', category: 'Personal',
		dueDate: T(-2), dueTime: '07:30', reminder: '',
		address: 'Parque del Retiro, Puerta de Alcala, Madrid', links: [], tags: ['running', 'salud', 'cardio'],
		image: null, createdAt: T(-2),
		status: 'done', subtasks: [],
	},
	{
		id: 16, text: 'Deploy del microservicio de pagos v2.1',
		notes: 'Actualización critica: nuevo gateway de Stripe con soporte para 3D Secure 2.0. Incluye nuevos webhooks para subscription lifecycle. Hacer rollback plan antes de deployar.',
		completed: true, priority: 'alta', category: 'Trabajo',
		dueDate: T(-1), dueTime: '15:00', reminder: '',
		address: '', links: ['https://stripe.com/docs/payments/3d-secure'], tags: ['deploy', 'backend', 'stripe', 'pagos'],
		image: null, createdAt: T(-3),
		status: 'done',
		subtasks: [
			{ id: 1601, text: 'Tests de integracion con Stripe sandbox', done: true },
			{ id: 1602, text: 'Security review con el equipo', done: true },
			{ id: 1603, text: 'Deploy a staging + smoke tests', done: true },
			{ id: 1604, text: 'Deploy a produccion + monitoreo', done: true },
		],
	},
	{
		id: 17, text: 'Leer articulo sobre React Server Components',
		notes: 'Post de Dan Abramov explicando los patrones de RSC, como se diferencian de SSR tradicional, y cuando usarlos vs client components. Tomar notas para el blog.',
		completed: true, priority: 'baja', category: 'Estudio',
		dueDate: T(-3), dueTime: '', reminder: '',
		address: '', links: ['https://overreacted.io'], tags: ['react', 'RSC', 'lectura'],
		image: null, createdAt: T(-4),
		status: 'done', subtasks: [],
	},
	{
		id: 18, text: 'Organizar escritorio y setup',
		notes: 'Comprar organizador de cables (Amazon, ~12 EUR), limpiar monitor, reorganizar cajones. Montar el nuevo soporte de monitor dual que llego ayer.',
		completed: true, priority: 'baja', category: 'Personal',
		dueDate: T(-5), dueTime: '', reminder: '',
		address: '', links: [], tags: ['organizacion', 'setup'],
		image: null, createdAt: T(-6),
		status: 'done', subtasks: [],
	},
	{
		id: 19, text: 'Escribir tests unitarios para API REST',
		notes: 'Objetivo: cubrir endpoints criticos con min 80% coverage. Usar Jest + Supertest. Configurar github actions para CI automatizado en cada PR. Endpoints pendientes: /users CRUD, /products search, /orders checkout flow.',
		completed: false, priority: 'alta', category: 'Trabajo',
		dueDate: T(-1), dueTime: '18:00', reminder: '',
		address: '', links: ['https://jestjs.io/docs/getting-started'], tags: ['testing', 'jest', 'API', 'CI'],
		image: null, createdAt: T(-5),
		status: 'progress',
		subtasks: [
			{ id: 1901, text: 'Tests de /users CRUD', done: true },
			{ id: 1902, text: 'Tests de /products search + filters', done: false },
			{ id: 1903, text: 'Tests de /orders checkout', done: false },
			{ id: 1904, text: 'Configurar CI con Github Actions', done: false },
		],
	},
	{
		id: 20, text: 'Devolver libro a la biblioteca',
		notes: 'Clean Code de Robert C. Martin. El plazo vencio hace 4 dias, puede haber multa. Tambien devolver "Design Patterns" de GoF que expira la semana que viene.',
		completed: false, priority: 'media', category: 'Personal',
		dueDate: T(-4), dueTime: '', reminder: '',
		address: 'Biblioteca UDIT, Planta baja, Mostrador de prestamos', links: [], tags: ['biblioteca', 'libros'],
		image: null, createdAt: T(-9),
		status: 'todo', subtasks: [],
	},
	{
		id: 21, text: 'Preparar demo para cliente Fintech',
		notes: 'Demo del dashboard de analiticas financieras. Mostrar: graficas en tiempo real, filtros por fecha/categoria, export a PDF, dark mode. Usar datos de staging, NO produccion. Ensayar el flujo completo 2 veces antes.',
		completed: false, priority: 'alta', category: 'Trabajo',
		dueDate: T(7), dueTime: '10:00', reminder: '',
		address: 'Oficina cliente Fintech, Calle Serrano 45, Madrid', links: [], tags: ['demo', 'cliente', 'fintech'],
		image: null, createdAt: TODAY,
		status: 'todo',
		subtasks: [
			{ id: 2101, text: 'Preparar dataset de demo realista', done: false },
			{ id: 2102, text: 'Ensayar presentacion (15 min)', done: false },
			{ id: 2103, text: 'Revisar y fixear bugs criticos', done: false },
			{ id: 2104, text: 'Preparar backup offline', done: false },
		],
	},
	{
		id: 22, text: 'Clase de prueba de yoga',
		notes: 'Primera clase en el estudio nuevo. Llevar esterilla propia, toalla y botella de agua. La clase es de Vinyasa flow, nivel principiante-intermedio, 60 min.',
		completed: false, priority: 'baja', category: 'Personal',
		dueDate: T(4), dueTime: '19:00', reminder: '',
		address: 'Yoga Studio Sol, Calle del Sol 15, Madrid', links: [], tags: ['salud', 'yoga', 'bienestar'],
		image: null, createdAt: TODAY,
		status: 'todo', subtasks: [],
	},
	{
		id: 23, text: 'Examen parcial de algoritmos',
		notes: 'Temas: analisis de complejidad (Big O), algoritmos de sorting (quicksort, mergesort, heapsort), grafos (BFS, DFS, Dijkstra), programacion dinamica (knapsack, LCS). Formato: 3 problemas, 2 horas, papel.',
		completed: false, priority: 'alta', category: 'Estudio',
		dueDate: T(8), dueTime: '09:00', reminder: '',
		address: 'UDIT Campus, Aula Magna, Madrid', links: ['https://leetcode.com'], tags: ['examen', 'algoritmos', 'parcial'],
		image: null, createdAt: T(-1),
		status: 'todo',
		subtasks: [
			{ id: 2301, text: 'Repasar sorting algorithms', done: true },
			{ id: 2302, text: 'Practicar grafos BFS/DFS', done: false },
			{ id: 2303, text: 'Estudiar programacion dinamica', done: false },
			{ id: 2304, text: 'Resolver 10 problemas en LeetCode', done: false },
		],
	},
	{
		id: 24, text: 'Renovar suscripcion de Figma Pro',
		notes: 'El plan actual expira el 25. Verificar si aplica descuento educativo (50% off con email .edu). Si no, considerar el plan Team que incluye FigJam.',
		completed: false, priority: 'media', category: 'Trabajo',
		dueDate: T(11), dueTime: '', reminder: '',
		address: '', links: ['https://figma.com/pricing'], tags: ['suscripcion', 'figma', 'herramientas'],
		image: null, createdAt: TODAY,
		status: 'todo', subtasks: [],
	},
	{
		id: 25, text: 'Cena de cumpleanos de Laura',
		notes: 'Cumple 25! Reservar mesa para 8 personas. Le gustan los libros de diseno y las velas aromaticas. Presupuesto regalo: ~30 EUR. Llegar 15 min antes para decorar.',
		completed: false, priority: 'media', category: 'Personal',
		dueDate: T(9), dueTime: '21:00', reminder: '',
		address: 'Restaurante La Barraca, Calle de la Reina 29, Madrid', links: [], tags: ['social', 'cumpleanos', 'amigos'],
		image: null, createdAt: TODAY,
		status: 'todo',
		subtasks: [
			{ id: 2501, text: 'Reservar mesa (llamar)', done: false },
			{ id: 2502, text: 'Comprar regalo', done: false },
			{ id: 2503, text: 'Confirmar asistentes en el grupo', done: false },
		],
	},
	{
		id: 26, text: 'Instalar y configurar Node 22 LTS',
		completed: true, priority: 'baja', category: 'Trabajo',
		dueDate: T(-6), dueTime: '', notes: 'Actualizar nvm, instalar Node 22, verificar compatibilidad con todos los proyectos. Actualizar .nvmrc en repos.',
		reminder: '', address: '', links: [], tags: ['tooling', 'node'],
		image: null, createdAt: T(-6),
		status: 'done', subtasks: [],
	},
	{
		id: 27, text: 'Backup completo del MacBook',
		completed: true, priority: 'media', category: 'Personal',
		dueDate: T(-5), dueTime: '22:00', notes: 'Time Machine al disco externo + verificar que iCloud Drive esta sincronizado. Exportar passwords de 1Password por si acaso.',
		reminder: '', address: '', links: [], tags: ['backup', 'mac'],
		image: null, createdAt: T(-5),
		status: 'done', subtasks: [],
	},
	{
		id: 28, text: 'Tutorial avanzado de TypeScript',
		completed: true, priority: 'media', category: 'Estudio',
		dueDate: T(-4), dueTime: '', notes: 'Temas cubiertos: Generics avanzados, Mapped Types, Conditional Types, Template Literal Types, Type Guards, Utility Types (Partial, Required, Pick, Omit). 4 horas de contenido.',
		reminder: '', address: 'Starbucks Princesa, Madrid', links: ['https://typescriptlang.org'], tags: ['typescript', 'tutorial', 'avanzado'],
		image: null, createdAt: T(-6),
		status: 'done', subtasks: [],
	},
	{
		id: 29, text: 'Daily standup con el equipo',
		completed: true, priority: 'media', category: 'Trabajo',
		dueDate: TODAY, dueTime: '09:00', notes: 'Reporte diario de 15 min. Ayer: termine la integracion con Stripe. Hoy: revisar PR #142 y empezar tests. Blocker: ninguno.',
		reminder: '', address: '', links: ['https://meet.google.com/xyz-abc-def'], tags: ['standup', 'daily', 'scrum'],
		image: null, createdAt: TODAY,
		status: 'done', subtasks: [],
	},
	{
		id: 30, text: 'Sesion de meditacion matutina',
		completed: true, priority: 'baja', category: 'Personal',
		dueDate: TODAY, dueTime: '06:30', notes: 'App Headspace, programa "Focus" dia 12/30. Meditacion guiada de 10 min enfocada en concentracion y claridad mental.',
		reminder: '', address: '', links: [], tags: ['meditacion', 'salud', 'mindfulness'],
		image: null, createdAt: TODAY,
		status: 'done', subtasks: [],
	},
	{
		id: 31, text: 'Tutoría con profesor de frontend',
		notes: 'Resolver dudas sobre custom hooks y Context API. Llevar preguntas preparadas sobre el proyecto del sprint. Horario de tutoría: 12:00-13:00.',
		completed: false, priority: 'media', category: 'Estudio',
		dueDate: T(1), dueTime: '12:00', reminder: '',
		address: 'UDIT Campus, Despacho 312, Madrid', links: [], tags: ['tutoria', 'profesor', 'dudas'],
		image: null, createdAt: TODAY,
		status: 'todo', subtasks: [],
	},
	{
		id: 32, text: 'Comprar regalo para mama',
		notes: 'Su cumpleaños es el 28. Ideas: set de te japones, libro de cocina mediterranea, suscripcion a Masterclass. Presupuesto: 40-50 EUR.',
		completed: false, priority: 'media', category: 'Personal',
		dueDate: T(10), dueTime: '', reminder: '',
		address: 'El Corte Ingles, Calle Preciados 3, Madrid', links: [], tags: ['regalo', 'familia'],
		image: null, createdAt: TODAY,
		status: 'todo', subtasks: [],
	},
	{
		id: 33, text: 'Workshop de accesibilidad web',
		notes: 'Taller presencial de 3 horas sobre WCAG 2.1, screen readers, aria labels, contraste de colores y testing con axe-core. Organizado por la comunidad de frontend de Madrid.',
		completed: false, priority: 'media', category: 'Estudio',
		dueDate: T(5), dueTime: '16:00', reminder: '',
		address: 'Google for Startups Campus, Calle Moreno Nieto 2, Madrid', links: [], tags: ['a11y', 'workshop', 'WCAG'],
		image: null, createdAt: T(-1),
		status: 'todo', subtasks: [],
	},
	{
		id: 34, text: 'Brunch con el grupo de la uni',
		notes: 'Reserva para 6 personas. Pedir la mesa de la terraza si hace buen tiempo. Cada uno paga lo suyo.',
		completed: false, priority: 'baja', category: 'Personal',
		dueDate: T(3), dueTime: '12:00', reminder: '',
		address: 'Federal Cafe, Plaza Comendadoras 9, Madrid', links: [], tags: ['social', 'brunch', 'amigos'],
		image: null, createdAt: TODAY,
		status: 'todo', subtasks: [],
	},
	{
		id: 35, text: 'Code review del frontend de checkout',
		notes: 'PR #156 - Nuevo flujo de checkout con steps wizard. Verificar: validacion de formularios, manejo de errores, UX en mobile, performance del bundle.',
		completed: false, priority: 'alta', category: 'Trabajo',
		dueDate: T(1), dueTime: '14:00', reminder: '',
		address: 'WeWork Paseo de la Castellana 77, Madrid', links: ['https://github.com/company/frontend/pull/156'], tags: ['code-review', 'frontend', 'checkout'],
		image: null, createdAt: TODAY,
		status: 'todo',
		subtasks: [
			{ id: 3501, text: 'Revisar componente StepWizard', done: false },
			{ id: 3502, text: 'Testar en mobile Safari', done: false },
			{ id: 3503, text: 'Verificar bundle size', done: false },
		],
	},
];

function App() {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	const [tasks, setTasks] = useLocalStorage('tasks', DEFAULT_TASKS);
	const [tabs, setTabs] = useLocalStorage('tabs', DEFAULT_TABS);
	const [activeView, setActiveView] = useState('home');
	const [searchQuery, setSearchQuery] = useState('');
	const [filter, setFilter] = useState('todas');
	const [categoryFilter, setCategoryFilter] = useState('Todas');
	const [sortBy, setSortBy] = useState('prioridad');
	const [savedIndicator, setSavedIndicator] = useState(false);
	const [deletedTask, setDeletedTask] = useState(null);
	const [showStats, setShowStats] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [modalTask, setModalTask] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const debouncedSearch = useDebounce(searchQuery, 300);

	const filteredTasks = useMemo(() => {
		let result = tasks;
		if (filter === 'activas') result = result.filter((t) => !t.completed);
		else if (filter === 'completadas') result = result.filter((t) => t.completed);
		else if (filter === 'todo') result = result.filter((t) => (t.status || 'todo') === 'todo' && !t.completed);
		else if (filter === 'progress') result = result.filter((t) => (t.status || 'todo') === 'progress');
		else if (filter === 'done') result = result.filter((t) => (t.status || (t.completed ? 'done' : 'todo')) === 'done');
		if (categoryFilter !== 'Todas') result = result.filter((t) => t.category === categoryFilter);
		if (debouncedSearch) {
			const q = debouncedSearch.toLowerCase();
			result = result.filter((t) =>
				t.text.toLowerCase().includes(q) ||
				t.notes?.toLowerCase().includes(q) ||
				t.tags?.some((tag) => tag.includes(q)),
			);
		}
		return result.toSorted((a, b) => {
			switch (sortBy) {
				case 'prioridad': return priorityOrder[a.priority] - priorityOrder[b.priority];
				case 'fecha': return (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
				case 'vencimiento':
					if (!a.dueDate && !b.dueDate) return 0;
					if (!a.dueDate) return 1;
					if (!b.dueDate) return -1;
					return a.dueDate.localeCompare(b.dueDate);
				case 'alfabetico': return a.text.localeCompare(b.text, 'es');
				default: return 0;
			}
		});
	}, [tasks, filter, categoryFilter, debouncedSearch, sortBy]);

	const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);

	const showSaved = useCallback(() => {
		setSavedIndicator(true);
		setTimeout(() => setSavedIndicator(false), 2000);
	}, []);

	const quickAddTask = useCallback((text) => {
		const defaultCats = ['Todas', 'Personal', 'Trabajo', 'Estudio', 'Otro'];
		const assignCategory = categoryFilter !== 'Todas' ? categoryFilter : 'Personal';
		setTasks((prev) => [...prev, {
			id: Date.now(), text, notes: '', completed: false, priority: 'media',
			category: assignCategory,
			dueDate: null, dueTime: '', reminder: '', address: '',
			links: [], tags: [], image: null,
			createdAt: new Date().toISOString().split('T')[0],
			status: 'todo',
			subtasks: [],
		}]);
		showSaved();
	}, [setTasks, showSaved, categoryFilter]);

	const saveTask = useCallback((taskData) => {
		// Sync completed with status
		const synced = {
			...taskData,
			completed: taskData.status === 'done' ? true : taskData.completed,
			status: taskData.status || (taskData.completed ? 'done' : 'todo'),
		};
		setTasks((prev) => {
			const exists = prev.find((t) => t.id === synced.id);
			return exists ? prev.map((t) => (t.id === synced.id ? synced : t)) : [...prev, synced];
		});
		showSaved();
	}, [setTasks, showSaved]);

	const openNewTaskModal = useCallback(() => { setModalTask(null); setIsModalOpen(true); }, []);
	const openTaskDetail = useCallback((task) => { setModalTask(task); setIsModalOpen(true); }, []);
	const closeModal = useCallback(() => { setIsModalOpen(false); setModalTask(null); }, []);

	const removeTask = useCallback((id) => {
		const taskToDelete = tasks.find((t) => t.id === id);
		setTasks((prev) => prev.filter((t) => t.id !== id));
		if (taskToDelete) setDeletedTask(taskToDelete);
		showSaved();
	}, [tasks, setTasks, showSaved]);

	const undoDelete = useCallback(() => {
		if (deletedTask) { setTasks((prev) => [...prev, deletedTask]); setDeletedTask(null); showSaved(); }
	}, [deletedTask, setTasks, showSaved]);

	const toggleTask = useCallback((id) => {
		setTasks((prev) => prev.map((t) => {
			if (t.id !== id) return t;
			const newCompleted = !t.completed;
			return { ...t, completed: newCompleted, status: newCompleted ? 'done' : 'todo' };
		}));
		showSaved();
	}, [setTasks, showSaved]);

	// Subtask functions
	const addSubtask = useCallback((taskId, text) => {
		setTasks((prev) => prev.map((t) => {
			if (t.id !== taskId) return t;
			return { ...t, subtasks: [...(t.subtasks ?? []), { id: Date.now(), text, done: false }] };
		}));
		showSaved();
	}, [setTasks, showSaved]);

	const toggleSubtask = useCallback((taskId, subtaskId) => {
		setTasks((prev) => prev.map((t) => {
			if (t.id !== taskId) return t;
			return {
				...t,
				subtasks: (t.subtasks ?? []).map((s) =>
					s.id === subtaskId ? { ...s, done: !s.done } : s
				),
			};
		}));
		showSaved();
	}, [setTasks, showSaved]);

	const removeSubtask = useCallback((taskId, subtaskId) => {
		setTasks((prev) => prev.map((t) => {
			if (t.id !== taskId) return t;
			return { ...t, subtasks: (t.subtasks ?? []).filter((s) => s.id !== subtaskId) };
		}));
		showSaved();
	}, [setTasks, showSaved]);

	const updateTaskStatus = useCallback((taskId, newStatus) => {
		setTasks((prev) => prev.map((t) => {
			if (t.id !== taskId) return t;
			return { ...t, status: newStatus, completed: newStatus === 'done' };
		}));
		showSaved();
	}, [setTasks, showSaved]);

	const reorderTasks = useCallback((dragId, dropId) => {
		setTasks((prev) => {
			const u = [...prev];
			const di = u.findIndex((t) => t.id === dragId);
			const dri = u.findIndex((t) => t.id === dropId);
			if (di === -1 || dri === -1) return prev;
			const [d] = u.splice(di, 1);
			u.splice(dri, 0, d);
			return u;
		});
		showSaved();
	}, [setTasks, showSaved]);

	const clearCompleted = useCallback(() => {
		setTasks((prev) => prev.filter((t) => !t.completed));
		showSaved();
	}, [setTasks, showSaved]);

	const resetApp = useCallback(() => {
		localStorage.removeItem('tasks');
		setTasks([]);
	}, [setTasks]);

	const clearLocalStorage = useCallback(() => {
		localStorage.clear();
		setTasks([]);
	}, [setTasks]);

	// Tab management
	const addTab = useCallback((name) => {
		setTabs((prev) => [...prev, { name, custom: true }]);
	}, [setTabs]);

	const removeTab = useCallback((name) => {
		setTabs((prev) => prev.filter((t) => t.name !== name));
		if (categoryFilter === name) setCategoryFilter('Todas');
	}, [setTabs, categoryFilter]);

	// Color de fondo dinámico según pestaña activa
	const currentTabColor = useMemo(() => {
		if (TAB_COLORS[categoryFilter]) return TAB_COLORS[categoryFilter];
		const customTabs = tabs.filter((t) => t.custom);
		const idx = customTabs.findIndex((t) => t.name === categoryFilter);
		if (idx >= 0) return CUSTOM_TAB_PALETTE[idx % CUSTOM_TAB_PALETTE.length];
		return { bg: DEFAULT_TAB_BG, color: null };
	}, [categoryFilter, tabs]);

	// Tabs con colores asignados
	const tabsWithColors = useMemo(() => {
		let customIdx = 0;
		return tabs.map((tab) => {
			if (TAB_COLORS[tab.name]) return { ...tab, color: TAB_COLORS[tab.name].color };
			const palette = CUSTOM_TAB_PALETTE[customIdx % CUSTOM_TAB_PALETTE.length];
			customIdx++;
			return { ...tab, color: palette.color };
		});
	}, [tabs]);

	// Greeting basado en hora del dia (estilo ChronoTask)
	const greeting = useMemo(() => {
		const h = new Date().getHours();
		if (h < 12) return 'Buenos dias';
		if (h < 18) return 'Buenas tardes';
		return 'Buenas noches';
	}, []);

	const todayFormatted = useMemo(() => {
		return new Date().toLocaleDateString('es-ES', {
			weekday: 'long', day: 'numeric', month: 'long',
		});
	}, []);

	// Filter pill definitions including status filters
	const filterPills = useMemo(() => [
		{ key: 'todas', label: 'Todas' },
		{ key: 'activas', label: 'Activas' },
		{ key: 'completadas', label: 'Completadas' },
		{ key: 'todo', label: 'To do', color: 'gray' },
		{ key: 'progress', label: 'In progress', color: 'amber' },
		{ key: 'done', label: 'Done', color: 'green' },
	], []);

	// Group tasks by date for calendar view
	const tasksByDate = useMemo(() => {
		const groups = {};
		const sorted = [...tasks].sort((a, b) => {
			const dateA = a.dueDate || '9999-99-99';
			const dateB = b.dueDate || '9999-99-99';
			if (dateA !== dateB) return dateA.localeCompare(dateB);
			return (a.dueTime ?? '').localeCompare(b.dueTime ?? '');
		});
		for (const task of sorted) {
			const key = task.dueDate || 'sin-fecha';
			if (!groups[key]) groups[key] = [];
			groups[key].push(task);
		}
		return groups;
	}, [tasks]);

	// Render active view content
	const renderContent = () => {
		switch (activeView) {
			case 'tasks':
				return (
					<div className="space-y-5">
						<div className="animate-widget">
							<h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Tareas</h2>
							<p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
								{tasks.length} tareas en total &middot; {completedCount} completadas
							</p>
						</div>

						{/* Search */}
						<div className="animate-widget animate-widget-d1">
							<SearchBar value={searchQuery} onChange={setSearchQuery} />
						</div>

						{/* Filters + Sort */}
						<div className={`rounded-3xl p-5 animate-widget animate-widget-d2 ${
							isDark ? 'bg-gray-700/30 shadow-lg shadow-black/5' : 'bg-white/70 shadow-lg shadow-gray-200/20'
						}`}>
							<div className="flex items-center justify-between mb-3">
								<h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
									Filtrar tareas
								</h4>
								<SortSelector activeSort={sortBy} onSortChange={setSortBy} />
							</div>
							<div className="flex gap-2 flex-wrap">
								{filterPills.map(({ key, label, color }) => (
									<button
										key={key}
										onClick={() => setFilter(key)}
										className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
											filter === key
												? color === 'amber'
													? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
													: color === 'green'
														? 'bg-green-500 text-white shadow-md shadow-green-500/20'
														: color === 'gray'
															? isDark ? 'bg-gray-400 text-gray-900 shadow-md' : 'bg-gray-700 text-white shadow-md'
															: isDark ? 'bg-white text-gray-900 shadow-md' : 'bg-gray-900 text-white shadow-md shadow-gray-900/20'
												: isDark ? 'text-gray-400 bg-gray-600/30 hover:bg-gray-600/50' : 'text-gray-500 bg-white/60 hover:bg-white shadow-sm'
										}`}
									>
										{label}
									</button>
								))}
							</div>
						</div>

						{/* Quick add */}
						<div className="animate-widget animate-widget-d2">
							<AddTaskInput onAdd={quickAddTask} onOpenNew={openNewTaskModal} />
						</div>

						{/* Task list */}
						<div className="animate-widget animate-widget-d3">
							<TaskList
								tasks={filteredTasks}
								onRemove={removeTask}
								onToggle={toggleTask}
								onOpenDetail={openTaskDetail}
								onReorder={reorderTasks}
								onClear={clearCompleted}
								completedCount={completedCount}
							/>
						</div>

						<StatusBar savedIndicator={savedIndicator} totalCount={tasks.length} completedCount={completedCount} />
					</div>
				);
			case 'calendar':
				return (
					<div className="space-y-5">
						<div className="animate-widget">
							<h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Calendario</h2>
							<p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
								Tareas organizadas por fecha
							</p>
						</div>

						{Object.entries(tasksByDate).map(([dateKey, dateTasks], idx) => {
							const isNoDate = dateKey === 'sin-fecha';
							const isPast = !isNoDate && dateKey < TODAY;
							const isToday = dateKey === TODAY;

							let dateLabel;
							if (isNoDate) {
								dateLabel = 'Sin fecha';
							} else {
								const d = new Date(dateKey + 'T12:00:00');
								dateLabel = d.toLocaleDateString('es-ES', {
									weekday: 'long', day: 'numeric', month: 'long',
								});
							}

							return (
								<div key={dateKey} className={`animate-widget ${idx > 0 ? `animate-widget-d${Math.min(idx, 5)}` : ''}`}>
									{/* Date header */}
									<div className="flex items-center gap-3 mb-3">
										<div className={`w-3 h-3 rounded-full shrink-0 ${
											isToday ? 'bg-indigo-500' : isPast ? 'bg-red-400' : isNoDate ? 'bg-gray-400' : isDark ? 'bg-gray-600' : 'bg-gray-300'
										}`} />
										<h3 className={`text-sm font-semibold capitalize ${
											isToday ? 'text-indigo-500' : isPast ? 'text-red-400' : isDark ? 'text-gray-400' : 'text-gray-500'
										}`}>
											{dateLabel}
											{isToday && <span className="ml-2 text-xs font-bold bg-indigo-500/15 text-indigo-500 px-2 py-0.5 rounded-lg">Hoy</span>}
											{isPast && !isNoDate && <span className="ml-2 text-xs font-bold bg-red-500/15 text-red-400 px-2 py-0.5 rounded-lg">Pasado</span>}
										</h3>
										<span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
											{dateTasks.length} tarea{dateTasks.length !== 1 ? 's' : ''}
										</span>
									</div>

									{/* Tasks for this date */}
									<div className="space-y-2 ml-1.5 pl-4 border-l-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-200'}">
										{dateTasks.map((task) => {
											const taskStatus = task.status || (task.completed ? 'done' : 'todo');
											const statusColors = {
												todo: isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600',
												progress: 'bg-amber-500/15 text-amber-500',
												done: 'bg-green-500/15 text-green-500',
											};
											const statusLabels = { todo: 'To do', progress: 'En curso', done: 'Hecho' };
											const priorityColors = { alta: 'bg-red-500', media: 'bg-amber-400', baja: 'bg-green-500' };

											return (
												<button
													key={task.id}
													onClick={() => openTaskDetail(task)}
													className={`w-full rounded-2xl p-4 text-left transition-all duration-200 ${
														isDark ? 'bg-gray-700/40 hover:bg-gray-700/60' : 'bg-white/80 hover:bg-white shadow-sm'
													}`}
												>
													<div className="flex items-start gap-3">
														<div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${priorityColors[task.priority]}`} />
														<div className="flex-1 min-w-0">
															<p className={`text-sm font-medium truncate ${
																task.completed ? 'line-through text-gray-400' : isDark ? 'text-gray-200' : 'text-gray-800'
															}`}>
																{task.text}
															</p>
															<div className="flex items-center gap-2 mt-1.5">
																<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg ${statusColors[taskStatus]}`}>
																	{statusLabels[taskStatus]}
																</span>
																{task.dueTime && (
																	<span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
																		{task.dueTime}
																	</span>
																)}
																{task.category && (
																	<span className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
																		{task.category}
																	</span>
																)}
															</div>
														</div>
														<svg className={`w-4 h-4 shrink-0 mt-1 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
															<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
														</svg>
													</div>
												</button>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				);
			case 'stats':
				return (
					<>
						<h2 className={`text-xl font-semibold mb-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>Estadisticas</h2>
						<StatsPanel tasks={tasks} />
					</>
				);
			case 'settings':
				return (
					<div className="space-y-5">
						<h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Ajustes</h2>
						<div className={`rounded-3xl p-6 ${isDark ? 'bg-gray-700/40' : 'bg-white/80'}`}>
							<h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Exportar datos</h3>
							<ExportButton tasks={tasks} />
						</div>
						<div className={`rounded-3xl p-6 ${isDark ? 'bg-gray-700/40' : 'bg-white/80'}`}>
							<h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Zona de peligro</h3>
							<ResetAppButton onReset={resetApp} onClearStorage={clearLocalStorage} />
						</div>
					</div>
				);
			default:
				return (
					<div className="space-y-6">
						{/* Greeting */}
						<div className="animate-widget">
							<h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
								{greeting}, <span className="text-indigo-500">Andrea</span> <span className="animate-wave">👋</span>
							</h2>
							<p className={`text-sm mt-1 capitalize ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
								{todayFormatted}
							</p>
						</div>

						{/* Row 1: Progress (wide) | Pomodoro (small) */}
						<div className="grid grid-cols-1 md:grid-cols-5 gap-5">
							<div className="md:col-span-3 animate-widget animate-widget-d1"><ProgressBar total={tasks.length} completed={completedCount} /></div>
							<div className="md:col-span-2 animate-widget animate-widget-d2"><PomodoroWidget /></div>
						</div>

						{/* Row 2: Activity (small) | Today (wide) */}
						<div className="grid grid-cols-1 md:grid-cols-5 gap-5">
							<div className="md:col-span-2 animate-widget animate-widget-d2"><ActivityWidget tasks={tasks} /></div>
							<div className="md:col-span-3 animate-widget animate-widget-d3"><TodayWidget tasks={tasks} onOpenDetail={openTaskDetail} /></div>
						</div>

						{/* Row 3: Upcoming (medium) | Streak (small) | Quick Notes (medium) */}
						<div className="grid grid-cols-1 md:grid-cols-6 gap-5">
							<div className="md:col-span-3 animate-widget animate-widget-d3"><UpcomingWidget tasks={tasks} onOpenDetail={openTaskDetail} /></div>
							<div className="md:col-span-1 animate-widget animate-widget-d4"><StreakWidget tasks={tasks} /></div>
							<div className="md:col-span-2 animate-widget animate-widget-d5"><QuickNotesWidget /></div>
						</div>

						{/* Row 4: Map (full width) */}
						<div className="animate-widget animate-widget-d4">
							<TaskMapWidget tasks={tasks} onOpenDetail={openTaskDetail} />
						</div>

						{/* Stats panel (toggle) */}
						{showStats && <div className="animate-widget"><StatsPanel tasks={tasks} /></div>}

						{/* Quick add */}
						<div className="animate-widget animate-widget-d3">
							<AddTaskInput onAdd={quickAddTask} onOpenNew={openNewTaskModal} />
						</div>

						{/* Search if open */}
						{showSearch && <div className="animate-widget"><SearchBar value={searchQuery} onChange={setSearchQuery} /></div>}

						{/* Filter bar widget */}
						<div className={`rounded-3xl p-5 animate-widget ${
							isDark ? 'bg-gray-700/30 shadow-lg shadow-black/5' : 'bg-white/70 shadow-lg shadow-gray-200/20'
						}`}>
							<div className="flex items-center justify-between mb-3">
								<h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
									Filtrar tareas
								</h4>
								<SortSelector activeSort={sortBy} onSortChange={setSortBy} />
							</div>
							<div className="flex gap-2 flex-wrap">
								{filterPills.map(({ key, label, color }) => (
									<button
										key={key}
										onClick={() => setFilter(key)}
										className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
											filter === key
												? color === 'amber'
													? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
													: color === 'green'
														? 'bg-green-500 text-white shadow-md shadow-green-500/20'
														: color === 'gray'
															? isDark ? 'bg-gray-400 text-gray-900 shadow-md' : 'bg-gray-700 text-white shadow-md'
															: isDark ? 'bg-white text-gray-900 shadow-md' : 'bg-gray-900 text-white shadow-md shadow-gray-900/20'
												: isDark ? 'text-gray-400 bg-gray-600/30 hover:bg-gray-600/50' : 'text-gray-500 bg-white/60 hover:bg-white shadow-sm'
										}`}
									>
										{label}
									</button>
								))}
							</div>
						</div>

						{/* Task list */}
						<TaskList
							tasks={filteredTasks}
							onRemove={removeTask}
							onToggle={toggleTask}
							onOpenDetail={openTaskDetail}
							onReorder={reorderTasks}
							onClear={clearCompleted}
							completedCount={completedCount}
						/>

						{/* Status bar */}
						<StatusBar savedIndicator={savedIndicator} totalCount={tasks.length} completedCount={completedCount} />
					</div>
				);
		}
	};

	return (
		<div
			className={`flex h-screen transition-all duration-500 ${isDark ? 'bg-gray-900' : ''}`}
			style={!isDark ? { backgroundColor: currentTabColor.bg } : undefined}
		>
			{/* Sidebar */}
			<Sidebar activeView={activeView} onViewChange={setActiveView} tasks={tasks} />

			{/* Main panel */}
			<main className={`flex-1 rounded-3xl m-3 ml-0 overflow-hidden flex flex-col transition-colors duration-300 ${
				isDark ? 'bg-gray-800/60 backdrop-blur-xl' : 'bg-white/70 backdrop-blur-xl'
			}`}>
				{/* Top nav */}
				<TopNav
					tabs={tabsWithColors}
					activeCategory={categoryFilter}
					onCategoryChange={(cat) => { setCategoryFilter(cat); setActiveView('home'); }}
					onAddTab={addTab}
					onRemoveTab={removeTab}
					onOpenNew={openNewTaskModal}
					onToggleSearch={() => setShowSearch(!showSearch)}
					onToggleStats={() => setShowStats(!showStats)}
					searchOpen={showSearch}
				/>

				{/* Content area */}
				<div className="flex-1 overflow-y-auto px-8 pb-8">
					{renderContent()}
				</div>
			</main>

			{/* Modal */}
			{isModalOpen && (
				<TaskDetailModal
					task={modalTask}
					onSave={saveTask}
					onClose={closeModal}
					onUpdateStatus={updateTaskStatus}
					onAddSubtask={addSubtask}
					onToggleSubtask={toggleSubtask}
					onRemoveSubtask={removeSubtask}
					categories={tabs.filter((t) => t.name !== 'Todas').map((t) => t.name)}
				/>
			)}

			{/* Undo toast */}
			{deletedTask && (
				<UndoToast task={deletedTask} onUndo={undoDelete} onDismiss={() => setDeletedTask(null)} />
			)}
		</div>
	);
}

export default App;
