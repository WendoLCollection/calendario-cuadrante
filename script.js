// ********************************************************************************************************************************************************************************************************************************************
// --- 1. SELECCIÓN DE ELEMENTOS DEL HTML ---
// ********************************************************************************************************************************************************************************************************************************************

// Conectamos el JavaScript con los elementos del HTML para poder manipularlos.
// Imagina que son los mandos a distancia para controlar la tele (que es el HTML).
const monthDisplay = document.getElementById('current-month-display');
const calendarGrid = document.getElementById('calendar-grid');
const prevMonthButton = document.getElementById('prev-month-button');
const nextMonthButton = document.getElementById('next-month-button');
const settingsButton = document.getElementById('settings-button');
const backToCalendarButton = document.getElementById('back-to-calendar-button');
const calendarView = document.getElementById('calendar-view');
const settingsView = document.getElementById('settings-view');
const shiftsListView = document.getElementById('shifts-list-view');
const shiftFormView = document.getElementById('shift-form-view');
const menuItemShifts = document.querySelector('.settings-menu .settings-item'); // El botón "🎨 Turnos"
const backToSettingsButton = document.getElementById('back-to-settings-button');
const addNewShiftButton = document.getElementById('add-new-shift-button');
const cancelShiftFormButton = document.getElementById('cancel-shift-form-button');
const shiftForm = document.getElementById('shift-form');
const shiftNameInput = document.getElementById('shift-name');
const shiftStartTimeInput = document.getElementById('shift-start-time');
const shiftEndTimeInput = document.getElementById('shift-end-time');
const colorSelector = document.getElementById('color-selector');
const appHeader = document.getElementById('app-header'); // <-- LÍNEA NUEVA
const shiftsListContainer = document.getElementById('shifts-list-container');
const quadrantListView = document.getElementById('quadrant-list-view');// Vistas (pantallas) de la sección de Cuadrante
const quadrantFormView = document.getElementById('quadrant-form-view');
const menuItemQuadrant = document.querySelector('.settings-menu .settings-item:nth-child(2)'); // El botón "🔄 Cuadrante"
const backToSettingsFromQuadrantButton = document.getElementById('back-to-settings-from-quadrant-button');
const addNewQuadrantButton = document.getElementById('add-new-quadrant-button');
const cancelQuadrantFormButton = document.getElementById('cancel-quadrant-form-button');
const quadrantWeeksInput = document.getElementById('quadrant-weeks');
const allQuadrantsList = document.getElementById('all-quadrants-list');
const shiftIsPaidCheckbox = document.getElementById('shift-is-paid');
const hourlyRateContainer = document.getElementById('hourly-rate-container');
const activeQuadrantDisplay = document.getElementById('active-quadrant-display');
const modalClosureSummary = document.getElementById('modal-closure-summary');
const modalWorkedDays = document.getElementById('modal-worked-days');
const modalTotalEarnings = document.getElementById('modal-total-earnings');
const overrideIsPaidCheckbox = document.getElementById('override-is-paid');
const overrideHourlyRateContainer = document.getElementById('override-hourly-rate-container');










// Paleta de 10 colores suaves para los turnos
const SHIFT_COLORS = [
    '#83c5be', '#a9d6e5', '#ffddd2', '#fde4cf', '#f0a6ca',
    '#b8c0ff', '#c8b6ff', '#ffd6a5', '#fff3b0', '#caffbf'
];




// ********************************************************************************************************************************************************************************************************************************************
// --- 2. ESTADO DE LA APLICACIÓN ---
// ********************************************************************************************************************************************************************************************************************************************

// Aquí guardamos la fecha que se está mostrando en el calendario.
// 'let' significa que su valor puede cambiar (cuando cambiemos de mes).
let currentDate = new Date();



// Esta es nuestra "base de datos" de turnos. Empezará vacía.
let shifts = [];



// Esta es nuestra "base de datos" de cuadrantes.
let quadrants = [];



// --- Base de datos en memoria y localStorage ---
let overtimeRates = [];


// --- Base de datos en memoria y localStorage ---
let vacations = [];


// --- Base de datos y estado ---
// El objeto ahora guarda { 'mes': día }, ej: { '8': 24 } para septiembre
let shiftClosures = {};


// --- crear la memoria de las excepciones: ---
let dayNotes = {}; // Guardará { 'YYYY-MM-DD': { nota, nuevoTurnoId } }



// ********************************************************************************************************************************************************************************************************************************************
// --- 3. FUNCIÓN PRINCIPAL PARA DIBUJAR EL CALENDARIO ---
// ********************************************************************************************************************************************************************************************************************************************

// Esta función es como una receta que se ejecuta cada vez que cambiamos de mes.
// --- FUNCIÓN PRINCIPAL PARA DIBUJAR EL CALENDARIO (VERSIÓN MEJORADA Y DOCUMENTADA) ---
function renderCalendar() {
    // Obtenemos el año y mes actual que se está visualizando.
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Actualizamos el título del calendario (ej: "octubre 2025").
    const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    monthDisplay.textContent = `${monthNames[month]} ${year}`;

    // Limpiamos la rejilla para dibujar el nuevo mes.
    calendarGrid.innerHTML = '';

    // Calculamos datos esenciales del mes: el día de la semana en que empieza y cuántos días tiene.
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Hacemos un ajuste para que la semana empiece en Lunes (índice 0) en lugar de Domingo.
    const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    // --- 1. Dibuja los días del MES ANTERIOR para rellenar la primera semana ---
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    // Hacemos un bucle hacia atrás desde el número de días que sobran en la primera semana.
    for (let i = startDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const date = new Date(year, month - 1, day);
        // Llamamos a nuestra función auxiliar para crear la celda.
        createDayCell(date, true); // 'true' indica que es un día "fantasma" de otro mes.
    }

    // --- 2. Dibuja los días del MES ACTUAL ---
    // Este es el bucle principal que recorre cada día del mes que estamos viendo.
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        createDayCell(date, false); // 'false' indica que es un día principal del mes actual.
    }

    // --- 3. Dibuja los días del MES SIGUIENTE para rellenar la última semana ---
    let totalCells = startDay + daysInMonth;
    let nextMonthDay = 1;
    // El bucle se ejecuta hasta que la última fila tenga 7 días.
    while (totalCells % 7 !== 0) {
        const date = new Date(year, month + 1, nextMonthDay);
        createDayCell(date, true); // 'true' indica que es un día "fantasma" de otro mes.
        totalCells++;
        nextMonthDay++;
    }
}

// --- NUEVA FUNCIÓN AUXILIAR PARA CREAR Y PINTAR CUALQUIER CELDA DE DÍA (VERSIÓN FINAL)---
/**
 * Crea y pinta una celda del calendario con la jerarquía de prioridades correcta.
 * @param {Date} date - La fecha que se va a dibujar.
 * @param {boolean} isOtherMonth - True si el día no pertenece al mes actual.
 */
function createDayCell(date, isOtherMonth) {
    // 1. --- PREPARACIÓN DE LA CELDA ---
    const dayCell = document.createElement('div');
    dayCell.classList.add('day-cell');
    if (isOtherMonth) {
        dayCell.classList.add('empty');
    }
    dayCell.dataset.date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const dayNumber = document.createElement('div');
    dayNumber.classList.add('day-number');
    dayNumber.textContent = date.getDate();

    const dayEmoticon = document.createElement('div');
    dayEmoticon.classList.add('day-emoticon');
    
    const dayShift = document.createElement('div');
    dayShift.classList.add('day-shift');

    date.setHours(0, 0, 0, 0); // Normalizamos la fecha para comparaciones seguras.

    // 2. --- OBTENCIÓN DE DATOS ---
    // Obtenemos todos los "estados" posibles del día.
    const onVacation = isDateOnVacation(date);
    const isClosure = isShiftClosureDay(date);
    const isOverridden = isDayOverridden(date);
    // 'getTurnForDate' ya sabe que un turno editado tiene prioridad, así que nos dará el turno correcto.
    const turn = getTurnForDate(date);

    // 3. --- LÓGICA DE VISUALIZACIÓN POR PRIORIDAD ---

    // Primero, decidimos el contenido principal (turno, color, etc.).
    if (turn) {
        dayShift.textContent = turn.name;
        dayCell.style.backgroundColor = turn.color;
        if (turn.isPaid) {
            dayEmoticon.textContent = '💶';
        }
        // Ponemos el texto en blanco si el fondo es oscuro.
        if (isColorDark(turn.color) && !isOtherMonth) {
            dayShift.style.color = 'white';
            dayNumber.style.color = 'white';
        }
    }

    // Ahora, aplicamos las capas de mayor prioridad POR ENCIMA.
    if (onVacation && !isOverridden) {
        // Si es vacaciones Y NO ha sido editado manualmente, mostramos el estilo de vacaciones.
        dayEmoticon.textContent = '🌴';
        dayShift.textContent = ''; // Ocultamos el texto del turno
        dayCell.style.backgroundColor = isOtherMonth ? '#e9f5db' : '#d8f3dc';
    }
    
    // El borde de cierre se añade siempre, de forma independiente.
    if (isClosure) {
        dayCell.classList.add('shift-closure-day');
    }
    
    // El icono de día editado tiene la máxima prioridad y sobreescribe a cualquier otro.
    if (isOverridden) {
        dayEmoticon.textContent = '📌';
    }

// --- LÓGICA PARA RESALTAR EL DÍA ACTUAL ---
const today = new Date();
today.setHours(0, 0, 0, 0); // Normalizamos la fecha de hoy para una comparación exacta

// Si la fecha de la celda que estamos dibujando es igual a la de hoy...
if (date.getTime() === today.getTime()) {
    dayNumber.classList.add('today'); // ...le añadimos la clase 'today'.
}
   
    // La marca del domingo se añade al final.
    if (date.getDay() === 0) {
        dayNumber.classList.add('sunday-text');
    }
    
    // 4. --- MONTAJE FINAL ---
    dayCell.appendChild(dayNumber);
    dayCell.appendChild(dayEmoticon);
    dayCell.appendChild(dayShift);
    
    calendarGrid.appendChild(dayCell);
}



