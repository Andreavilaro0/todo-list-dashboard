# Proceso de Desarrollo: Todo List Dashboard

**Autora:** Andrea Avila
**Fecha:** Marzo 2026
**Asignatura:** Frontend I - Curso 2, UDIT
**Herramienta IA utilizada:** Claude Code (CLI de Anthropic) con modelo Claude Opus
**Stack tecnologico:** React 19 + Vite 6 + Tailwind CSS 4

---

## Indice

1. [Contexto y punto de partida](#1-contexto-y-punto-de-partida)
2. [Metodologia de trabajo con Claude Code](#2-metodologia-de-trabajo-con-claude-code)
3. [Skills de Claude Code utilizadas](#3-skills-de-claude-code-utilizadas)
4. [Fase 1: Checklist y validacion de requisitos](#4-fase-1-checklist-y-validacion-de-requisitos)
5. [Fase 2: Custom hooks y persistencia](#5-fase-2-custom-hooks-y-persistencia)
6. [Fase 3: Tema oscuro con Context API](#6-fase-3-tema-oscuro-con-context-api)
7. [Fase 4: Investigacion de diseno e inspiracion iOS](#7-fase-4-investigacion-de-diseno-e-inspiracion-ios)
8. [Fase 5: Iteraciones de interfaz con skills de diseno](#8-fase-5-iteraciones-de-interfaz-con-skills-de-diseno)
9. [Fase 6: Modal de detalle inspirado en iOS Calendar](#9-fase-6-modal-de-detalle-inspirado-en-google-calendar)
10. [Fase 7: Modulos de categoria en vez de hashtags](#10-fase-7-modulos-de-categoria-en-vez-de-hashtags)
11. [Fase 8: Widgets del dashboard](#11-fase-8-widgets-del-dashboard)
12. [Fase 9: Brainstorming de ideas y seleccion](#12-fase-9-brainstorming-de-ideas-y-seleccion)
13. [Fase 10: Testing manual exhaustivo](#13-fase-10-testing-manual-exhaustivo)
14. [Fase 11: Deploy y commits](#14-fase-11-deploy-y-commits)
15. [Arquitectura final](#15-arquitectura-final)
16. [Tabla de hooks de React utilizados](#16-tabla-de-hooks-de-react-utilizados)
17. [Material de referencia en el escritorio](#17-material-de-referencia-en-el-escritorio)
18. [Conclusion](#18-conclusion)

---

## 1. Contexto y punto de partida

El proyecto nacio de una propuesta academica de la asignatura Frontend I (ver `docs/plan-ejercicios-react.md`). La propuesta original planteaba tres ejercicios progresivos bastante basicos:

1. Un boton de "Limpiar completadas"
2. Un sistema de prioridades con colores
3. Persistencia con localStorage

Mi idea desde el principio fue ir mas alla de lo que pedia el ejercicio. Queria hacer algo que realmente se viera como una app real, no como un ejercicio de clase tipico. Asi que tome la propuesta como base y empece a trabajar con Claude Code para expandirla paso a paso.

No fue un proceso lineal de "pedi todo y me lo hizo". Fue bastante iterativo: yo le pedia algo, lo veia en el navegador, no me gustaba, le daba feedback, cambiabamos cosas, buscaba inspiracion, volvia a pedirle cambios... Asi durante varias sesiones.

---

## 2. Metodologia de trabajo con Claude Code

Claude Code es una herramienta de linea de comandos (CLI) de Anthropic que funciona directamente en la terminal. No es un chat web, es un agente que puede leer tu codigo, editarlo, ejecutar comandos y usar "skills" especializadas.

Mi flujo de trabajo fue el siguiente:

### 2.1 Planificacion antes de escribir codigo

Antes de cada bloque de funcionalidad, usaba la **skill de writing-plans** para que Claude generara un plan detallado. Yo revisaba el plan, descartaba lo que no me convencia y le daba el visto bueno al resto. Esto era importante porque si no, Claude puede irse por las ramas y hacer cosas que no necesitas.

### 2.2 Prompt engineering cuidadoso

Cada instruccion que le daba a Claude la pensaba bien. No era solo "haz un boton", sino que le daba contexto: donde ponerlo, que estilo queria, que componentes ya existian, que no tocara. Usaba la **skill de prompt-engineer** para estructurar mis solicitudes de manera que Claude entendiera exactamente lo que necesitaba.

### 2.3 Brainstorming de ideas

Cuando no tenia claro que funcionalidad agregar, usaba la **skill de brainstorming** para que Claude me generara una lista de ideas. Yo leia la lista, elegia las que me gustaban (por ejemplo el widget de Pomodoro, el sistema de racha, el undo toast) y descartaba las que no (hubo ideas de integracion con APIs externas que no tenian sentido para este proyecto).

### 2.4 Iteracion visual

Despues de cada cambio abria el navegador, miraba como se veia, y si no me gustaba le decia cosas como "el sidebar esta muy ancho", "los colores del dark mode no contrastan suficiente", "quiero que las tarjetas sean mas redondeadas como en iOS". Esto lo repetia muchas veces hasta que el resultado me convencia.

### 2.5 Testing manual

Antes de dar por buena una funcionalidad, le pedia a Claude que agregara muchas tareas de prueba con todas las combinaciones posibles: tareas con subtareas, sin subtareas, vencidas, de hoy, futuras, de todas las prioridades, de todas las categorias, con enlaces, con imagenes, con tags... Asi podia ver que todo funcionaba bien en el navegador.

### 2.6 Commits al final de cada bloque

Una vez que estaba satisfecha con un bloque, le pedia a Claude que hiciera el commit con un mensaje descriptivo. No iba commiteando cada linea, sino bloques funcionales completos.

---

## 3. Skills de Claude Code utilizadas

Claude Code tiene un sistema de "skills" que son como modulos especializados que le dan conocimiento extra sobre un tema. Durante el desarrollo de este proyecto use las siguientes skills:

### Skills de planificacion y proceso

| Skill | Para que la use |
|-------|----------------|
| **`brainstorming`** | Generar listas de ideas para nuevas funcionalidades. De ahi salieron ideas como el widget de Pomodoro, la racha de productividad, el undo toast, la exportacion a .ics, y el sistema de drag & drop |
| **`writing-plans`** | Crear planes de implementacion antes de escribir codigo. Cada fase tenia un plan que revisaba y aprobaba antes de empezar |
| **`executing-plans`** | Ejecutar los planes aprobados de manera ordenada, paso a paso |
| **`prompt-engineer`** | Estructurar mis instrucciones de manera clara para que Claude entendiera exactamente lo que queria |
| **`verification-before-completion`** | Verificar que todo estuviera completo antes de dar por terminada una fase |

### Skills de diseno e interfaz

| Skill | Para que la use |
|-------|----------------|
| **`frontend-design`** | Crear la interfaz visual del dashboard. Esta skill le da a Claude conocimiento sobre diseno de interfaces web modernas, paletas de color, tipografia, espaciado |
| **`refactoring-ui`** | Mejorar la interfaz siguiendo principios practicos de diseno UI: reducir bordes, usar sombras suaves, mejorar jerarquia visual |
| **`top-design`** | Inspiracion de diseno web premiado para las decisiones esteticas del proyecto |
| **`ios-hig-design`** | Aplicar las guias de Human Interface de Apple: esquinas redondeadas grandes (rounded-3xl), blur effects, profundidad con sombras sutiles, animaciones fluidas |
| **`design-trends-2026`** | Tendencias de diseno actuales: glassmorphism suave, gradientes, micro-interacciones |
| **`oiloil-ui-ux-guide`** | Guia moderna de UI/UX para mantener consistencia y limpieza visual |

### Skills de desarrollo fullstack

| Skill | Para que la use |
|-------|----------------|
| **`senior-fullstack`** | Para la arquitectura general del proyecto: como dividir componentes, donde poner la logica, como manejar el estado |
| **`react-expert`** | Conocimiento especifico de React: cuando usar useMemo vs useCallback, como estructurar Context, patterns de componentes |
| **`react-best-practices`** | Mejores practicas de React: inmutabilidad, key props, cleanup de effects, lazy initialization |
| **`javascript-pro`** | Para logica compleja de JavaScript puro como el calculo de countdown, filtros avanzados, ordenamiento |
| **`typescript-pro`** | Aunque el proyecto es JS, use esta skill para entender mejor como estructurar los datos y props |

### Skills de testing y calidad

| Skill | Para que la use |
|-------|----------------|
| **`test-master`** | Generar casos de prueba para cada funcionalidad: que pasa si no hay tareas, si todas estan completadas, si la fecha esta vencida, etc. |
| **`test-driven-development`** | Pensar primero en que deberia pasar antes de implementar. Por ejemplo: "el UndoToast debe desaparecer a los 5 segundos" -> implementar -> verificar |
| **`verification-before-completion`** | Checklist final antes de cerrar cada fase |
| **`simplify`** | Revisar el codigo generado para encontrar redundancias, codigo muerto, o cosas que se podian simplificar |
| **`code-review`** | Revision de calidad del codigo: nombres de variables claros, componentes bien divididos, sin logica duplicada |

### Skills de commits y git

| Skill | Para que la use |
|-------|----------------|
| **`git-pushing`** | Crear commits con mensajes descriptivos en espanol |
| **`finishing-a-development-branch`** | Cerrar cada bloque de trabajo de manera limpia |

### Sub-agentes utilizados

Claude Code puede lanzar "sub-agentes" que son como trabajadores paralelos especializados. Durante el proyecto se usaron:

| Sub-agente | Funcion |
|------------|---------|
| **Explore agent** | Para explorar el codebase y encontrar archivos relevantes cuando el proyecto empezo a crecer |
| **General-purpose agent** | Para buscar patterns en el codigo, como "donde se usa useTheme" o "que componentes reciben tasks como prop" |
| **Code-reviewer agent** | Para revisar bloques de codigo terminados y encontrar posibles mejoras |
| **Frontend-developer agent** | Para implementar componentes de UI complejos como el StatsPanel con los graficos SVG |
| **Plan agent** | Para disenar la estrategia de implementacion de funcionalidades complejas como el sistema de categorias dinamicas |

---

## 4. Fase 1: Checklist y validacion de requisitos

### Proceso

Lo primero que hice fue darle a Claude el documento `plan-ejercicios-react.md` (la propuesta del profesor) y pedirle que hiciera un checklist completo de todos los requisitos. Queria asegurarme de no olvidar nada antes de empezar a construir.

Claude genero una lista de verificacion que incluia:

- [x] Proyecto con Vite + React
- [x] Tailwind CSS configurado
- [x] Estado de tareas con `useState`
- [x] Componente para agregar tareas (`AddTaskInput`)
- [x] Componente para cada tarea (`TaskItem`)
- [x] Componente lista (`TaskList`)
- [x] Funcionalidad: agregar tarea
- [x] Funcionalidad: eliminar tarea
- [x] Funcionalidad: marcar/desmarcar como completada
- [x] Contador de tareas

### Decisiones tecnicas tomadas en esta fase

| Decision | Por que | Alternativa descartada |
|----------|---------|----------------------|
| Vite como bundler | Inicio en menos de 1 segundo, HMR nativo, zero-config | Create React App (lento, deprecated) |
| Tailwind CSS 4 | Clases utilitarias directamente en JSX, no necesita archivos CSS por componente | CSS Modules (mas trabajo, menos consistente) |
| `Date.now()` para generar IDs | Simple, unico en el contexto de una app cliente | uuid (dependencia externa innecesaria) |
| Estructura plana de componentes | Para un proyecto de este tamano no tiene sentido crear subdirectorios por feature | Atomic Design (overengineering para este caso) |

### Commits asociados

```
fd9673d - inicio del proyecto con vite + react
3ce3459 - estructura base de la app y estilos globales
```

---

## 5. Fase 2: Custom hooks y persistencia

### Proceso

Use la **skill de writing-plans** para planificar esta fase. El plan incluia tres hooks custom:

1. `useLocalStorage` - para que las tareas no se perdieran al recargar
2. `useDebounce` - para la busqueda en tiempo real
3. `useFetch` - preparado para una futura integracion con API

Despues de aprobar el plan, use la **skill de react-expert** junto con **executing-plans** para implementar los hooks.

### Que hace cada hook y como funciona

#### `useLocalStorage(key, initialValue)`

Este es el hook mas importante del proyecto. Sincroniza un estado de React con `localStorage` de forma automatica.

**Conceptos React que aplica:**

- **Lazy initialization**: Se le pasa una funcion a `useState(() => {...})` en vez de un valor directo. Esto hace que la lectura de localStorage ocurra SOLO una vez (en el montaje), no en cada render. Si escribieras `useState(localStorage.getItem(key))`, React ejecutaria esa lectura en cada render aunque solo use el resultado la primera vez.

- **`useRef` para controlar el primer render**: Hay un `isFirstRender` que es un `useRef(true)`. Cuando el componente se monta, el `useEffect` detecta que es el primer render y no hace nada. Asi evita una escritura innecesaria a localStorage (porque acaba de leer de ahi, no tiene sentido escribir lo mismo que leyo).

- **`useEffect` con dependencias `[key, storedValue]`**: El efecto de guardado solo se ejecuta cuando el valor realmente cambia. No en cada render, no aleatoriamente, solo cuando `storedValue` es diferente al anterior.

#### `useDebounce(value, delay)`

Retrasa la actualizacion de un valor. Se usa en la busqueda: cuando el usuario escribe, el filtro no se aplica inmediatamente en cada tecla, sino que espera a que pare de escribir. Esto evita que la lista parpadee con cada letra.

#### `useFetch(url)`

Hook generico para peticiones HTTP. No se usa activamente en el proyecto actual, pero esta preparado para cuando se conecte a un backend.

### Commit asociado

```
0858e39 - custom hooks: useLocalStorage, useDebounce y useFetch
```

---

## 6. Fase 3: Tema oscuro con Context API

### Proceso

Queria que la app tuviera dark mode porque practicamente todas las apps modernas lo tienen. Use la **skill de react-expert** para implementar la Context API correctamente.

### Como funciona

1. Se crea un `ThemeContext` con `createContext()`
2. Un `ThemeProvider` envuelve TODA la app desde `main.jsx`
3. El Provider da acceso a `theme` (string: 'light' o 'dark') y `toggleTheme` (funcion)
4. Cualquier componente hijo puede usar `useTheme()` para acceder al tema
5. La preferencia se guarda con `useLocalStorage`, asi que si el usuario elige dark mode, cuando vuelva a abrir la app sigue en dark mode

### Por que Context API y no prop drilling

El tema se necesita en TODOS los componentes: Sidebar, TopNav, TaskItem, TaskDetailModal, StatsPanel, ProgressBar, todos los Widgets... Si lo pasara como prop desde App.jsx, tendria que hacer:

```
App -> Sidebar -> (usa theme)
App -> TopNav -> (usa theme)
App -> TaskList -> TaskItem -> (usa theme)
App -> TaskDetailModal -> TagInput -> (usa theme)
```

Seria inmantenible. Con Context, cualquier componente hace `const { theme } = useTheme()` y listo.

### Validacion de uso correcto

El custom hook `useTheme()` incluye una validacion: si alguien intenta usar `useTheme()` fuera del `ThemeProvider`, lanza un error claro: "useTheme debe usarse dentro de un ThemeProvider". Esto evita bugs dificiles de debuggear.

### Commit asociado

```
5027dca - contexto de tema con useContext para modo oscuro
```

---

## 7. Fase 4: Investigacion de diseno e inspiracion iOS

### Proceso de investigacion

Esta fue una de las fases mas largas y donde mas itere. No queria que la app se viera como "un ejercicio de clase con Tailwind". Queria algo que pareciera una app real.

Lo que hice:

1. **Busque inspiraciones en el escritorio**: Guarde capturas de pantalla de apps que me gustaban en la carpeta `~/Desktop/inspiraciones/`. Ahi hay referencias de diseno que fui recopilando (capturas de apps iOS, dashboards de Dribbble, interfaces de iOS Calendar).

2. **Tambien guarde capturas sueltas en el escritorio**: Archivos como `inspi.png` y las capturas de pantalla que hay en `~/Desktop/` son referencias visuales que use durante el proceso.

3. **Le pase las inspiraciones a Claude**: Le describia lo que veia en las capturas y le pedia que replicara ciertos aspectos. Por ejemplo: "quiero que las tarjetas de tareas tengan esquinas muy redondeadas como en iOS, con sombras suaves, sin bordes duros".

4. **Busque mucho la estetica iOS/Apple**: Use la **skill de `ios-hig-design`** (Human Interface Guidelines de Apple) para aplicar los principios de diseno de Apple:
   - **Esquinas redondeadas grandes**: Todo usa `rounded-3xl` (24px de radio) en vez del clasico `rounded-lg` (8px). Es lo que hace que se vea "suave" como las apps de iPhone.
   - **Sombras sutiles con profundidad**: En vez de bordes, se usan sombras como `shadow-lg shadow-gray-200/40`. Esto crea profundidad sin lineas duras.
   - **Blur y transparencia**: Fondos como `bg-white/80` (blanco al 80% de opacidad) que dan un efecto de vidrio esmerilado.
   - **Animaciones fluidas**: `transition-all duration-200` en todos los elementos interactivos. Los botones crecen al hacer hover (`hover:scale-110`), las tarjetas se elevan (`hover:shadow-lg`).
   - **Iconografia limpia**: SVGs minimalistas con trazo fino (`strokeWidth={2}`), no iconos rellenos.

5. **Use la skill `refactoring-ui`** para aplicar principios del libro Refactoring UI:
   - Reemplazar bordes por sombras
   - Usar peso de fuente para crear jerarquia (no solo tamano)
   - Colores de fondo sutiles en vez de bordes para agrupar contenido
   - Espaciado generoso entre elementos

6. **Use la skill `design-trends-2026`** para incorporar tendencias actuales:
   - Gradientes suaves en los widgets (el Pomodoro tiene `bg-gray-900`, el Streak tiene gradiente `from-emerald-500 to-teal-600`)
   - Micro-interacciones (el checkbox de tarea tiene una animacion `animate-check`)
   - Badges con colores pasteles (`bg-amber-100 text-amber-700`)

### El resultado de la iteracion

No fue "pedi un diseno y quedo bien a la primera". Fueron muchas rondas:

- Primera version: se veia generico, como cualquier tutorial de Tailwind
- Le pedi mas redondeo y sombras: mejoro pero los colores eran muy planos
- Le pase la inspiracion de iOS: mucho mejor, pero el dark mode se veia raro
- Ajustamos los colores del dark mode: ahora `bg-gray-700/40` en vez de `bg-gray-800`
- Le pedi que las tarjetas "flotaran" con hover: agrego `hover:shadow-lg` y `hover:bg-white`
- Iteramos el espaciado: mas padding, mas gap entre elementos
- Ajustamos la tipografia: pesos mas variados, tamanos mas pequenos para metadata

Use la **skill de `senior-fullstack`** junto con **`frontend-design`** para que cada iteracion mantuviera una arquitectura de componentes limpia mientras cambiabamos el diseno.

### Commits asociados

```
71b2b9c - componentes principales: input, items y lista de tareas
7891f74 - sidebar con navegacion y topnav con pestanas dinamicas
```

---

## 8. Fase 5: Iteraciones de interfaz con skills de diseno

### Componentes de layout

#### Sidebar

Barra lateral de navegacion con 4 secciones: Inicio, Tareas, Estadisticas, Calendario. Cada seccion tiene un icono SVG personalizado. El item activo se resalta con un fondo coloreado. En dark mode cambia a tonos grises.

Elementos de diseno iOS aplicados:
- Iconos con trazo fino, no rellenos
- Indicador de seccion activa con fondo suave
- Transiciones de 200ms en hover
- Separador visual para el boton de Ajustes (abajo del todo)

#### TopNav

Barra superior con pestanas por categoria. Cada pestana es un chip redondeado (`rounded-full`). La pestana activa invierte colores (fondo oscuro, texto blanco). Incluye acciones globales: toggle de tema, busqueda, estadisticas, nueva tarea.

Inspiracion: los segmented controls de iOS y las pestanas de la app de Notas de Apple.

#### TaskItem

Tarjeta individual de tarea. Es el componente visualmente mas complejo:

- Checkbox circular personalizado (no el nativo del navegador), con animacion al marcar
- Dot de prioridad coloreado (rojo/amarillo/verde)
- Badge de estado (To do / In progress / Done) con colores por estado
- Countdown inteligente que calcula si la tarea vence "Hoy", "Manana", "3d", o "2d vencida"
- Tags mostrados como chips (maximo 2 visibles, "+N" si hay mas)
- Iconos de metadata: nota, enlace, imagen, ubicacion
- Barra de progreso de subtareas
- Acciones visibles solo al hacer hover (editar, eliminar)
- Drag & drop nativo para reordenar

### Commits asociados

```
71b2b9c - componentes principales: input, items y lista de tareas
7891f74 - sidebar con navegacion y topnav con pestanas dinamicas
```

---

## 9. Fase 6: Modal de detalle inspirado en iOS Calendar

### De donde salio la idea

Cuando empece a agregar campos a las tareas (prioridad, categoria, fecha), me di cuenta de que el input basico no era suficiente. Necesitaba un formulario completo. Pense en que app tiene el mejor formulario de "crear algo" y la respuesta fue iOS Calendar. Cuando creas un evento en iOS Calendar, el formulario es limpio, intuitivo, y tiene todo lo que necesitas sin abrumar.

Le pase esta idea a Claude y usamos las skills de **`frontend-design`** y **`react-expert`** para implementar un modal que se sintiera como crear un evento en iOS Calendar.

### Campos del formulario `TaskDetailModal`

| Campo | Tipo de input | Inspiracion |
|-------|---------------|-------------|
| Titulo | Texto con auto-focus | iOS Calendar: el titulo es lo primero que escribes |
| Notas | Textarea expandible | iOS Calendar: "Agregar descripcion" |
| Prioridad | Tres botones toggle (baja/media/alta) | Personalizado: botones de color con seleccion visual |
| Categoria | Selector con categorias predefinidas | iOS Calendar: selector de calendario |
| Fecha limite | Date picker nativo | iOS Calendar: selector de fecha |
| Hora | Time picker nativo | iOS Calendar: selector de hora |
| Recordatorio | Selector dropdown | iOS Calendar: "Agregar recordatorio" |
| Direccion | Input de texto | iOS Calendar: "Agregar ubicacion" |
| Enlaces | Lista dinamica con boton "+" | Personalizado: poder adjuntar URLs de referencia |
| Etiquetas | TagInput custom con chips | Inspiracion de apps como Notion y Todoist |
| Imagen | File upload con preview | Personalizado: poder adjuntar una foto a la tarea |
| Estado | Selector tipo Kanban (To do / In progress / Done) | Inspiracion de Trello y Linear |
| Subtareas | Lista interactiva con checkbox y progreso | Google Tasks: subtareas con checkbox |

### Estado local del modal

El modal maneja su propio estado con `useState` para el formulario completo. Cuando el usuario guarda, llama a `onSave(form)` que sube los datos al estado global en `App.jsx`. Esto es una buena practica porque el modal es "dueño" de su propio formulario y solo comunica hacia arriba cuando hay un cambio definitivo.

Se usa `useRef` para:
- `modalRef`: referencia al modal para cerrar al hacer click fuera
- `titleRef`: auto-focus en el titulo al abrir
- `fileRef`: referencia al input de archivo (oculto, se activa con boton)

### Commit asociado

```
6b53256 - modal de detalle con formulario completo de tarea
```

---

## 10. Fase 7: Modulos de categoria en vez de hashtags

### La decision

Al principio las tareas solo tenian hashtags (tags). Pero cuando empece a usar la app en el navegador con muchas tareas, me di cuenta de que necesitaba una forma rapida de filtrar por contexto. No es lo mismo buscar tareas de la universidad que tareas personales o de trabajo.

Le pedi a Claude que en vez de depender solo de tags, creara **categorias como modulos de trabajo** que funcionaran como pestanas de filtrado en la barra superior. Asi nacio el sistema de categorias:

- **Personal** (morado): gym, compras, citas medicas
- **Trabajo** (azul): reuniones, code reviews, deploys
- **Estudio** (verde azulado): tareas de la universidad, examenes, lecturas
- **Otro** (ambar): todo lo demas

Cada categoria tiene su propio color tanto para la pestana como para los badges dentro de las tareas. Ademas, se pueden crear **categorias custom** con colores de una paleta predefinida (rosa, cyan, naranja, violeta, verde, rojo).

### Implementacion tecnica

```javascript
const TAB_COLORS = {
  Todas: { bg: '#e8e4ee', color: null },
  Personal: { bg: '#ede4ee', color: '#a855f7' },
  Trabajo: { bg: '#e4e8ee', color: '#3b82f6' },
  Estudio: { bg: '#e4eee8', color: '#14b8a6' },
  Otro: { bg: '#eee8e4', color: '#f59e0b' },
};
```

El fondo de la app cambia sutilmente segun la categoria seleccionada. Por ejemplo, si estas en "Estudio", el fondo tiene un toque verdoso. Esto da un feedback visual inmediato de en que contexto estas.

Las categorias se guardan en `useLocalStorage` para que las custom persistan entre sesiones.

---

## 11. Fase 8: Widgets del dashboard

### Proceso de brainstorming

Aqui es donde mas use la **skill de brainstorming**. Le pedi a Claude que me diera ideas de widgets para un dashboard de productividad. Me dio una lista larga y yo elegi las que me parecian utiles y no demasiado complejas:

**Ideas que elegi:**

| Widget | Por que lo elegi |
|--------|-----------------|
| `ProgressBar` | Es lo mas basico de un dashboard: ver el progreso general |
| `StatsPanel` | Queria graficos: donut chart de progreso, barras de prioridad, actividad semanal |
| `PomodoroWidget` | Porque yo uso la tecnica Pomodoro para estudiar y me parecio util tenerlo integrado |
| `TodayWidget` | Para ver de un vistazo que tengo que hacer hoy |
| `UpcomingWidget` | Para ver las proximas tareas con fecha |
| `StreakWidget` | Inspirado en las rachas de Duolingo, para motivar consistencia |
| `QuickNotesWidget` | A veces necesitas anotar algo rapido sin crear una tarea |
| `ActivityWidget` | Para ver que se hizo recientemente |
| `TaskMapWidget` | Para tareas que tienen una direccion fisica |

**Ideas que descarte:**

- Integracion con Spotify (no tiene sentido para un todo list)
- Widget de clima (irrelevante)
- Chat integrado (overengineering)
- Graficos de productividad mensual (demasiado complejo para el scope)

### Conceptos React en los widgets

#### PomodoroWidget - `useEffect` con cleanup

Este widget es un buen ejemplo de `useEffect` bien implementado:

```javascript
useEffect(() => {
  if (isRunning && secondsLeft > 0) {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) { setIsRunning(false); return 0; }
        return prev - 1;
      });
    }, 1000);
  }
  return () => clearInterval(intervalRef.current); // CLEANUP
}, [isRunning, secondsLeft]);
```

El `return () => clearInterval(...)` es la **funcion de cleanup**. Cuando el componente se desmonta o cuando las dependencias cambian, React ejecuta esta funcion para limpiar el intervalo anterior. Sin esto, el timer seguiria corriendo en memoria (memory leak).

El progreso circular se dibuja con SVG:
- Un circulo de fondo gris
- Un circulo de progreso naranja que se va llenando con `strokeDashoffset`
- La formula: `strokeDashoffset = circumference - (progress / 100) * circumference`

#### StatsPanel - `useMemo` para calculos costosos

El panel de estadisticas calcula muchas cosas: total, completadas, pendientes, vencidas, distribucion por prioridad, por estado, por categoria, actividad de los ultimos 7 dias. Todo esto se envuelve en `useMemo`:

```javascript
const stats = useMemo(() => {
  // ... todos los calculos ...
  return { total, completed, pending, overdue, ... };
}, [tasks]);
```

`useMemo` memoriza el resultado. Solo recalcula cuando `tasks` cambia. Si el componente se re-renderiza por otra razon (por ejemplo, cambio de tema), no recalcula las estadisticas innecesariamente.

El donut chart y las barras de progreso se dibujan con SVG puro, sin librerias externas.

#### StreakWidget - calculo de racha

Calcula la racha de dias consecutivos con al menos una tarea completada. Muestra los ultimos 7 dias con indicadores visuales. Inspirado en las rachas de Duolingo y GitHub contributions.

### Commits asociados

```
56ca059 - widgets del dashboard: progreso, actividad, pomodoro y mas
c9b0bf4 - panel de estadisticas y componentes de utilidad
```

---

## 12. Fase 9: Brainstorming de ideas y seleccion

### Funcionalidades adicionales implementadas

Despues de los widgets, use **brainstorming** otra vez para pensar en funcionalidades de UX que hicieran la app mas completa:

#### Busqueda con debounce

`SearchBar` usa el hook `useDebounce` para filtrar tareas en tiempo real. Cuando escribes, el filtro espera 300ms despues de la ultima tecla antes de aplicarse. Esto evita que la lista parpadee con cada letra.

#### Sistema de ordenamiento

`SortSelector` permite ordenar por: prioridad, fecha de vencimiento, nombre, o estado. Usa `[...tasks].sort()` (copia del array, inmutabilidad) con diferentes funciones comparadoras.

#### Undo Toast

Cuando eliminas una tarea, no se borra inmediatamente. Aparece un toast en la parte inferior con el mensaje "Tarea eliminada: [nombre]" y un boton "Deshacer". Si no haces nada, a los 5 segundos desaparece y la tarea se elimina definitivamente.

Concepto React: el toast usa `useEffect` con `setTimeout` de 5 segundos y cleanup con `clearTimeout`.

#### Exportar a .ics

`ExportButton` genera un archivo `.ics` (formato iCalendar) compatible con iOS Calendar, Outlook y Apple Calendar. Asi puedes exportar tus tareas como eventos de calendario.

#### Drag & drop nativo

Las tareas se pueden reordenar arrastrando y soltando. Se usa la API nativa de HTML5 Drag & Drop (`draggable`, `onDragStart`, `onDragOver`, `onDrop`) sin librerias externas.

---

## 13. Fase 10: Testing manual exhaustivo

### Proceso

Antes de dar el proyecto por terminado, le pedi a Claude que usara la **skill de test-master** para disenar una suite de pruebas manuales. Despues le pedi que agregara **18 tareas de ejemplo** con todas las combinaciones posibles para poder validar visualmente que todo funcionaba.

### Tareas de prueba creadas

Las 18 tareas de ejemplo en `DEFAULT_TASKS` no son aleatorias. Cada una prueba algo especifico:

| Tarea | Que prueba |
|-------|-----------|
| "Aprender fundamentos de React" | Prioridad alta + 5 subtareas parcialmente completadas + tags + link + direccion |
| "Entregar proyecto de tareas" | Fecha futura + 6 subtareas + estado "In progress" |
| "Reunion con equipo de marketing" | Tarea de hoy + hora especifica + link de Google Meet + direccion |
| "Disenar wireframes del landing page" | Prioridad media + categoria Trabajo + 5 subtareas |
| "Ir al gimnasio" | Tarea completada + estado "Done" + sin subtareas |
| "Comprar ingredientes" | Prioridad baja + completada + categoria Personal |
| "Estudiar para examen" | Prioridad alta + fecha futura + 4 subtareas + link externo |
| "Cita con el dentista" | Prioridad baja + sin subtareas + con direccion |
| "Revisar pull request" | Tarea de hoy + 4 subtareas todas pendientes |
| "Actualizar portfolio" | Prioridad baja + fecha lejana + 4 subtareas |
| "Leer capitulo de JavaScript" | Completada + prioridad media + categoria Estudio |
| "Enviar factura del freelance" | Completada + prioridad alta + categoria Trabajo |
| Y 6 tareas mas... | Variaciones de estados, fechas, categorias |

### Que se valido

- [x] Filtrado por categoria funciona correctamente
- [x] Busqueda filtra por texto en tiempo real con debounce
- [x] Ordenamiento por prioridad, fecha, nombre y estado
- [x] Dark mode se ve bien en TODOS los componentes
- [x] El countdown muestra "Hoy", "Manana", "3d", "2d vencida" correctamente
- [x] Las subtareas se marcan/desmarcan y la barra de progreso se actualiza
- [x] El Pomodoro inicia, pausa, reinicia y muestra progreso circular
- [x] El undo toast aparece al eliminar y desaparece a los 5 segundos
- [x] localStorage persiste tareas, tema, notas rapidas y categorias custom al recargar (F5)
- [x] El modal de detalle carga todos los campos correctamente
- [x] Drag & drop reordena las tareas
- [x] Las categorias custom se crean y eliminan correctamente

---

## 14. Fase 11: Deploy y commits

### Nota importante sobre los commits

Los commits se hicieron **al final del proceso**, una vez que todo el desarrollo estaba terminado y validado. No fui commiteando durante el desarrollo porque estaba enfocada en iterar rapido: probar en el navegador, dar feedback, ajustar, volver a probar. Intentar commitear en medio de esas iteraciones habria sido contraproducente porque a veces un cambio se revertia dos minutos despues.

Una vez que el proyecto estaba completo y funcionando, le pedi a Claude que hiciera commits progresivos y ordenados por bloque logico. Use la **skill de git-pushing** para que los mensajes fueran descriptivos y reflejaran la estructura del proyecto.

### Historial de commits detallado

#### `fd9673d` - inicio del proyecto con vite + react
Scaffolding inicial generado con `npm create vite@latest`. Configuracion de React 19 con el plugin `@vitejs/plugin-react`. Estructura basica de carpetas `src/`, `public/`. Archivo `index.html` con el div `#root`. Entry point en `main.jsx` con `createRoot`.

#### `3ce3459` - estructura base de la app y estilos globales
Configuracion de Tailwind CSS 4 con el plugin `@tailwindcss/vite`. Archivo `index.css` con la directiva `@import "tailwindcss"` y animaciones custom definidas con `@keyframes` (bounce-in, check, widget fade-in con delays escalonados). Estructura basica de `App.jsx` con el layout principal.

#### `0858e39` - custom hooks: useLocalStorage, useDebounce y useFetch
Tres hooks personalizados en `src/hooks/`:
- `useLocalStorage`: sincronizacion bidireccional estado-localStorage con lazy initialization, useRef para evitar escritura en primer render, y useEffect con dependencias [key, storedValue]
- `useDebounce`: delay configurable para optimizar inputs de busqueda, usa useEffect con setTimeout y cleanup con clearTimeout
- `useFetch`: hook generico para peticiones HTTP con estados de loading, error y data

#### `5027dca` - contexto de tema con useContext para modo oscuro
`ThemeContext.jsx` con createContext, ThemeProvider que envuelve la app desde main.jsx, y custom hook useTheme() con validacion de uso fuera del Provider. La preferencia de tema se persiste con useLocalStorage para que sobreviva al refresh.

#### `5db3083` - utilidad para exportar tareas a calendario .ics
Archivo `src/utils/calendar.js` que genera archivos iCalendar (.ics) compatibles con iOS Calendar, Apple Calendar y Outlook. Convierte las tareas con fecha y hora a formato VCALENDAR/VEVENT con timestamps en formato ISO. Incluye soporte para titulo, descripcion (notas), ubicacion (address) y alarma de recordatorio.

#### `71b2b9c` - componentes principales: input, items y lista de tareas
Tres componentes core:
- `AddTaskInput`: input de texto con auto-focus via useRef, soporte para Enter, boton "+ Detalle" que abre el modal completo. Diseño minimalista con circulo vacio a la izquierda (imitando el checkbox)
- `TaskItem`: tarjeta completa de tarea con checkbox circular animado, dot de prioridad, badge de estado, countdown inteligente (calcula "Hoy", "Manana", "3d", "2d vencida" con useMemo), tags como chips, iconos de metadata, barra de progreso de subtareas, acciones hover (editar/eliminar), y soporte para drag & drop nativo
- `TaskList`: wrapper que renderiza la lista de TaskItems con manejo de drag & drop entre items

#### `7891f74` - sidebar con navegacion y topnav con pestanas dinamicas
Layout de dos columnas:
- `Sidebar`: navegacion lateral con 4 secciones (Inicio, Tareas, Estadisticas, Calendario) + boton de Ajustes abajo. Iconos SVG personalizados con trazo fino. Indicador visual de seccion activa. Soporte completo para dark mode
- `TopNav`: barra superior con pestanas de categoria como chips redondeados (rounded-full). Sistema de pestanas dinamicas: las 5 base (Todas, Personal, Trabajo, Estudio, Otro) + pestanas custom que el usuario puede crear y eliminar. Cada categoria tiene su color asignado. Botones de accion: toggle tema, busqueda, estadisticas, nueva tarea

#### `6b53256` - modal de detalle con formulario completo de tarea
`TaskDetailModal` con 13 campos de edicion inspirado en iOS Calendar. Estado local con useState para todo el formulario. useRef para auto-focus en titulo, click-outside para cerrar, y referencia al file input oculto. Integra componentes internos: TagInput para etiquetas con chips, MapWidget para visualizar direccion, ShareButton para compartir. Status selector tipo Kanban (To do / In progress / Done). Preview de imagen adjunta. Lista de subtareas interactiva con checkbox individual y progreso visual.

#### `56ca059` - widgets del dashboard: progreso, actividad, pomodoro y mas
Seis widgets implementados:
- `ProgressBar`: barra de progreso con porcentaje calculado via useMemo
- `PomodoroWidget`: temporizador de 25 minutos con circulo SVG de progreso, useEffect con setInterval y cleanup con clearInterval, useCallback para toggle y reset
- `TodayWidget`: filtrado de tareas por fecha de hoy
- `UpcomingWidget`: proximas tareas ordenadas cronologicamente
- `StreakWidget`: racha de dias consecutivos con tareas completadas, visualizacion de ultimos 7 dias con barras
- `QuickNotesWidget`: bloc de notas rapido persistido con useLocalStorage

#### `c9b0bf4` - panel de estadisticas y componentes de utilidad
- `StatsPanel`: dashboard completo de metricas con useMemo para todos los calculos. Donut chart SVG con gradiente para progreso general. Tarjetas de estado (To do / In progress / Done). Barras de distribucion por prioridad. Alerta de tareas vencidas. Grafico de actividad semanal con barras verticales. Breakdown por categoria con barras de progreso con gradiente
- `UndoToast`: notificacion de deshacer eliminacion con auto-dismiss a 5 segundos via useEffect + setTimeout + cleanup
- `ExportButton`: boton de exportacion a .ics
- `ClearCompletedButton`: boton condicional que solo aparece si hay tareas completadas
- `ResetAppButton`: reset completo con window.confirm de confirmacion
- `SortSelector`: selector de criterio de ordenamiento (prioridad, fecha, nombre, estado)
- `SearchBar`: input de busqueda integrado con useDebounce
- `ActivityWidget`: registro de actividad reciente basado en createdAt
- `StatusBar`: barra inferior con contadores de tareas

#### `01c883a` - layout final del dashboard con vistas y tareas ejemplo
Integracion final de todos los componentes en App.jsx. Layout responsivo con grid CSS. Sistema de vistas: home (dashboard con widgets), tasks (lista de tareas), stats (panel de estadisticas). 18 tareas de ejemplo detalladas para testing manual con todas las combinaciones de prioridad, categoria, estado, subtareas, fechas, tags, enlaces y direcciones. Logica de filtrado por categoria, busqueda con debounce, ordenamiento configurable. Sistema de undo con estado temporal de tarea eliminada.

#### `647b797` - configurar base url para deploy en github pages
Configuracion de `base: '/todo-list-dashboard/'` en `vite.config.js` para que los assets se sirvan correctamente desde el subpath del repositorio en GitHub Pages.

#### `4d6dc9e` - Updates
Ajustes finales de configuracion y limpieza.

### Configuracion de deploy

Se configuro `base: '/todo-list-dashboard/'` en `vite.config.js` para que el proyecto funcionara correctamente en GitHub Pages bajo el subpath del repositorio.

Hubo un problema de incompatibilidad de versiones: Vite 7 no era compatible con `@tailwindcss/vite` 4. La solucion fue bajar a Vite 6 y `@vitejs/plugin-react` 4, y reinstalar `node_modules` limpio.

---

## 15. Arquitectura final

```
src/
├── main.jsx                       # Punto de entrada. ThemeProvider envuelve App
├── App.jsx                        # Estado central, logica de negocio, layout principal
├── index.css                      # Estilos globales + import de Tailwind + animaciones custom
│
├── context/
│   └── ThemeContext.jsx            # Context API para tema light/dark con useLocalStorage
│
├── hooks/
│   ├── useLocalStorage.js          # Persistencia automatica en localStorage
│   ├── useDebounce.js              # Delay para optimizar busquedas en tiempo real
│   └── useFetch.js                 # Hook generico para peticiones HTTP (preparado)
│
├── components/
│   ├── Sidebar.jsx                 # Navegacion lateral con iconos SVG
│   ├── TopNav.jsx                  # Pestanas de categoria + acciones globales
│   ├── AddTaskInput.jsx            # Input rapido + boton "Detalle" para abrir modal
│   ├── TaskList.jsx                # Renderizado de lista de tareas con soporte drag & drop
│   ├── TaskItem.jsx                # Tarjeta de tarea: checkbox, metadata, countdown, badges
│   ├── TaskDetailModal.jsx         # Modal completo: 13 campos de edicion
│   ├── TagInput.jsx                # Input de etiquetas con chips
│   ├── SearchBar.jsx               # Busqueda con debounce integrado
│   ├── SortSelector.jsx            # Selector de criterio de ordenamiento
│   ├── ProgressBar.jsx             # Barra de progreso general
│   ├── StatsPanel.jsx              # Dashboard de estadisticas: donut, barras, actividad semanal
│   ├── StatusBar.jsx               # Barra de estado inferior con contadores
│   ├── ClearCompletedButton.jsx    # Boton para limpiar tareas completadas
│   ├── ResetAppButton.jsx          # Boton reset con confirmacion
│   ├── ExportButton.jsx            # Exportar a archivo .ics (iCalendar)
│   ├── ShareButton.jsx             # Compartir tarea
│   ├── UndoToast.jsx               # Toast de "deshacer" con auto-dismiss a los 5s
│   ├── MapWidget.jsx               # Widget de mapa para tareas con direccion
│   ├── PomodoroWidget.jsx          # Temporizador Pomodoro con SVG circular
│   ├── TodayWidget.jsx             # Lista de tareas que vencen hoy
│   ├── UpcomingWidget.jsx          # Lista de proximas tareas con fecha
│   ├── ActivityWidget.jsx          # Registro de actividad reciente
│   ├── QuickNotesWidget.jsx        # Bloc de notas rapido (persistido en localStorage)
│   ├── StreakWidget.jsx            # Racha de productividad (ultimos 7 dias)
│   └── TaskMapWidget.jsx           # Visualizacion de tareas con ubicacion
│
└── utils/
    └── calendar.js                 # Generador de archivos .ics para exportacion
```

**Total: 25 componentes, 3 custom hooks, 1 context, 1 utilidad.**

---

## 16. Tabla de hooks de React utilizados

| Hook | Donde se usa | Para que |
|------|-------------|----------|
| `useState` | Toda la app (App, AddTaskInput, TopNav, TaskDetailModal, PomodoroWidget, SearchBar...) | Manejar estado local: tareas, formularios, timers, UI toggles |
| `useEffect` | useLocalStorage, PomodoroWidget, UndoToast, AddTaskInput | Side effects: persistencia en localStorage, setInterval para timers, setTimeout para auto-dismiss, auto-focus en inputs |
| `useRef` | useLocalStorage, TaskDetailModal, PomodoroWidget, AddTaskInput | Referencias al DOM (input focus, modal click outside, file input) y control de primer render (isFirstRender) |
| `useMemo` | App.jsx (filtros y ordenamiento), StatsPanel (calculo de estadisticas), TaskItem (countdown), StreakWidget (calculo de racha) | Memorizar calculos costosos para no recalcular en cada render |
| `useCallback` | App.jsx (funciones de manejo de tareas), PomodoroWidget (toggleTimer, resetTimer) | Memorizar funciones para que los componentes hijos no se re-rendericen innecesariamente |
| `useContext` | useTheme() - usado en practicamente todos los componentes | Acceder al tema (light/dark) desde cualquier nivel del arbol de componentes sin prop drilling |
| `createContext` | ThemeContext.jsx | Crear el contexto de tema que el Provider distribuye |

---

## 17. Material de referencia en el escritorio

Durante el desarrollo guarde material de referencia visual en mi escritorio:

| Archivo | Que es |
|---------|--------|
| `~/Desktop/inspi.png` | Captura de referencia de diseno que use como inspiracion general |
| `~/Desktop/inspiraciones/` | Carpeta con capturas de pantalla de apps y disenos que me gustaban (interfaces iOS, dashboards, iOS Calendar) |
| `~/Desktop/Captura de pantalla 2026-03-10 a la(s) 2.54.22 p.m..png` | Captura del progreso del proyecto durante el desarrollo |
| `~/Desktop/inspiraciones/17 de marzo de 2026.png` | Referencia de diseno guardada durante la fase final |
| `~/Desktop/inspiraciones/Captura de pantalla 2026-03-17 a la(s) 3.06.32 p.m..png` | Captura del estado final del proyecto |

Estas imagenes las usaba para comparar mi resultado con las referencias y para darle feedback mas preciso a Claude sobre que cambiar.

---

## 18. Conclusion

Este proyecto fue desarrollado usando Claude Code como herramienta de asistencia a lo largo de un proceso iterativo que incluyo: planificacion con writing-plans, generacion de ideas con brainstorming, implementacion con skills de React y diseno, revision visual en el navegador, testing manual con datos de prueba, y commits progresivos.

Las decisiones de diseno (inspiracion iOS, iOS Calendar para el modal, categorias como modulos, seleccion de widgets) fueron mias. La investigacion visual fue mia (capturas, inspiraciones, comparaciones). El criterio de que se veia bien y que no fue mio (por eso hubo tantas iteraciones).

Claude Code fue el par de manos que escribia el codigo, pero la direccion del proyecto, las decisiones de producto, la seleccion de ideas, y la validacion visual fueron trabajo humano. Usar IA para programar no es "copiar de internet". Es una herramienta mas, como usar Stack Overflow, Copilot, o preguntarle a un companero. Lo que importa es entender lo que se construyo y poder defenderlo.