// --- FUNCIÓN "MÁQUINA DEL TIEMPO" PARA CALCULAR EL TURNO DE UN DÍA ---

/**
 * La "máquina del tiempo": calcula el turno que corresponde a una fecha específica.
 * @param {Date} date - La fecha para la que se quiere obtener el turno.
 * @returns {object|null} - El objeto del turno correspondiente, o null.
 */
function getTurnForDate(date) {
    // Creamos una clave única para la fecha en formato YYYY-MM-DD.
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const note = dayNotes[dateKey];

    // --- 1. MÁXIMA PRIORIDAD: Turnos personalizados para un día concreto ---
    // Comprobamos si existe un turno personalizado guardado en las notas de ese día.
    if (note && note.overrideShift) {
        // Si existe, lo devolvemos inmediatamente, ignorando todo lo demás.
        return note.overrideShift;
    }

    // --- 2. PRIORIDAD MEDIA: Lógica de Cuadrantes (si no hay turno personalizado) ---
    const candidateQuadrants = quadrants.filter(q => new Date(q.startDate + 'T00:00:00') <= date);
    if (candidateQuadrants.length === 0) {
        return null; // No hay cuadrantes que apliquen, no hay turno.
    }

    // De los posibles cuadrantes, buscamos el más reciente.
    candidateQuadrants.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const governingQuadrant = candidateQuadrants[0];

    // Calculamos los días transcurridos para saber en qué semana del ciclo estamos.
    const startDate = new Date(governingQuadrant.startDate + 'T00:00:00');
    const diffTime = date - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const weekOfCycle = Math.floor(diffDays / 7) % governingQuadrant.weeks;
    const dayOfWeek = date.getDay();
    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = dayNames[dayOfWeek];

    // Buscamos el ID del turno en el patrón del cuadrante.
    const turnId = governingQuadrant.patterns[weekOfCycle][dayName];

    // --- 3. Devolvemos el turno encontrado ---
    if (turnId === 'REST') {
        return { name: 'Descanso', color: '#f0f2f5' };
    } else {
        // Buscamos la información completa del turno en nuestra lista de turnos.
        const foundShift = shifts.find(s => s.id === Number(turnId));
        // Si no lo encuentra (porque fue borrado), devolvemos un turno de "error".
        return foundShift ? foundShift : { name: 'TURNO BORRADO', color: '#ff8fa3' };
    }
}


/**
 * Calcula el turno BASE de un día, basándose únicamente en el cuadrante.
 * Esta función es crucial porque ignora cualquier modificación manual que se haya hecho.
 * @param {Date} date - La fecha para la que se quiere obtener el turno base.
 * @returns {object|null} - El objeto del turno original del cuadrante, o null.
 */
function getBaseTurnForDate(date) {
    // Esta función es una copia de getTurnForDate, pero sin la parte que revisa las notas del día (dayNotes).
    const candidateQuadrants = quadrants.filter(q => new Date(q.startDate + 'T00:00:00') <= date);
    if (candidateQuadrants.length === 0) return null;

    candidateQuadrants.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const governingQuadrant = candidateQuadrants[0];

    const startDate = new Date(governingQuadrant.startDate + 'T00:00:00');
    const diffTime = date - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const weekOfCycle = Math.floor(diffDays / 7) % governingQuadrant.weeks;
    const dayOfWeek = date.getDay();
    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = dayNames[dayOfWeek];

    const turnId = governingQuadrant.patterns[weekOfCycle][dayName];

    if (turnId === 'REST') {
        return { name: 'Descanso', color: '#f0f2f5', startTime: '', endTime: '', isPaid: false };
    } else {
        const foundShift = shifts.find(s => s.id === Number(turnId));
        // Devolvemos una copia para evitar modificar el original por accidente.
        return foundShift ? { ...foundShift } : { name: 'TURNO BORRADO', color: '#ff8fa3' };
    }
}

// --- FUNCIÓN PARA COMPROBAR SI UNA FECHA ESTÁ EN VACACIONES ---
function isDateOnVacation(date) {
    // 'some' comprueba si al menos un periodo de vacaciones cumple la condición
    return vacations.some(vac => {
        const startDate = new Date(vac.startDate + 'T00:00:00');
        const endDate = new Date(vac.endDate + 'T00:00:00');
        return date >= startDate && date <= endDate;
    });
}



// --- FUNCIÓN PARA PINTAR LA LISTA DE TURNOS ---
function renderShiftsList() {
    const shiftsListContainer = document.getElementById('shifts-list-container');
    
    // 1. Limpiamos la lista actual para no duplicar turnos
    shiftsListContainer.innerHTML = '';

    // 2. Si no hay turnos, mostramos un mensaje
    if (shifts.length === 0) {
        shiftsListContainer.innerHTML = '<p class="empty-list-message">Aún no has creado ningún turno.</p>';
        return; // Salimos de la función
    }

    // 3. Recorremos la lista de turnos y creamos el HTML para cada uno
    shifts.forEach(shift => {
        // Creamos el contenedor principal del turno
        const shiftItem = document.createElement('div');
        shiftItem.classList.add('shift-item');

        // Generamos el HTML interno del turno (esto es como nuestro ejemplo del HTML)
        shiftItem.innerHTML = `
            <div class="shift-color-bar" style="background-color: ${shift.color || '#ddd'};"></div>
            <div class="shift-content">
                <div class="shift-name">
                    ${shift.name}
                    ${shift.isPaid ? '<span class="shift-indicator">💶</span>' : ''}
                </div>
                <div class="shift-hours">(${shift.startTime} - ${shift.endTime})</div>
            </div>
            <div class="shift-actions">
                <button class="action-button edit" data-shift-id="${shift.id}">Editar</button>
                <button class="action-button delete" data-shift-id="${shift.id}">Eliminar</button>
            </div>
        `;
        
        // 4. Añadimos el turno recién creado a la lista en la pantalla
        shiftsListContainer.appendChild(shiftItem);
    });
}


// --- FUNCIONES PARA GUARDAR Y CARGAR EN localStorage ---

// --- FUNCIÓN PARA RELLENAR EL FORMULARIO DE CUADRANTE ---
function populateQuadrantForm(weekCount) {
    const weekPatternSelector = document.getElementById('week-pattern-selector');
    weekPatternSelector.innerHTML = ''; // Limpiamos el contenido
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    // Hacemos un bucle para cada semana que necesitemos dibujar
    for (let i = 0; i < weekCount; i++) {
        // Añadimos un título para cada semana
        const weekTitle = document.createElement('h3');
        weekTitle.textContent = `Semana ${i + 1}`;
        weekPatternSelector.appendChild(weekTitle);

        daysOfWeek.forEach(day => {
            const dayRow = document.createElement('div');
            dayRow.classList.add('week-day-pattern');

            // Creamos las opciones del selector: "Descanso" + los turnos creados
            let optionsHTML = '<option value="REST">Descanso</option>';
            shifts.forEach(shift => {
                optionsHTML += `<option value="${shift.id}">${shift.name}</option>`;
            });

				dayRow.innerHTML = `
					<label class="${day === 'Domingo' ? 'sunday-text' : ''}">${day}</label>
					<select data-week="${i}" data-day="${day.toLowerCase()}">
						${optionsHTML}
					</select>
				`;
            weekPatternSelector.appendChild(dayRow);
        });
    }
}

// --- FUNCIONES PARA GUARDAR Y CARGAR EN localStorage ---

function saveShifts() {
    // Convertimos la lista de turnos a texto y la guardamos en localStorage
    localStorage.setItem('calendarAppData', JSON.stringify(shifts));
}


function loadShifts() {
    // Leemos los datos guardados desde localStorage
    const savedData = localStorage.getItem('calendarAppData');

    // Si hay datos guardados...
    if (savedData) {
        // ...los convertimos de texto a nuestra lista de turnos
        shifts = JSON.parse(savedData);
    }
    // Si no hay nada, la lista 'shifts' seguirá siendo el array vacío que definimos al principio.
}

function saveQuadrants() {
    localStorage.setItem('calendarAppData_quadrants', JSON.stringify(quadrants));
}

function loadQuadrants() {
    const savedData = localStorage.getItem('calendarAppData_quadrants');
    if (savedData) {
        quadrants = JSON.parse(savedData);
    }
}

// --- FUNCIONES PARA GUARDAR Y CARGAR LAS NOTAS/EXCEPCIONES DIARIAS ---

/**
 * Guarda el objeto 'dayNotes' en el localStorage del navegador.
 * Primero lo convierte a un formato de texto (JSON) para poder guardarlo.
 */
function saveDayNotes() {
    localStorage.setItem('calendarAppData_dayNotes', JSON.stringify(dayNotes));
}

/**
 * Carga las notas guardadas desde el localStorage cuando se inicia la aplicación.
 * Si encuentra datos, los convierte de texto de vuelta a un objeto JavaScript.
 */
function loadDayNotes() {
    const savedData = localStorage.getItem('calendarAppData_dayNotes');
    if (savedData) {
        dayNotes = JSON.parse(savedData);
    }
}




function renderQuadrantsList() {
    const allQuadrantsList = document.getElementById('all-quadrants-list');
    const activeQuadrantDisplay = document.getElementById('active-quadrant-display');
    allQuadrantsList.innerHTML = '';
    activeQuadrantDisplay.innerHTML = '';

    // --- Lógica CORREGIDA para encontrar el cuadrante activo HOY ---
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Eliminamos la hora para comparar solo fechas

    const candidateQuadrants = quadrants.filter(q => new Date(q.startDate + 'T00:00:00') <= today);
    let activeQuadrant = null;

    if (candidateQuadrants.length > 0) {
        candidateQuadrants.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        activeQuadrant = candidateQuadrants[0];
    }
    
    // --- Lógica para mostrar el cuadrante activo ---
	if (activeQuadrant) {
		const startDate = new Date(activeQuadrant.startDate + 'T00:00:00');
		const formattedDate = startDate.toLocaleDateString('es-ES', {
			day: 'numeric', month: 'long', year: 'numeric'
		});
		activeQuadrantDisplay.innerHTML = `
			<div class="quadrant-info-card"> 
				<div class="quadrant-date">Inicia el ${formattedDate}</div>
			</div>
			<div class="quadrant-actions active-quadrant-buttons"> <button class="action-button edit" data-quadrant-id="${activeQuadrant.id}">Editar</button>
				<button class="action-button delete" data-quadrant-id="${activeQuadrant.id}">Eliminar</button>
			</div>`;
	} else {
        activeQuadrantDisplay.innerHTML = '<p class="empty-list-message">Ningún cuadrante activo para la fecha de hoy.</p>';
    }

    // --- Lógica para mostrar la lista de todos los cuadrantes ---
    if (quadrants.length === 0) {
        allQuadrantsList.innerHTML = '<p class="empty-list-message">No has creado ningún cuadrante.</p>';
        return;
    }

    quadrants.forEach(quad => {
        // No mostramos el cuadrante activo en la lista de abajo
        if (activeQuadrant && quad.id === activeQuadrant.id) return;

        const quadrantItem = document.createElement('div');
        quadrantItem.classList.add('quadrant-item');

        const startDate = new Date(quad.startDate + 'T00:00:00');
        const formattedDate = startDate.toLocaleDateString('es-ES', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        quadrantItem.innerHTML = `
            <div class="quadrant-info">
                <div class="quadrant-date">Inicia el ${formattedDate}</div>
            </div>
            <div class="quadrant-actions">
                <button class="action-button edit" data-quadrant-id="${quad.id}">Editar</button>
                <button class="action-button delete" data-quadrant-id="${quad.id}">Eliminar</button>
            </div>
        `;
        allQuadrantsList.appendChild(quadrantItem);
    });
}



// --- FUNCIÓN PARA CREAR LOS CÍRCULOS DE COLORES EN EL FORMULARIO ---
function renderColorSelector() {
    const colorSelector = document.getElementById('color-selector');
    colorSelector.innerHTML = ''; // Limpiamos por si acaso

    SHIFT_COLORS.forEach(color => {
        const colorDot = document.createElement('div');
        colorDot.classList.add('color-dot');
        colorDot.style.backgroundColor = color;
        colorDot.dataset.color = color; // Guardamos el color en un atributo
        colorSelector.appendChild(colorDot);
    });
}


// --- FUNCIÓN PARA RELLENAR EL SELECTOR DE HORAS EXTRAS ---
/**
 * Rellena un menú desplegable (select) con las tarifas de horas extras.
 * @param {string} selectorId - El ID del elemento <select> que se quiere rellenar.
 */
function populateOvertimeSelector(selectorId) {
    const overtimeSelector = document.getElementById(selectorId);
    if (!overtimeSelector) return; // Si no encuentra el selector, no hace nada.

    overtimeSelector.innerHTML = ''; // Limpiamos opciones anteriores.

    if (overtimeRates.length === 0) {
        overtimeSelector.innerHTML = '<option value="">No hay tarifas creadas</option>';
        return;
    }

    overtimeRates.forEach(rate => {
        const option = document.createElement('option');
        option.value = rate.id; // Guardamos el ID como valor.
        option.textContent = `${rate.name} (${rate.price}€/h)`; // Mostramos el texto.
        overtimeSelector.appendChild(option);
    });
}

// --- FUNCIONES DE CÁLCULO PARA LA MODAL ---
function calculateTotalHours(startTime, endTime) {
    if (!startTime || !endTime) return 'N/A';
    
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    
    let diff = end - start;
    // Si la hora de fin es anterior a la de inicio, significa que el turno cruza la medianoche
    if (diff < 0) { 
        diff += 24 * 60 * 60 * 1000; // Añadimos 24 horas en milisegundos
    }
    
    const hours = diff / (1000 * 60 * 60);
    return `${hours.toFixed(2)}h`;
}

function calculateEarnings(turn) {
    if (!turn || !turn.isPaid || !turn.overtimeRateId) return '0.00€';
    
    const rate = overtimeRates.find(r => r.id === Number(turn.overtimeRateId));
    if (!rate) return 'Tarifa no encontrada';
    
    const hoursStr = calculateTotalHours(turn.startTime, turn.endTime);
    // Extraemos solo el número de las horas (ej: de "8.00h" coge 8.00)
    const hours = parseFloat(hoursStr);
    
    if (isNaN(hours)) return 'N/A';

    const earnings = hours * rate.price;
    return `${earnings.toFixed(2)}€`;
}




// ********************************************************************************************************************************************************************************************************************************************
// --- 4. EVENTOS DE CLICK (INTERACTIVIDAD) ---
// ********************************************************************************************************************************************************************************************************************************************

// Le decimos al programa qué hacer cuando el usuario hace clic en los botones.

// Clic en el botón de mes anterior
prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1); // Resta un mes a la fecha
    renderCalendar(); // Y vuelve a dibujar el calendario
});

// Clic en el botón de mes siguiente
nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1); // Suma un mes a la fecha
    renderCalendar(); // Y vuelve a dibujar el calendario
});

// Clic en el nombre del mes (para volver al día de hoy)
monthDisplay.addEventListener('click', () => {
    currentDate = new Date(); // Reinicia la fecha a la actual
    renderCalendar(); // Y vuelve a dibujar el calendario
});





// ********************************************************************************************************************************************************************************************************************************************
// --- 5. LLAMADA INICIAL ---
// ********************************************************************************************************************************************************************************************************************************************

loadShifts();
loadQuadrants();
loadOvertimeRates();
loadVacations();
loadShiftClosures();
loadDayNotes();


renderShiftsList();
renderQuadrantsList();
renderColorSelector();
renderCalendar();



// ********************************************************************************************************************************************************************************************************************************************
// --- 6. NAVEGACIÓN ENTRE PANTALLAS ---
// ********************************************************************************************************************************************************************************************************************************************

// Evento para cuando se hace clic en el botón de ajustes (rueda ⚙️)
settingsButton.addEventListener('click', () => {
	appHeader.classList.add('hidden'); 
    // Ocultamos la vista del calendario
    calendarView.classList.add('hidden');
    // Mostramos la vista de ajustes
    settingsView.classList.remove('hidden');
});

// Evento para cuando se hace clic en el botón de volver (flecha ←)
backToCalendarButton.addEventListener('click', () => {
	appHeader.classList.remove('hidden');
    // Ocultamos la vista de ajustes
    settingsView.classList.add('hidden');
    // Mostramos la vista del calendario
    calendarView.classList.remove('hidden');
});



// ********************************************************************************************************************************************************************************************************************************************
// --- 7. NAVEGACIÓN DE LA SECCIÓN DE TURNOS ---
// ********************************************************************************************************************************************************************************************************************************************

// Evento para cuando se hace clic en "🎨 Turnos" en el menú de ajustes
menuItemShifts.addEventListener('click', () => {
    settingsView.classList.add('hidden');      // Oculta el menú de ajustes
    shiftsListView.classList.remove('hidden'); // Muestra la lista de turnos
});

// Evento para el botón de volver (←) desde la lista de turnos hacia el menú
backToSettingsButton.addEventListener('click', () => {
    shiftsListView.classList.add('hidden');   // Oculta la lista de turnos
    settingsView.classList.remove('hidden');  // Muestra el menú de ajustes
});

// Evento para el botón flotante (+) para ir al formulario de añadir turno
addNewShiftButton.addEventListener('click', () => {
	populateOvertimeSelector('shift-hourly-rate');
    shiftsListView.classList.add('hidden');   // Oculta la lista de turnos
    shiftFormView.classList.remove('hidden'); // Muestra el formulario
});

// Evento para el botón de volver (←) desde el formulario hacia la lista de turnos
cancelShiftFormButton.addEventListener('click', () => {
    shiftFormView.classList.add('hidden');    // Oculta el formulario
    shiftsListView.classList.remove('hidden');// Muestra la lista de turnos
});



// ********************************************************************************************************************************************************************************************************************************************
// --- 8. LÓGICA DEL FORMULARIO DE TURNOS ---
// ********************************************************************************************************************************************************************************************************************************************

shiftForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const shiftId = document.getElementById('shift-id-input').value;

    // Recogemos los datos del formulario
    const selectedColorDot = colorSelector.querySelector('.color-dot.selected');
    const shiftColor = selectedColorDot ? selectedColorDot.dataset.color : SHIFT_COLORS[0];
    
	const shiftData = {
		name: shiftNameInput.value,
		startTime: shiftStartTimeInput.value,
		endTime: shiftEndTimeInput.value,
		color: shiftColor,
		comments: document.getElementById('shift-comments').value,
		isPaid: shiftIsPaidCheckbox.checked,
		// Si la casilla está marcada, guardamos el ID de la tarifa. Si no, guardamos null.
		overtimeRateId: shiftIsPaidCheckbox.checked ? document.getElementById('shift-hourly-rate').value : null
	};

    if (shiftId) {
        // --- MODO EDICIÓN ---
        // Si hay un ID, actualizamos el turno existente
        shifts = shifts.map(shift => {
            if (shift.id === Number(shiftId)) {
                return { ...shift, ...shiftData }; // Combina el ID antiguo con los datos nuevos
            }
            return shift;
        });
    } else {
        // --- MODO AÑADIR ---
        // Si no hay ID, creamos un turno nuevo
        const newShift = {
            id: Date.now(),
            ...shiftData
        };
        shifts.push(newShift);
    }

    saveShifts(); // Guardamos en localStorage
    renderShiftsList(); // Repintamos la lista
	renderCalendar(); 
    
    // Limpiamos y reseteamos el formulario para la próxima vez
    shiftForm.reset();
	hourlyRateContainer.classList.add('hidden');
    document.getElementById('shift-id-input').value = '';
    document.getElementById('shift-form-title').textContent = 'Añadir Turno';
    const allDots = colorSelector.querySelectorAll('.color-dot');
    allDots.forEach(dot => dot.classList.remove('selected'));

    // Volvemos a la lista
    shiftFormView.classList.add('hidden');
    shiftsListView.classList.remove('hidden');
});




// ********************************************************************************************************************************************************************************************************************************************
// --- 9. LÓGICA DEL SELECTOR DE COLOR ---
// ********************************************************************************************************************************************************************************************************************************************

colorSelector.addEventListener('click', (event) => {
    // Nos aseguramos de que se ha hecho clic en un círculo de color
    if (event.target.classList.contains('color-dot')) {
        // Quitamos la selección de cualquier otro círculo
        const allDots = colorSelector.querySelectorAll('.color-dot');
        allDots.forEach(dot => dot.classList.remove('selected'));

        // Añadimos la clase 'selected' solo al que hemos pulsado
        event.target.classList.add('selected');
    }
});





// ********************************************************************************************************************************************************************************************************************************************
// --- 10. LÓGICA PARA EDITAR Y ELIMINAR TURNOS ---
// ********************************************************************************************************************************************************************************************************************************************

shiftsListContainer.addEventListener('click', (event) => {
    // Primero, comprobamos si el elemento pulsado es un botón de "Eliminar"
    if (event.target.classList.contains('delete')) {

        // Pedimos confirmación al usuario para evitar borrados accidentales
        const wantsToDelete = confirm('¿Estás seguro de que quieres eliminar este turno?');

        // Si el usuario no confirma, no hacemos nada más
        if (!wantsToDelete) {
            return;
        }

        // Obtenemos el ID del turno desde la "etiqueta" que pusimos antes
        const shiftIdToDelete = Number(event.target.dataset.shiftId);

        // Filtramos la lista de turnos: nos quedamos solo con los que NO tengan ese ID
        shifts = shifts.filter(shift => shift.id !== shiftIdToDelete);

        // Guardamos la nueva lista (ya sin el turno borrado) en localStorage
        saveShifts();

        // Volvemos a pintar la lista en la pantalla para que se vea el cambio
        renderShiftsList();
    } // SI NO, si el botón es de "Editar"
        else if (event.target.classList.contains('edit')) {
        const shiftIdToEdit = Number(event.target.dataset.shiftId);
        
        // Buscamos el turno completo en nuestra lista usando su ID
        const shiftToEdit = shifts.find(shift => shift.id === shiftIdToEdit);

		if (shiftToEdit) {
			populateOvertimeSelector('shift-hourly-rate');
			// Rellenamos el formulario...
			// ... (justo después de la línea 'shift-is-paid').checked = shiftToEdit.isPaid; )

			// Mostramos el selector y seleccionamos la opción correcta si aplica
			if (shiftToEdit.isPaid) {
				hourlyRateContainer.classList.remove('hidden');
				document.getElementById('shift-hourly-rate').value = shiftToEdit.overtimeRateId;
			} else {
				hourlyRateContainer.classList.add('hidden');
			}

			// Marcamos el color correcto...
			// ... (el resto del código)
            document.getElementById('shift-id-input').value = shiftToEdit.id;
            shiftNameInput.value = shiftToEdit.name;
            shiftStartTimeInput.value = shiftToEdit.startTime;
            shiftEndTimeInput.value = shiftToEdit.endTime;
            document.getElementById('shift-comments').value = shiftToEdit.comments;
            document.getElementById('shift-is-paid').checked = shiftToEdit.isPaid;

            // Marcamos el color correcto
            const allDots = colorSelector.querySelectorAll('.color-dot');
            allDots.forEach(dot => {
                dot.classList.remove('selected');
                if (dot.dataset.color === shiftToEdit.color) {
                    dot.classList.add('selected');
                }
            });

            // Cambiamos el título del formulario y navegamos a él
            document.getElementById('shift-form-title').textContent = 'Editar Turno';
            shiftsListView.classList.add('hidden');
            shiftFormView.classList.remove('hidden');
        }
		}
});


// ********************************************************************************************************************************************************************************************************************************************
// --- 11. NAVEGACIÓN DE LA SECCIÓN DE CUADRANTE ---
// ********************************************************************************************************************************************************************************************************************************************

// Evento para cuando se hace clic en "🔄 Cuadrante" en el menú de ajustes
menuItemQuadrant.addEventListener('click', () => {
    settingsView.classList.add('hidden');
    quadrantListView.classList.remove('hidden');
});

// Evento para el botón de volver (←) desde la lista de cuadrantes
backToSettingsFromQuadrantButton.addEventListener('click', () => {
    quadrantListView.classList.add('hidden');
    settingsView.classList.remove('hidden');
});

// Evento para el botón "+ Añadir nuevo cuadrante"
addNewQuadrantButton.addEventListener('click', () => {
    // Leemos el valor por defecto (3) del campo y dibujamos ese número de semanas
    populateQuadrantForm(quadrantWeeksInput.value); // <-- LÍNEA MODIFICADA
    quadrantListView.classList.add('hidden');
    quadrantFormView.classList.remove('hidden');
});

// Evento para el botón de volver (←) desde el formulario de cuadrante
cancelQuadrantFormButton.addEventListener('click', () => {
    quadrantFormView.classList.add('hidden');
    quadrantListView.classList.remove('hidden');
});

// Evento que se dispara cada vez que cambia el valor del campo de semanas
quadrantWeeksInput.addEventListener('input', () => {
    const weekCount = quadrantWeeksInput.value;
    if (weekCount > 0 && weekCount <= 52) { // Ponemos un límite para no colapsar el navegador
        populateQuadrantForm(weekCount);
    }
});


// ********************************************************************************************************************************************************************************************************************************************
// --- 12. LÓGICA DEL FORMULARIO DE CUADRANTE ---
// ********************************************************************************************************************************************************************************************************************************************

const quadrantForm = document.getElementById('quadrant-form');
quadrantForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // --- INICIO DE LA VALIDACIÓN ---
    const startDateValue = document.getElementById('quadrant-start-date').value;
    const quadrantId = document.getElementById('quadrant-id-input').value;

    // Buscamos si algún OTRO cuadrante ya usa la misma fecha de inicio.
    // La condición 'quad.id !== Number(quadrantId)' es para ignorar el cuadrante que estamos editando.
    const isDuplicateDate = quadrants.some(
        quad => quad.startDate === startDateValue && quad.id !== Number(quadrantId)
    );

    // Si encontramos una fecha duplicada, mostramos un aviso y paramos.
    if (isDuplicateDate) {
        alert('¡Atención! Ya existe otro cuadrante que empieza en la misma fecha. Por favor, elige otra.');
        return; // Detenemos el proceso de guardado aquí mismo.
    }
    // --- FIN DE LA VALIDACIÓN ---

    // (El resto del código de guardado sigue igual)
    const weekCount = quadrantWeeksInput.value;
    const patterns = [];

    for (let i = 0; i < weekCount; i++) {
        const weekPattern = {};
        const weekSelectors = quadrantForm.querySelectorAll(`#week-pattern-selector select[data-week="${i}"]`);
        weekSelectors.forEach(select => {
            weekPattern[select.dataset.day] = select.value;
        });
        patterns.push(weekPattern);
    }

    const quadrantData = {
        startDate: startDateValue,
        weeks: weekCount,
        patterns: patterns
    };

    if (quadrantId) {
        // MODO EDICIÓN
        quadrants = quadrants.map(quad => {
            if (quad.id === Number(quadrantId)) {
                return { ...quad, ...quadrantData };
            }
            return quad;
        });
    } else {
        // MODO AÑADIR
        const newQuadrant = { id: Date.now(), ...quadrantData };
        quadrants.push(newQuadrant);
    }

    saveQuadrants();
    renderQuadrantsList();
    renderCalendar(); 
	
	
    quadrantForm.reset();
    document.getElementById('quadrant-id-input').value = '';
    document.getElementById('quadrant-form-title').textContent = 'Añadir Cuadrante';

    quadrantFormView.classList.add('hidden');
    quadrantListView.classList.remove('hidden');
});


// ********************************************************************************************************************************************************************************************************************************************
// --- 13. LÓGICA PARA EDITAR Y ELIMINAR CUADRANTES ---
// ********************************************************************************************************************************************************************************************************************************************

allQuadrantsList.addEventListener('click', (event) => {
    // Comprobamos si se ha pulsado un botón de "Eliminar"
    if (event.target.classList.contains('delete')) {
        const wantsToDelete = confirm('¿Estás seguro de que quieres eliminar este cuadrante?');
        if (!wantsToDelete) {
            return;
        }

        const quadrantIdToDelete = Number(event.target.dataset.quadrantId);

        // Filtramos la lista para quitar el cuadrante seleccionado
        quadrants = quadrants.filter(quad => quad.id !== quadrantIdToDelete);

        // Guardamos los cambios y repintamos la lista
        saveQuadrants();
        renderQuadrantsList();
		renderCalendar(); 
    } else if (event.target.classList.contains('edit')) {
        // --- LÓGICA DE EDICIÓN ---
        const quadrantIdToEdit = Number(event.target.dataset.quadrantId);
        const quadrantToEdit = quadrants.find(q => q.id === quadrantIdToEdit);

        if (quadrantToEdit) {
            // Rellenamos los campos básicos del formulario
            document.getElementById('quadrant-id-input').value = quadrantToEdit.id;
            document.getElementById('quadrant-start-date').value = quadrantToEdit.startDate;
            quadrantWeeksInput.value = quadrantToEdit.weeks;

            // Generamos la estructura de selectores para el número de semanas correcto
            populateQuadrantForm(quadrantToEdit.weeks);

            // Ahora, seleccionamos los turnos guardados en cada selector
            quadrantToEdit.patterns.forEach((weekPattern, weekIndex) => {
                for (const day in weekPattern) {
                    const selector = document.querySelector(`select[data-week="${weekIndex}"][data-day="${day}"]`);
                    if (selector) {
                        selector.value = weekPattern[day];
                    }
                }
            });

            // Cambiamos el título y mostramos el formulario
            document.getElementById('quadrant-form-title').textContent = 'Editar Cuadrante';
            quadrantListView.classList.add('hidden');
            quadrantFormView.classList.remove('hidden');
        }

    }
});

// Añadimos un "oyente" también para los botones del cuadrante activo
activeQuadrantDisplay.addEventListener('click', (event) => {
    const target = event.target;

    // Lógica de ELIMINAR para el cuadrante activo
    if (target.classList.contains('delete')) {
        const wantsToDelete = confirm('¿Estás seguro de que quieres eliminar el cuadrante ACTIVO?');
        if (wantsToDelete) {
            const quadrantIdToDelete = Number(target.dataset.quadrantId);
            quadrants = quadrants.filter(quad => quad.id !== quadrantIdToDelete);
            saveQuadrants();
            renderQuadrantsList();
            renderCalendar(); // Actualizamos el calendario
        }
    }

    // Lógica de EDITAR para el cuadrante activo
    if (target.classList.contains('edit')) {
        const quadrantIdToEdit = Number(target.dataset.quadrantId);
        const quadrantToEdit = quadrants.find(q => q.id === quadrantIdToEdit);
        if (quadrantToEdit) {
            // (Esta lógica es la misma que ya teníamos)
            document.getElementById('quadrant-id-input').value = quadrantToEdit.id;
            document.getElementById('quadrant-start-date').value = quadrantToEdit.startDate;
            quadrantWeeksInput.value = quadrantToEdit.weeks;
            populateQuadrantForm(quadrantToEdit.weeks);
            quadrantToEdit.patterns.forEach((weekPattern, weekIndex) => {
                for (const day in weekPattern) {
                    const selector = document.querySelector(`select[data-week="${weekIndex}"][data-day="${day}"]`);
                    if (selector) { selector.value = weekPattern[day]; }
                }
            });
            document.getElementById('quadrant-form-title').textContent = 'Editar Cuadrante';
            quadrantListView.classList.add('hidden');
            quadrantFormView.classList.remove('hidden');
        }
    }
});




function isColorDark(hexColor) {
    if (!hexColor) return false;
    const color = hexColor.substring(1); // quitamos #
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    // Fórmula de luminosidad
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
}



// ********************************************************************************************************************************************************************************************************************************************
// --- SECCIÓN 14: LÓGICA DE HORAS EXTRAS (EDICIÓN EN LÍNEA) ---
// ********************************************************************************************************************************************************************************************************************************************

// --- Elementos de la sección ---
const menuItemOvertime = document.querySelector('.settings-menu .settings-item:last-child');
const overtimeListView = document.getElementById('overtime-list-view');
const backToSettingsFromOvertimeButton = document.getElementById('back-to-settings-from-overtime-button');
const addNewOvertimeButton = document.getElementById('add-new-overtime-button');
const overtimeListContainer = document.getElementById('overtime-list-container');

// --- Funciones de guardado y carga ---
// (Asegúrate de que 'let overtimeRates = [];' está al principio del archivo en la sección 2)
function saveOvertimeRates() {
    localStorage.setItem('calendarAppData_overtime', JSON.stringify(overtimeRates));
}

function loadOvertimeRates() {
    const savedData = localStorage.getItem('calendarAppData_overtime');
    if (savedData) {
        overtimeRates = JSON.parse(savedData);
    }
}

// --- Función para "Pintar" la lista de tarifas guardadas ---
function renderOvertimeList() {
    overtimeListContainer.innerHTML = '';

    if (overtimeRates.length === 0 && !document.querySelector('.rate-item-edit')) {
        overtimeListContainer.innerHTML = '<p class="empty-list-message">No has añadido ninguna tarifa.</p>';
    } else {
        overtimeRates.forEach(rate => {
            const rateItem = document.createElement('div');
            rateItem.classList.add('rate-item');
            rateItem.innerHTML = `
                <div class="rate-content">
                    <span class="rate-name">${rate.name}</span>
                    <span class="rate-price">${rate.price}€/h</span>
                </div>
                <div class="rate-actions">
                    <button class="action-button edit-rate" data-id="${rate.id}">Editar</button>
                    <button class="action-button delete-rate" data-id="${rate.id}">Eliminar</button>
                </div>
            `;
            overtimeListContainer.appendChild(rateItem);
        });
    }
}

// --- Navegación ---
menuItemOvertime.addEventListener('click', () => {
    settingsView.classList.add('hidden');
    overtimeListView.classList.remove('hidden');
    renderOvertimeList();
});

backToSettingsFromOvertimeButton.addEventListener('click', () => {
    overtimeListView.classList.add('hidden');
    settingsView.classList.remove('hidden');
});

// --- Lógica para Añadir una nueva fila editable ---
addNewOvertimeButton.addEventListener('click', () => {
    if (document.querySelector('.rate-item-edit')) return;

    const emptyMessage = overtimeListContainer.querySelector('.empty-list-message');
    if (emptyMessage) emptyMessage.remove();

    const editItem = document.createElement('div');
    editItem.classList.add('rate-item', 'rate-item-edit');
    editItem.innerHTML = `
        <div class="rate-content-edit">
            <input type="text" class="inline-input" placeholder="Nombre de tarifa">
            <input type="number" class="inline-input price" placeholder="Precio" min="0" step="0.01">
        </div>
        <div class="rate-actions">
            <button class="action-button save-new-rate">Guardar</button>
            <button class="action-button cancel-new-rate">Cancelar</button>
        </div>
    `;
    overtimeListContainer.prepend(editItem);
});

// --- Lógica para Guardar, Editar, Eliminar y Cancelar ---
overtimeListContainer.addEventListener('click', (event) => {
    const target = event.target;
    const rateItem = target.closest('.rate-item');

    // Guardar una NUEVA tarifa
    if (target.classList.contains('save-new-rate')) {
        const nameInput = rateItem.querySelector('input[type="text"]');
        const priceInput = rateItem.querySelector('input[type="number"]');

        if (nameInput.value.trim() && priceInput.value) {
            const newRate = { id: Date.now(), name: nameInput.value.trim(), price: parseFloat(priceInput.value).toFixed(2) };
            overtimeRates.push(newRate);
            saveOvertimeRates();
            renderOvertimeList();
        } else {
            alert('Por favor, rellena el nombre y el precio.');
        }
    }

    // Cancelar la creación de una nueva tarifa
    if (target.classList.contains('cancel-new-rate')) {
        renderOvertimeList();
    }

    // ELIMINAR una tarifa existente
    if (target.classList.contains('delete-rate')) {
        const rateIdToDelete = Number(target.dataset.id);
        if (confirm('¿Estás seguro de que quieres eliminar esta tarifa?')) {
            overtimeRates = overtimeRates.filter(rate => rate.id !== rateIdToDelete);
            saveOvertimeRates();
            renderOvertimeList();
        }
    }

    // Entrar en MODO EDICIÓN
    if (target.classList.contains('edit-rate')) {
        const rateIdToEdit = Number(target.dataset.id);
        const rateToEdit = overtimeRates.find(rate => rate.id === rateIdToEdit);
        if (rateToEdit) {
            const editHTML = `
                <div class="rate-content-edit">
                    <input type="text" class="inline-input" value="${rateToEdit.name}">
                    <input type="number" class="inline-input price" value="${rateToEdit.price}" min="0" step="0.01">
                </div>
                <div class="rate-actions">
                    <button class="action-button save-edited-rate" data-id="${rateToEdit.id}">Guardar</button>
                    <button class="action-button cancel-edit-rate">Cancelar</button>
                </div>
            `;
            rateItem.innerHTML = editHTML;
            rateItem.classList.add('rate-item-edit');
        }
    }

    // GUARDAR los cambios de una edición
    if (target.classList.contains('save-edited-rate')) {
        const rateIdToSave = Number(target.dataset.id);
        const nameInput = rateItem.querySelector('input[type="text"]');
        const priceInput = rateItem.querySelector('input[type="number"]');
        
        if (nameInput.value.trim() && priceInput.value) {
            overtimeRates = overtimeRates.map(rate => {
                if (rate.id === rateIdToSave) {
                    return { ...rate, name: nameInput.value.trim(), price: parseFloat(priceInput.value).toFixed(2) };
                }
                return rate;
            });
            saveOvertimeRates();
            renderOvertimeList();
        } else {
            alert('El nombre y el precio no pueden estar vacíos.');
        }
    }

    // CANCELAR la edición
    if (target.classList.contains('cancel-edit-rate')) {
        renderOvertimeList();
    }
});





// ********************************************************************************************************************************************************************************************************************************************
// --- 15. LÓGICA DE LA CASILLA DE PAGO POR HORAS (VERSIÓN MEJORADA) ---
// ********************************************************************************************************************************************************************************************************************************************
shiftIsPaidCheckbox.addEventListener('change', () => {
    // Si el usuario marca la casilla...
    if (shiftIsPaidCheckbox.checked) {
        // ...primero comprobamos si existen tarifas de horas extras.
        if (overtimeRates.length === 0) {
            // Si no hay ninguna, mostramos un aviso y lo llevamos a la sección correspondiente.
            alert('Primero necesitas crear al menos una tarifa de hora extra. Te llevaremos a esa sección.');
            
            shiftFormView.classList.add('hidden'); // Ocultamos el formulario de turnos
            overtimeListView.classList.remove('hidden'); // Mostramos la lista de horas extras
            renderOvertimeList(); // Dibujamos la lista de horas extras
            
            // Dejamos la casilla desmarcada para evitar un estado inconsistente.
            shiftIsPaidCheckbox.checked = false;
        } else {
            // Si sí hay tarifas, simplemente mostramos el selector.
            hourlyRateContainer.classList.remove('hidden');
        }
    } else {
        // Si el usuario desmarca la casilla, ocultamos el selector.
        hourlyRateContainer.classList.add('hidden');
    }
});





// ********************************************************************************************************************************************************************************************************************************************
// --- SECCIÓN 16: LÓGICA DE VACACIONES ---
// ********************************************************************************************************************************************************************************************************************************************

// --- Elementos de la sección ---
const menuItemVacations = document.querySelector('.settings-menu .settings-item:nth-child(3)');
const vacationsListView = document.getElementById('vacations-list-view');
const backToSettingsFromVacationsButton = document.getElementById('back-to-settings-from-vacations-button');
const addNewVacationButton = document.getElementById('add-new-vacation-button');
const vacationsListContainer = document.getElementById('vacations-list-container');
const vacationFormView = document.getElementById('vacation-form-view');
const vacationForm = document.getElementById('vacation-form');
const cancelVacationFormButton = document.getElementById('cancel-vacation-form-button');



function saveVacations() {
    localStorage.setItem('calendarAppData_vacations', JSON.stringify(vacations));
}

function loadVacations() {
    const savedData = localStorage.getItem('calendarAppData_vacations');
    if (savedData) {
        vacations = JSON.parse(savedData);
    }
}

// --- Función para "Pintar" la lista de vacaciones ---
function renderVacationsList() {
    vacationsListContainer.innerHTML = '';

    if (vacations.length === 0) {
        vacationsListContainer.innerHTML = '<p class="empty-list-message">No has añadido ningún periodo de vacaciones.</p>';
        return;
    }

    vacations.forEach(vac => {
        const item = document.createElement('div');
        item.classList.add('quadrant-item'); // Reutilizamos el estilo de los items de cuadrante

        const startDate = new Date(vac.startDate + 'T00:00:00');
        const endDate = new Date(vac.endDate + 'T00:00:00');
        const formattedStart = startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        const formattedEnd = endDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

        item.innerHTML = `
            <div class="quadrant-info">
                <div class="quadrant-title">${vac.name}</div>
                <div class="quadrant-date">Del ${formattedStart} al ${formattedEnd}</div>
            </div>
            <div class="quadrant-actions">
                <button class="action-button edit" data-vacation-id="${vac.id}">Editar</button>
                <button class="action-button delete" data-vacation-id="${vac.id}">Eliminar</button>
            </div>
        `;
        vacationsListContainer.appendChild(item);
    });
}

// --- Navegación ---
menuItemVacations.addEventListener('click', () => {
    settingsView.classList.add('hidden');
    vacationsListView.classList.remove('hidden');
    renderVacationsList();
});

backToSettingsFromVacationsButton.addEventListener('click', () => {
    vacationsListView.classList.add('hidden');
    settingsView.classList.remove('hidden');
});

addNewVacationButton.addEventListener('click', () => {
    vacationForm.reset();
    document.getElementById('vacation-id-input').value = '';
    document.getElementById('vacation-form-title').textContent = 'Añadir Vacaciones';
    vacationsListView.classList.add('hidden');
    vacationFormView.classList.remove('hidden');
});

cancelVacationFormButton.addEventListener('click', () => {
    vacationFormView.classList.add('hidden');
    vacationsListView.classList.remove('hidden');
});


// --- Lógica de Guardar, Editar y Eliminar ---
vacationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const vacationId = document.getElementById('vacation-id-input').value;
    const vacationData = {
        name: document.getElementById('vacation-name').value,
        startDate: document.getElementById('vacation-start-date').value,
        endDate: document.getElementById('vacation-end-date').value
    };

    if (vacationId) { // Modo Edición
        vacations = vacations.map(vac => vac.id === Number(vacationId) ? { ...vac, ...vacationData } : vac);
    } else { // Modo Añadir
        const newVacation = { id: Date.now(), ...vacationData };
        vacations.push(newVacation);
    }

    saveVacations();
    renderVacationsList();
	renderCalendar(); 
    vacationFormView.classList.add('hidden');
    vacationsListView.classList.remove('hidden');
});

vacationsListContainer.addEventListener('click', (event) => {
    const target = event.target;

    // Lógica para Eliminar
    if (target.classList.contains('delete')) {
        const vacationId = Number(target.dataset.vacationId);
        if (confirm('¿Seguro que quieres eliminar este periodo de vacaciones?')) {
            vacations = vacations.filter(vac => vac.id !== vacationId);
            saveVacations();
            renderVacationsList();
			renderCalendar(); 
        }
    }

    // Lógica para Editar
    if (target.classList.contains('edit')) {
        const vacationId = Number(target.dataset.vacationId);
        const vacationToEdit = vacations.find(vac => vac.id === vacationId);

        if (vacationToEdit) {
            document.getElementById('vacation-id-input').value = vacationToEdit.id;
            document.getElementById('vacation-name').value = vacationToEdit.name;
            document.getElementById('vacation-start-date').value = vacationToEdit.startDate;
            document.getElementById('vacation-end-date').value = vacationToEdit.endDate;
            document.getElementById('vacation-form-title').textContent = 'Editar Vacaciones';
            vacationsListView.classList.add('hidden');
            vacationFormView.classList.remove('hidden');
        }
    }
});



// ********************************************************************************************************************************************************************************************************************************************
// --- SECCIÓN 17: LÓGICA DE CIERRE DE TURNO (VERSIÓN SIMPLE) ---
// ********************************************************************************************************************************************************************************************************************************************

// --- Elementos de la sección ---
const menuItemClosure = document.querySelector('.settings-menu .settings-item:nth-child(4)');
const shiftClosureView = document.getElementById('shift-closure-view');
const backToSettingsFromClosureButton = document.getElementById('back-to-settings-from-closure-button');
const monthlyClosureList = document.getElementById('monthly-closure-list');



function saveShiftClosures() {
    localStorage.setItem('calendarAppData_closures', JSON.stringify(shiftClosures));
}

function loadShiftClosures() {
    const savedData = localStorage.getItem('calendarAppData_closures');
    if (savedData) {
        shiftClosures = JSON.parse(savedData);
    }
}

// --- Función para "Pintar" la vista de configuración ---
function renderShiftClosureView() {
    monthlyClosureList.innerHTML = '';
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let defaultsWereSet = false;

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        const item = document.createElement('div');
        item.classList.add('month-closure-item');
        
        let dayToDisplay = shiftClosures[monthIndex];

        if (!dayToDisplay) {
            dayToDisplay = 24;
            shiftClosures[monthIndex] = 24;
            defaultsWereSet = true;
        }

        item.innerHTML = `
            <label>${monthNames[monthIndex]}</label>
            <input type="number" min="1" max="31" value="${dayToDisplay}" data-month="${monthIndex}">
        `;
        monthlyClosureList.appendChild(item);
    }

    if (defaultsWereSet) {
        saveShiftClosures();
    }
}

// --- Navegación ---
menuItemClosure.addEventListener('click', () => {
    settingsView.classList.add('hidden');
    shiftClosureView.classList.remove('hidden');
    renderShiftClosureView();
});

backToSettingsFromClosureButton.addEventListener('click', () => {
    shiftClosureView.classList.add('hidden');
    settingsView.classList.remove('hidden');
});

// --- Lógica para guardar automáticamente al cambiar un día ---
monthlyClosureList.addEventListener('input', (event) => {
    const input = event.target;
    if (input.tagName === 'INPUT') {
        const month = input.dataset.month;
        const day = input.value;

        if (day) {
            shiftClosures[month] = Number(day);
        } else {
            delete shiftClosures[month];
        }
        saveShiftClosures();
        renderCalendar();
    }
});

// --- Función de ayuda para el calendario ---
function isShiftClosureDay(date) {
    const month = date.getMonth();
    const day = date.getDate();
    return shiftClosures[month] === day;
}


/** Comprueba si un día ha sido modificado manualmente (tiene un turno o comentario guardado).*/
function isDayOverridden(date) {
    // Creamos la clave de fecha en formato 'YYYY-MM-DD'.
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const note = dayNotes[dateKey];

    // Un día se considera "editado" si existe una nota para él y esa nota
    // contiene un turno personalizado (overrideShift) o un comentario del día (dailyComment).
    return note && (note.overrideShift || (note.dailyComment && note.dailyComment.trim() !== ''));
}





// ********************************************************************************************************************************************************************************************************************************************
// --- SECCIÓN FINAL: LÓGICA PARA GESTOS TÁCTILES (SWIPE) ---
// ********************************************************************************************************************************************************************************************************************************************

let touchStartX = 0;
let touchEndX = 0;

// Escuchamos cuando el usuario empieza a tocar la rejilla del calendario
calendarGrid.addEventListener('touchstart', (event) => {
    // Guardamos la coordenada X inicial del primer dedo que toca
    touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

// Escuchamos cuando el usuario levanta el dedo de la pantalla
calendarGrid.addEventListener('touchend', (event) => {
    // Guardamos la coordenada X final
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe(); // Llamamos a la función que decide qué hacer
});

function handleSwipe() {
    const swipeThreshold = 50; // Mínimo de píxeles para considerarlo un gesto

    // Si el dedo se movió más de 50px hacia la izquierda...
    if (touchStartX - touchEndX > swipeThreshold) {
        // ...simulamos un clic en el botón de mes siguiente.
        nextMonthButton.click();
    }

    // Si el dedo se movió más de 50px hacia la derecha...
    if (touchEndX - touchStartX > swipeThreshold) {
        // ...simulamos un clic en el botón de mes anterior.
        prevMonthButton.click();
    }
}




// ===============================================================
// --- LÓGICA DE LA VENTANA MODAL (CON MODO EDICIÓN) ---
// ===============================================================

// --- Elementos de la modal ---
const dayModal = document.getElementById('day-modal');
const modalViewSection = document.getElementById('modal-view-section');
const modalEditSection = document.getElementById('modal-edit-section');
let currentEditingDate = null; // Variable para recordar qué día estamos viendo/editando



// --- Función para abrir y rellenar la modal (VERSIÓN CON PRIORIDAD CORREGIDA) ---
function openDayModal(dateStr) {
    currentEditingDate = dateStr;
    const date = new Date(dateStr + 'T00:00:00');
    
    // --- Elementos de la Modal ---
    const modalHeader = dayModal.querySelector('.modal-header');
    const modalClosureSummary = document.getElementById('modal-closure-summary');
    
    // --- Reseteo de la Modal ---
    modalClosureSummary.classList.add('hidden');
    modalHeader.classList.remove('closure-day');
    
    // Rellenamos el título
    dayModal.querySelector('#modal-date').textContent = date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // --- Búsqueda de datos ---
    const turn = getTurnForDate(date); // Esta función ya nos da el turno correcto (editado o del cuadrante)
    const onVacation = isDateOnVacation(date);
    const dayNote = dayNotes[dateStr] || {};
    const isOverridden = isDayOverridden(date);

    // Elementos de los comentarios
    const shiftCommentsDisplay = dayModal.querySelector('#modal-shift-comments-display');
    const dailyCommentsDisplay = dayModal.querySelector('#modal-daily-comments-display');
    shiftCommentsDisplay.style.display = 'none';
    dailyCommentsDisplay.style.display = 'none';

    // --- LÓGICA DE PRIORIDAD PARA RELLENAR LA MODAL ---
    
    // 1. MÁXIMA PRIORIDAD: Si el día ha sido editado manualmente.
    if (isOverridden && turn) {
        dayModal.querySelector('#modal-shift-name').textContent = turn.name;
        dayModal.querySelector('#modal-shift-time').textContent = turn.startTime && turn.endTime ? `${turn.startTime} - ${turn.endTime}` : 'Sin horario';
        dayModal.querySelector('#modal-total-hours').textContent = calculateTotalHours(turn.startTime, turn.endTime);
        dayModal.querySelector('#modal-earnings').textContent = calculateEarnings(turn);
    
    // 2. Si no, comprobamos si son vacaciones.
    } else if (onVacation) {
        dayModal.querySelector('#modal-shift-name').textContent = 'Vacaciones';
        dayModal.querySelector('#modal-shift-time').textContent = 'Día completo';
        dayModal.querySelector('#modal-total-hours').textContent = 'N/A';
        dayModal.querySelector('#modal-earnings').textContent = 'N/A';
    
    // 3. Si no, mostramos el turno del cuadrante.
    } else if (turn) {
        dayModal.querySelector('#modal-shift-name').textContent = turn.name;
        dayModal.querySelector('#modal-shift-time').textContent = turn.startTime && turn.endTime ? `${turn.startTime} - ${turn.endTime}` : 'Sin horario';
        dayModal.querySelector('#modal-total-hours').textContent = calculateTotalHours(turn.startTime, turn.endTime);
        dayModal.querySelector('#modal-earnings').textContent = calculateEarnings(turn);
        
    // 4. Si no hay nada, es un día libre.
    } else {
        dayModal.querySelector('#modal-shift-name').textContent = 'Libre';
        dayModal.querySelector('#modal-shift-time').textContent = 'Día completo';
        dayModal.querySelector('#modal-total-hours').textContent = 'N/A';
        dayModal.querySelector('#modal-earnings').textContent = 'N/A';
    }
    
    // Lógica para los comentarios (funciona para cualquier caso)
    const originalTurn = getBaseTurnForDate(date);
    if (originalTurn && originalTurn.comments) {
        shiftCommentsDisplay.textContent = `Nota del turno: ${originalTurn.comments}`;
        shiftCommentsDisplay.style.display = 'block';
    }
    if (dayNote.dailyComment) {
        dailyCommentsDisplay.textContent = `Nota del día: ${dayNote.dailyComment}`;
        dailyCommentsDisplay.style.display = 'block';
    }

    // Lógica para el resumen de cierre (funciona para cualquier caso)
    if (isShiftClosureDay(date)) {
        modalHeader.classList.add('closure-day');
        const prevClosureDate = getPreviousClosureDate(date);

        if (prevClosureDate) {
            const periodStartDate = new Date(prevClosureDate);
            periodStartDate.setDate(periodStartDate.getDate() + 1);

            const summary = calculatePeriodSummary(periodStartDate, date);
            document.getElementById('modal-worked-days').textContent = summary.workedDays;
            document.getElementById('modal-total-earnings').textContent = `${summary.totalEarnings.toFixed(2)}€`;
        } else {
            document.getElementById('modal-worked-days').textContent = 'N/A';
            document.getElementById('modal-total-earnings').textContent = 'N/A';
        }
        modalClosureSummary.classList.remove('hidden');
    }
    
    // Mostramos la modal en "modo vista"
    switchToViewMode();
    dayModal.classList.remove('hidden');
}


// --- Función para cambiar a Modo Edición ---
/**
 * Cambia la ventana modal a "Modo Edición".
 * Ahora, limpia el formulario en lugar de rellenarlo.
 */
/**
 * Cambia la ventana modal a "Modo Edición".
 * Si el día ya tiene cambios guardados, los muestra en el formulario.
 * Si no, muestra el formulario vacío.
 */
function switchToEditMode() {
    // Ocultamos la vista de información y mostramos la de edición.
    modalViewSection.classList.add('hidden');
    modalEditSection.classList.remove('hidden');

    // Rellenamos el selector de tarifas por si se necesita.
    populateOvertimeSelector('override-hourly-rate');

    // Seleccionamos los elementos del formulario.
    const nameInput = document.getElementById('override-shift-name');
    const startTimeInput = document.getElementById('override-start-time');
    const endTimeInput = document.getElementById('override-end-time');
    const isPaidCheckbox = document.getElementById('override-is-paid');
    const overtimeSelector = document.getElementById('override-hourly-rate');
    const commentTextarea = document.getElementById('modal-edit-comment');
    
    // Buscamos si existen notas o un turno personalizado para este día.
    const dayNote = dayNotes[currentEditingDate] || {};
    const overrideShift = dayNote.overrideShift;

    // --- LÓGICA MODIFICADA ---
    // Si existe un turno personalizado, rellenamos el formulario con sus datos.
    if (overrideShift) {
        nameInput.value = overrideShift.name || '';
        startTimeInput.value = overrideShift.startTime || '';
        endTimeInput.value = overrideShift.endTime || '';
        isPaidCheckbox.checked = overrideShift.isPaid || false;

        if (overrideShift.isPaid) {
            overrideHourlyRateContainer.classList.remove('hidden');
            overtimeSelector.value = overrideShift.overtimeRateId;
        } else {
            overrideHourlyRateContainer.classList.add('hidden');
        }
    } else {
        // Si no hay turno personalizado, mostramos el formulario vacío.
        nameInput.value = '';
        startTimeInput.value = '';
        endTimeInput.value = '';
        isPaidCheckbox.checked = false;
        overrideHourlyRateContainer.classList.add('hidden');
    }
    
    // Rellenamos siempre el comentario del día, si existe.
    commentTextarea.value = dayNote.dailyComment || '';

    // Cambiamos los botones del pie de página a "Guardar" y "Cancelar".
    const modalFooter = dayModal.querySelector('.modal-footer');
    modalFooter.innerHTML = `
        <button id="modal-cancel-button" class="action-button">Cancelar</button>
        <button id="modal-save-button" class="button-primary">Guardar Cambios</button>
    `;
}

// --- Función para volver a Modo Vista ---
/**
 * Cambia la ventana modal a "Modo Vista", mostrando los botones adecuados.
 */
function switchToViewMode() {
    modalViewSection.classList.remove('hidden');
    modalEditSection.classList.add('hidden');

    const modalFooter = dayModal.querySelector('.modal-footer');
    const date = new Date(currentEditingDate + 'T00:00:00');

    let footerHTML = '';
    // Si el día ha sido editado manualmente, mostramos el botón "Restablecer".
    if (isDayOverridden(date)) {
        footerHTML += `<button id="modal-reset-button" class="action-button reset">Restablecer</button>`;
    }

    // Añadimos los botones de siempre.
    footerHTML += `
        <button id="modal-edit-button" class="action-button">Editar</button>
        <button id="modal-close-button-footer" class="button-primary">Cerrar</button>
    `;

    modalFooter.innerHTML = footerHTML;
}


// --- Lógica principal de los eventos ---
calendarGrid.addEventListener('click', (event) => {
    const dayCell = event.target.closest('.day-cell');
    if (dayCell && dayCell.dataset.date) {
        openDayModal(dayCell.dataset.date);
    }
});

dayModal.addEventListener('click', (event) => {
    const target = event.target;
    // Cerrar la modal
    if (target.id === 'day-modal' || target.id === 'modal-close-button' || target.id === 'modal-close-button-footer') {
        dayModal.classList.add('hidden');
    }
	// Cambiar a modo edición
	if (target.id === 'modal-edit-button') {
		switchToEditMode();
	}
    // Cancelar la edición
    if (target.id === 'modal-cancel-button') {
        switchToViewMode();
    }

	
	
// Si se pulsa el botón "Guardar Cambios"
if (target.id === 'modal-save-button') {
    // 1. Leemos todos los datos del formulario de edición.
    const overrideName = document.getElementById('override-shift-name').value;
    const overrideStart = document.getElementById('override-start-time').value;
    const overrideEnd = document.getElementById('override-end-time').value;
    const overrideIsPaid = document.getElementById('override-is-paid').checked;
    const overrideRateId = document.getElementById('override-hourly-rate').value; // <-- Leemos la tarifa seleccionada
    const newComment = document.getElementById('modal-edit-comment').value;

    // VALIDACIÓN: Si hay un nombre de turno, las horas son obligatorias.
    if (overrideName.trim() !== '' && (!overrideStart || !overrideEnd)) {
        alert('Si introduces un nombre de turno, también debes especificar la hora de inicio y fin.');
        return;
    }

    if (!dayNotes[currentEditingDate]) {
        dayNotes[currentEditingDate] = {};
    }

    // 2. Comprobamos si se ha introducido un nombre de turno.
    if (overrideName.trim() !== '') {
        // Si hay nombre, creamos y guardamos el objeto del turno personalizado.
        dayNotes[currentEditingDate].overrideShift = {
            name: overrideName,
            startTime: overrideStart,
            endTime: overrideEnd,
            isPaid: overrideIsPaid,
            overtimeRateId: overrideIsPaid ? overrideRateId : null, // <-- GUARDAMOS la tarifa
            color: '#e0e0e0'
        };
    } else {
        delete dayNotes[currentEditingDate].overrideShift;
    }
    
    // 3. Guardamos siempre el comentario del día.
    dayNotes[currentEditingDate].dailyComment = newComment;

    // 4. Hacemos los cambios permanentes y actualizamos todo.
    saveDayNotes();
    renderCalendar();
    dayModal.classList.add('hidden');
}


// Si se pulsa el botón "Restablecer"
if (target.id === 'modal-reset-button') {
    if (confirm('¿Quieres eliminar los cambios manuales de este día y volver al turno del cuadrante?')) {
        // Borramos la nota/excepción completa para este día.
        delete dayNotes[currentEditingDate];

        saveDayNotes();      // Guardamos el cambio.
        renderCalendar();    // Actualizamos el calendario.
        dayModal.classList.add('hidden'); // Cerramos la ventana.
    }
}

});









// --- NUEVAS FUNCIONES DE CÁLCULO PARA EL CIERRE ---

/**
 * Busca la fecha del día de cierre anterior a la fecha dada.
 * @param {Date} currentClosureDate - La fecha del cierre actual.
 * @returns {Date|null} - La fecha del cierre anterior, o null si no se encuentra.
 */
function getPreviousClosureDate(currentClosureDate) {
    let prevDate = new Date(currentClosureDate);
    for (let i = 0; i < 60; i++) {
        prevDate.setDate(prevDate.getDate() - 1);
        if (isShiftClosureDay(prevDate)) {
            return prevDate;
        }
    }
    return null;
}

/**
 * Calcula los días trabajados y las ganancias totales en un rango de fechas.
 * @param {Date} startDate - Fecha de inicio del periodo.
 * @param {Date} endDate - Fecha de fin del periodo.
 * @returns {object} - Un objeto con los totales.
 */
function calculatePeriodSummary(startDate, endDate) {
    let workedDays = 0;
    let totalEarnings = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const onVacation = isDateOnVacation(currentDate);
        const turn = getTurnForDate(currentDate);
        
        if (turn && turn.name !== 'Descanso' && !onVacation) {
            workedDays++;
            const earnings = parseFloat(calculateEarnings(turn));
            if (!isNaN(earnings)) {
                totalEarnings += earnings;
            }
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return { workedDays, totalEarnings };
}



/**
 * Controla la visibilidad del selector de tarifas y auto-rellena el formulario si es necesario.
 */
overrideIsPaidCheckbox.addEventListener('change', () => {
    // Seleccionamos los campos del formulario que podríamos necesitar rellenar.
    const nameInput = document.getElementById('override-shift-name');
    const startTimeInput = document.getElementById('override-start-time');
    const endTimeInput = document.getElementById('override-end-time');

    // --- LÓGICA DE AUTO-RELLENADO ---
    // Si el usuario marca la casilla Y el campo de nombre está vacío...
    if (overrideIsPaidCheckbox.checked && nameInput.value.trim() === '') {
        // ...buscamos cuál era el turno original del cuadrante para ese día.
        const date = new Date(currentEditingDate + 'T00:00:00');
        const baseTurn = getBaseTurnForDate(date);

        // Si encontramos un turno, rellenamos el formulario con sus datos.
        if (baseTurn) {
            nameInput.value = baseTurn.name;
            startTimeInput.value = baseTurn.startTime;
            endTimeInput.value = baseTurn.endTime;
        }
    }

    // --- Lógica para mostrar/ocultar el selector de tarifas (esta ya la teníamos) ---
    if (overrideIsPaidCheckbox.checked) {
        overrideHourlyRateContainer.classList.remove('hidden');
    } else {
        overrideHourlyRateContainer.classList.add('hidden');
    }
});










