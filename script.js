
'use strict';

// ===============================================================
// --- INICIALIZACIÓN DE FIREBASE ---
// ===============================================================


const firebaseConfig = {
    apiKey: "AIzaSyBV-BVAIhoEkkhTGBzMNQGJXrFOemSdVnk",
    authDomain: "calendario-turnos-70a86.firebaseapp.com",
    projectId: "calendario-turnos-70a86",
    storageBucket: "calendario-turnos-70a86.firebasestorage.app",
    messagingSenderId: "995512515343",
    appId: "1:995512515343:web:5f370ebf7ec6931ce41c7a"
};

// Inicializamos la aplicación de Firebase
const app = firebase.initializeApp(firebaseConfig);
// Conectamos con los servicios que vamos a usar
const auth = firebase.auth();
const db = firebase.firestore();

// --- ACTIVAR LA PERSISTENCIA OFFLINE ---
// Esta orden le dice a Firebase que guarde una copia local de los datos de la nube.
db.enablePersistence({ synchronizeTabs: true })
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            // Esto suele pasar si tienes la app abierta en varias pestañas. No es un error grave.
            console.warn("La persistencia de Firebase falló, posiblemente por tener múltiples pestañas abiertas.");
        } else if (err.code == 'unimplemented') {
            // El navegador no es compatible (muy raro en navegadores modernos).
            console.warn("Este navegador no soporta el modo offline.");
        }
    });
// --- FIN DE LA ACTIVACIÓN ---


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
//const menuItemShifts = document.querySelector('.settings-menu .settings-item'); // El botón "🎨 Turnos"
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
//const menuItemQuadrant = document.querySelector('.settings-menu .settings-item:nth-child(2)'); // El botón "🔄 Cuadrante"
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

// Elementos del Menú de Ajustes 
const menuItemShifts = document.querySelector('.settings-menu .settings-item:nth-child(1)');
const menuItemQuadrant = document.querySelector('.settings-menu .settings-item:nth-child(2)');
const menuItemVacations = document.querySelector('.settings-menu .settings-item:nth-child(3)');
const menuItemClosure = document.querySelector('.settings-menu .settings-item:nth-child(4)');
const menuItemOvertime = document.querySelector('.settings-menu .settings-item:nth-child(5)');
// const menuItemInfo = document.querySelector('.settings-menu .settings-item:nth-child(6)'); // Para la futura sección "Información"

// Elementos de la Sección "Estadísticas"
const statsView = document.getElementById('stats-view');
const menuItemStats = document.querySelector('.settings-menu .settings-item:nth-child(6)');
const backToSettingsFromStatsButton = document.getElementById('back-to-settings-from-stats-button');
// Nuevos elementos del resumen mensual/anual
const summaryYearDisplay = document.getElementById('current-year-summary-display');
const prevYearSummaryBtn = document.getElementById('prev-year-summary-button');
const nextYearSummaryBtn = document.getElementById('next-year-summary-button');
const summaryModeToggle = document.getElementById('summary-mode-toggle');
const summaryResultsContainer = document.getElementById('summary-results-container');
// Elementos del Tutorial
const welcomeTutorial = document.getElementById('welcome-tutorial');
const closeTutorialButton = document.getElementById('close-tutorial-button');

const headerTitleContainer = document.getElementById('header-title-container');
const authView = document.getElementById('auth-view');
const appContainer = document.getElementById('app-container');
const backToAppFromAuthButton = document.getElementById('back-to-app-from-auth-button');

// Elementos de la pantalla de Autenticación
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

// Elementos de los formularios de Autenticación
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const loginError = document.getElementById('login-error');

const registerNameInput = document.getElementById('register-name');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');
const registerButton = document.getElementById('register-button');
const registerError = document.getElementById('register-error');

const logoutMenuButton = document.getElementById('logout-menu-button');
const rememberMeCheckbox = document.getElementById('remember-me-checkbox');
const forgotPasswordLink = document.getElementById('forgot-password-link');

const weekPatternContainer = document.getElementById('week-pattern-container');

const quadrantForm = document.getElementById('quadrant-form');

const vacationsListContainer = document.getElementById('vacations-list-container');

const infoView = document.getElementById('info-view');
const menuItemInfo = document.getElementById('menu-item-info');
const backToSettingsFromInfoButton = document.getElementById('back-to-settings-from-info-button');

const notificationsToggle = document.getElementById('notifications-toggle');



// Definimos los límites aquí para que sean fáciles de cambiar. semanal bisemanal
const WEEKLY_HOUR_LIMIT = 55;
const BIWEEKLY_HOUR_LIMIT = 95;
// Definimos los límites aquí para que sean fáciles de cambiar en el futuro. mensual anual
const MONTHLY_HOUR_LIMIT = 225;
const ANNUAL_HOUR_LIMIT = 2160;

// Paleta de 10 colores suaves para los turnos
const SHIFT_COLORS = [
    '#83c5be', '#a9d6e5', '#ffddd2', '#fde4cf', '#f0a6ca',
    '#b8c0ff', '#c8b6ff', '#ffd6a5', '#fff3b0', '#caffbf'
];



/**
 * Objeto con los festivos. El formato es 'MM-DD': 'Nombre del Festivo'.
 */
const HOLIDAYS = {
    2025: {
        '01-01': 'Año Nuevo',
        '01-06': 'Epifanía del Señor',
        '03-19': 'San José',
        '04-18': 'Viernes Santo',
        '04-21': 'Lunes de Pascua',
        '05-01': 'Fiesta del Trabajo',
        '08-15': 'Asunción de la Virgen',
        '10-09': 'Día de la Com. Valenciana',
        '10-12': 'Fiesta Nacional de España',
        '11-01': 'Todos los Santos',
        '12-06': 'Día de la Constitución',
        '12-08': 'Inmaculada Concepción',
        '12-25': 'Natividad del Señor'
    },
    2026: {
        '01-01': 'Año Nuevo',
        '01-06': 'Epifanía del Señor',
        '04-03': 'Viernes Santo',
        '05-01': 'Fiesta del Trabajo',
        '08-15': 'Asunción de la Virgen',
        '10-12': 'Fiesta Nacional de España',
        '11-01': 'Todos los Santos',
        '12-06': 'Día de la Constitución',
        '12-08': 'Inmaculada Concepción',
        '12-25': 'Natividad del Señor'
    }
};



// (Aquí están todas tus otras declaraciones de 'const'...)

// --- LÍNEA DE CORRECCIÓN ---
// Movemos la modal de conflicto al final del body para asegurar que siempre esté en el nivel superior.
//document.body.appendChild(dataConflictModal);



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


let summaryYear = new Date().getFullYear(); // Para saber qué año estamos viendo en las estadísticas
let summaryMode = 'fullMonth'; // Para saber el modo de cálculo: 'fullMonth' o 'closureToClosure'

let unsubscribeFromDataChanges = null; // Guardará la función para "apagar" el oyente



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


/**
 * Crea y pinta una celda del calendario, con el nuevo formato visual.
 * @param {Date} date - La fecha que se va a dibujar.
 * @param {boolean} isOtherMonth - True si el día no pertenece al mes actual.
 */
function createDayCell(date, isOtherMonth) {
    // 1. --- PREPARACIÓN ---
    const dayCell = document.createElement('div');
    dayCell.classList.add('day-cell');
    if (isOtherMonth) {
        dayCell.classList.add('empty');
    }
    dayCell.dataset.date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const topRow = document.createElement('div');
    topRow.classList.add('day-top-row');
    const dayNumber = document.createElement('div');
    dayNumber.classList.add('day-number');
    dayNumber.textContent = date.getDate();
    const dayEmoticon = document.createElement('div');
    dayEmoticon.classList.add('day-emoticon');
    const dayShiftName = document.createElement('div');
    dayShiftName.classList.add('day-shift-name');
    const dayShiftTime = document.createElement('div');
    dayShiftTime.classList.add('day-shift-time');

    date.setHours(0, 0, 0, 0);

    // 2. --- LÓGICA DE DATOS ---
    const onVacation = isDateOnVacation(date);
    const isClosure = isShiftClosureDay(date);
    const isOverridden = isDayOverridden(date);
    const turn = getTurnForDate(date);
    const allTurnsForDay = getAllTurnsForDate(date);
    const holidayName = isHoliday(date);

    // 3. --- LÓGICA VISUAL ---
    if (onVacation && !isOverridden) {
        // Si es vacaciones Y NO ha sido editado, mostramos el estilo de vacaciones.
        dayEmoticon.textContent = '🌴';
        dayShiftName.textContent = '';
        dayShiftTime.textContent = '';
        dayCell.style.backgroundColor = isOtherMonth ? '#e9f5db' : '#d8f3dc';

    } else if (turn) {
		
		
// --- LÓGICA CORREGIDA ---
// 1. Mostramos el nombre del primer turno y el indicador (+N) si hay más.
if (allTurnsForDay.length > 1) {
    dayShiftName.innerHTML = `${turn.name}<br><span class="multi-turn-indicator">(+${allTurnsForDay.length - 1})</span>`;
} else {
    dayShiftName.textContent = turn.name;
}

// 2. Creamos una lista de los horarios de TODOS los turnos del día.
const timeStrings = allTurnsForDay.map(t => {
    return t.startTime && t.endTime ? `${t.startTime}-${t.endTime}`:'';
});

// 3. Unimos cada horario con un salto de línea para que se muestren uno debajo del otro.
dayShiftTime.innerHTML = timeStrings.join('<br>');
	
		//dayShiftTime.textContent = turn.startTime || '';
      // dayShiftTime.textContent = turn.startTime && turn.endTime ? `${turn.startTime}-${turn.endTime}`:'';
		//dayShiftTime.innerHTML = turn.startTime && turn.endTime ? `${turn.startTime}<br>${turn.endTime}` : '';
		dayCell.style.backgroundColor = turn.color;
        if (isColorDark(turn.color) && !isOtherMonth) {
            dayCell.style.color = 'white';
        }
    }	


    // El resto de la lógica de iconos y destacados se mantiene igual
    if (turn && turn.isPaid) dayEmoticon.textContent = '💶';
    if (onVacation) dayEmoticon.textContent = '🌴';
    if (isOverridden) dayEmoticon.textContent = '📌';
    if (isClosure) dayNumber.classList.add('closure-highlight');
    if (holidayName) dayNumber.classList.add('holiday-highlight');
    if (date.getDay() === 0) dayNumber.classList.add('sunday-text');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date.getTime() === today.getTime()) {
        dayCell.classList.add('today-cell');
    }
    
    // 4. --- MONTAJE FINAL ---
    topRow.appendChild(dayNumber);
    topRow.appendChild(dayEmoticon);
    dayCell.appendChild(topRow);
    dayCell.appendChild(dayShiftName);
    dayCell.appendChild(dayShiftTime);
    calendarGrid.appendChild(dayCell);
}


// --- FUNCIÓN "MÁQUINA DEL TIEMPO" PARA CALCULAR EL TURNO DE UN DÍA ---

/**
 * La "máquina del tiempo": calcula el turno que corresponde a una fecha específica.
 * Ahora entiende la nueva estructura de múltiples turnos por día.
 * @param {Date} date - La fecha para la que se quiere obtener el turno.
 * @returns {object|null} - El objeto del primer turno correspondiente, o null.
 */
function getTurnForDate(date) {
    // Creamos la clave única para la fecha.
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const note = dayNotes[dateKey];

    // --- 1. MÁXIMA PRIORIDAD: Turnos personalizados para un día concreto ---
    if (note && note.overrideShift) {
        return note.overrideShift;
    }

    // --- 2. Lógica de Cuadrantes ---
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

    // --- LÓGICA CORREGIDA ---
    // Ahora leemos la LISTA de turnos para ese día.
    const turnIdsForDay = governingQuadrant.patterns[weekOfCycle][dayName];

    // Si no hay turnos para ese día o la lista está vacía, no hay turno.
    if (!turnIdsForDay || turnIdsForDay.length === 0) {
        return null;
    }
    
    // Para la vista del calendario, de momento solo usamos el PRIMER turno de la lista.
    const turnId = turnIdsForDay[0];

    // --- 3. Devolvemos el turno encontrado ---
    if (turnId === 'REST') {
        return { name: '', color: '#f0f2f5' };
    } else {
        const foundShift = shifts.find(s => s.id === Number(turnId));
        return foundShift ? foundShift : { name: 'TURNO BORRADO', color: '#ff8fa3' };
    }
}



/**
 * Obtiene la LISTA COMPLETA de turnos para una fecha específica.
 * @param {Date} date - La fecha para la que se quieren obtener los turnos.
 * @returns {Array<object>} - Una lista con todos los objetos de turno para ese día.
 */
function getAllTurnsForDate(date) {
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const note = dayNotes[dateKey];

    // 1. MÁXIMA PRIORIDAD: Si hay un turno personalizado, solo devolvemos ese.
    if (note && note.overrideShift) {
        return [note.overrideShift]; // Lo devolvemos dentro de una lista.
    }

    // 2. Lógica de Cuadrantes (si no hay turno personalizado).
    const candidateQuadrants = quadrants.filter(q => new Date(q.startDate + 'T00:00:00') <= date);
    if (candidateQuadrants.length === 0) return []; // Si no hay cuadrante, devolvemos una lista vacía.

    candidateQuadrants.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    const governingQuadrant = candidateQuadrants[0];

    // ... (El resto de la lógica para encontrar el día es la misma)
    const startDate = new Date(governingQuadrant.startDate + 'T00:00:00');
    const diffTime = date - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekOfCycle = Math.floor(diffDays / 7) % governingQuadrant.weeks;
    const dayOfWeek = date.getDay();
    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = dayNames[dayOfWeek];

    // Obtenemos la LISTA de IDs de turno para ese día.
    const turnIdsForDay = governingQuadrant.patterns[weekOfCycle]?.[dayName];

    if (!turnIdsForDay || turnIdsForDay.length === 0) {
        return []; // Si no hay turnos, devolvemos una lista vacía.
    }
    
    // 3. Convertimos la lista de IDs en una lista de objetos de turno completos.
    return turnIdsForDay.map(turnId => {
        if (turnId === 'REST') {
            return { name: 'Descanso', color: '#f0f2f5' };
        }
        const foundShift = shifts.find(s => s.id === Number(turnId));
        return foundShift ? foundShift : { name: 'BORRADO', color: '#ff8fa3' };
    });
}


/**
 * Calcula el turno BASE de un día, basándose únicamente en el cuadrante.
 * Versión actualizada que entiende la estructura de múltiples turnos.
 */
function getBaseTurnForDate(date) {
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

    // --- LÓGICA CORREGIDA ---
    // Leemos la LISTA de turnos.
    const turnIdsForDay = governingQuadrant.patterns[weekOfCycle]?.[dayName];
    if (!turnIdsForDay || turnIdsForDay.length === 0) return null;

    // Cogemos solo el PRIMER ID para el auto-rellenado.
    const turnId = turnIdsForDay[0];
    // --- FIN DE LA CORRECCIÓN ---

    if (turnId === 'REST') {
        return { name: 'Descanso', color: '#f0f2f5', startTime: '', endTime: '', isPaid: false };
    } else {
        const foundShift = shifts.find(s => s.id === Number(turnId));
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

//*****************************************************************************************************************************************************************************
//                 festivos                

/**
 * Comprueba si una fecha es festivo y devuelve su nombre.
 * @param {Date} date - La fecha a comprobar.
 * @returns {string|null} - El nombre del festivo, o null si no lo es.
 */
function isHoliday(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`;

    // Si encontramos la fecha en nuestra lista, devolvemos su nombre.
    if (HOLIDAYS[year] && HOLIDAYS[year][dateKey]) {
        return HOLIDAYS[year][dateKey];
    }
    return null; // Si no, devolvemos null.
}




//                 festivos                
//*****************************************************************************************************************************************************************************



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

/**
 * Dibuja la interfaz para editar los patrones de un cuadrante.
 * Versión final que soluciona el error de renderizado y el de 'appendChild'.
 */
function populateQuadrantForm(weekCount, quadrantData = null) {
    const patternContainer = document.getElementById('week-pattern-container');
    patternContainer.innerHTML = '';
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    let optionsHTML = '<option value="REST">Descanso</option>';
    shifts.forEach(shift => {
        optionsHTML += `<option value="${shift.id}">${shift.name}</option>`;
    });

    for (let i = 0; i < weekCount; i++) {
        const weekBlock = document.createElement('div');
		weekBlock.classList.add('week-block');
        weekBlock.innerHTML = `<h3>Semana ${i + 1}</h3>`;
        
        daysOfWeek.forEach(day => {
            const dayRow = document.createElement('div');
            dayRow.classList.add('day-pattern-row');
            
            // --- CORRECCIÓN CLAVE ---
            // Primero, creamos la estructura interna de la fila del día.
            dayRow.innerHTML = `
                <div class="day-label ${day === 'Domingo' ? 'sunday-text' : ''}">${day}</div>
                <div class="turn-entries"></div>
            `;
            // --- FIN DE LA CORRECCIÓN ---

            const turnEntriesContainer = dayRow.querySelector('.turn-entries');
            const turnIdsForDay = (quadrantData && quadrantData.patterns[i]) ? quadrantData.patterns[i][day.toLowerCase()] : ['REST'];

            const selectsToFill = turnIdsForDay.map((turnId, index) => {
                const turnEntry = document.createElement('div');
                turnEntry.classList.add('turn-entry');

                const select = document.createElement('select');
                select.classList.add('turn-select');
                select.dataset.week = i;
                select.dataset.day = day.toLowerCase();
                select.innerHTML = optionsHTML;

                const button = document.createElement('button');
                button.type = 'button';
                if (index === 0) {
                    const isRestOnly = turnIdsForDay.length === 1 && turnIdsForDay[0] === 'REST';
                    button.classList.add('add-turn-btn');
                    if (isRestOnly) button.classList.add('hidden');
                    button.textContent = '+';
                } else {
                    button.classList.add('remove-turn-btn');
                    button.textContent = '-';
                }
                
                turnEntry.appendChild(select);
                turnEntry.appendChild(button);
                turnEntriesContainer.appendChild(turnEntry); // Ahora sí encuentra el contenedor
                
                return { selectElement: select, value: turnId };
            });

            setTimeout(() => {
                selectsToFill.forEach(item => {
                    item.selectElement.value = item.value;
                });
            }, 0);
            
            weekBlock.appendChild(dayRow);
        });
        patternContainer.appendChild(weekBlock);
    }
}




/**
 * Revisa el primer turno de un día y oculta el botón '+' si es "Descanso".
 * @param {HTMLElement} dayRow - El elemento div que contiene todo el día.
 */
function updateAddButtonVisibility(dayRow) {
    const addButton = dayRow.querySelector('.add-turn-btn');
    const firstSelect = dayRow.querySelector('.turn-select');

    if (addButton && firstSelect) {
        // Si el valor del primer selector es "Descanso", ocultamos el botón.
        if (firstSelect.value === 'REST') {
            addButton.classList.add('hidden');
        } else {
            // Si no, nos aseguramos de que sea visible.
            addButton.classList.remove('hidden');
        }
    }
}










// --- FUNCIONES PARA GUARDAR Y CARGAR EN localStorage ---

/**
 * Guarda la lista de turnos.
 * Si el usuario ha iniciado sesión, la guarda en la nube (Firestore).
 * Si no, la guarda en la memoria local (localStorage).
 */
function saveShifts() {
    // 1. Obtenemos el usuario que tiene la sesión iniciada.
    const user = auth.currentUser;

    if (user) {
        // --- MODO REGISTRADO: Guardar en la Nube ---
        
        // 2. Apuntamos a la base de datos, a un documento que pertenece a este usuario.
        db.collection('userData').doc(user.uid).set({
            // Usamos 'merge: true' para no sobreescribir otros datos (cuadrantes, etc.)
            shifts: shifts 
        }, { merge: true })
        .catch((error) => {
            console.error("Error al guardar los turnos en la nube:", error);
            alert("No se pudieron guardar los cambios en la nube. Revisa tu conexión.");
        });

    } else {
        // --- MODO INVITADO: Guardar en Local ---
        
        // 3. Si no hay usuario, usamos el método de siempre.
        localStorage.setItem('calendarAppData_shifts', JSON.stringify(shifts));
    }
}


/**
 * Carga la lista de turnos.
 * Si el usuario ha iniciado sesión, la carga desde la nube (Firestore).
 * Si no, la carga desde la memoria local (localStorage).
 * Devuelve una Promesa para que sepamos cuándo ha terminado de cargar.
 */
async function loadShifts() {
    // 1. Obtenemos el usuario que tiene la sesión iniciada.
    const user = auth.currentUser;

    if (user) {
        // --- MODO REGISTRADO: Cargar desde la Nube ---
        try {
            // 2. Apuntamos al documento único de este usuario.
            const doc = await db.collection('userData').doc(user.uid).get();

            if (doc.exists && doc.data().shifts) {
                // 3. Si el documento existe y tiene datos de turnos, los cargamos.
                shifts = doc.data().shifts;
            } else {
                // Si no hay nada en la nube, empezamos con una lista vacía.
                shifts = [];
            }
        } catch (error) {
            console.error("Error al cargar los turnos desde la nube:", error);
            shifts = []; // En caso de error, usamos una lista vacía para evitar fallos.
        }
    } else {
        // --- MODO INVITADO: Cargar desde Local ---
        
        // 4. Si no hay usuario, usamos el método de siempre.
        const data = localStorage.getItem('calendarAppData_shifts');
        if (data) {
            shifts = JSON.parse(data);
        } else {
            shifts = [];
        }
    }
}


/**
 * Guarda la lista de cuadrantes.
 * Si el usuario ha iniciado sesión, la guarda en la nube (Firestore).
 * Si no, la guarda en la memoria local (localStorage).
 */
function saveQuadrants() {
    // 1. Obtenemos el usuario que tiene la sesión iniciada.
    const user = auth.currentUser;

    if (user) {
        // --- MODO REGISTRADO: Guardar en la Nube ---
        
        // 2. Apuntamos al documento único de este usuario.
        db.collection('userData').doc(user.uid).set({
            // Usamos 'merge: true' para no sobreescribir los turnos que ya guardamos.
            quadrants: quadrants 
        }, { merge: true })
        .catch((error) => {
            console.error("Error al guardar los cuadrantes en la nube:", error);
            alert("No se pudieron guardar los cambios en la nube. Revisa tu conexión.");
        });

    } else {
        // --- MODO INVITADO: Guardar en Local ---
        
        // 3. Si no hay usuario, usamos el método de siempre.
        localStorage.setItem('calendarAppData_quadrants', JSON.stringify(quadrants));
    }
}


/**
 * Carga la lista de cuadrantes.
 * Si el usuario ha iniciado sesión, la carga desde la nube (Firestore).
 * Si no, la carga desde la memoria local (localStorage).
 */
async function loadQuadrants() {
    // 1. Obtenemos el usuario que tiene la sesión iniciada.
    const user = auth.currentUser;

    if (user) {
        // --- MODO REGISTRADO: Cargar desde la Nube ---
        try {
            // 2. Apuntamos al documento único de este usuario.
            const doc = await db.collection('userData').doc(user.uid).get();

            if (doc.exists && doc.data().quadrants) {
                // 3. Si el documento existe y tiene datos de cuadrantes, los cargamos.
                quadrants = doc.data().quadrants;
            } else {
                // Si no hay nada en la nube, empezamos con una lista vacía.
                quadrants = [];
            }
        } catch (error) {
            console.error("Error al cargar los cuadrantes desde la nube:", error);
            quadrants = []; // En caso de error, usamos una lista vacía.
        }
    } else {
        // --- MODO INVITADO: Cargar desde Local ---
        
        // 4. Si no hay usuario, usamos el método de siempre.
        const data = localStorage.getItem('calendarAppData_quadrants');
        if (data) {
            quadrants = JSON.parse(data);
        } else {
            quadrants = [];
        }
    }
}

// --- FUNCIONES PARA GUARDAR Y CARGAR LAS NOTAS/EXCEPCIONES DIARIAS ---

/**
 * Guarda las notas y modificaciones diarias.
 * Ahora sabe cómo manejar órdenes de borrado específicas para Firestore.
 */
function saveDayNotes(dataToSave = dayNotes) { // <-- Acepta datos específicos para guardar
    const user = auth.currentUser;

    if (user) {
        // --- MODO REGISTRADO: Guardar en la Nube ---
        
        // Usamos .update() en lugar de .set() para poder enviar órdenes de borrado.
        db.collection('userData').doc(user.uid).update({
            dayNotes: dataToSave 
        })
        .catch((error) => {
            console.error("Error al guardar las notas diarias en la nube:", error);
            alert("No se pudieron guardar los cambios en la nube. Revisa tu conexión.");
        });

    } else {
        // --- MODO INVITADO: Guardar en Local ---
        localStorage.setItem('calendarAppData_dayNotes', JSON.stringify(dayNotes));
    }
}



/**
 * Carga las notas y modificaciones diarias.
 * Si el usuario ha iniciado sesión, las carga desde la nube (Firestore).
 * Si no, las carga desde la memoria local (localStorage).
 */
async function loadDayNotes() {
    // 1. Obtenemos el usuario que tiene la sesión iniciada.
    const user = auth.currentUser;

    if (user) {
        // --- MODO REGISTRADO: Cargar desde la Nube ---
        try {
            // 2. Apuntamos al documento único de este usuario.
            const doc = await db.collection('userData').doc(user.uid).get();

            if (doc.exists && doc.data().dayNotes) {
                // 3. Si el documento existe y tiene datos de notas, los cargamos.
                dayNotes = doc.data().dayNotes;
            } else {
                // Si no hay nada en la nube, empezamos con un objeto vacío.
                dayNotes = {};
            }
        } catch (error) {
            console.error("Error al cargar las notas diarias desde la nube:", error);
            dayNotes = {}; // En caso de error, usamos un objeto vacío.
        }
    } else {
        // --- MODO INVITADO: Cargar desde Local ---
        
        // 4. Si no hay usuario, usamos el método de siempre.
        const data = localStorage.getItem('calendarAppData_dayNotes');
        if (data) {
            dayNotes = JSON.parse(data);
        } else {
            dayNotes = {};
        }
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

/**
 * Dibuja el resumen de horas (semanal y bisemanal), destacando los que superan el límite.
 */
function renderQuadrantSummary() {
    // Definimos los límites aquí para que sean fáciles de cambiar. semanal bisemanal
    const WEEKLY_HOUR_LIMIT = 55;
    const BIWEEKLY_HOUR_LIMIT = 95;

    const container = document.getElementById('quadrant-summary-container');
    container.innerHTML = '';

    if (quadrants.length === 0) {
        container.innerHTML = '<p>No has creado ningún cuadrante para analizar.</p>';
        return;
    }

    quadrants.forEach(quad => {
        const weeklyHours = calculateQuadrantWeeklyHours(quad);
        
        const biweeklyHours = [];
        const numWeeks = weeklyHours.length;
        if (numWeeks > 1) {
            for (let i = 0; i < numWeeks; i++) {
                const week1 = weeklyHours[i];
                const week2 = weeklyHours[(i + 1) % numWeeks];
                biweeklyHours.push(week1 + week2);
            }
        }
        
        const startDate = new Date(quad.startDate + 'T00:00:00');
        const formattedDate = startDate.toLocaleDateString('es-ES', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        // --- LÓGICA MODIFICADA PARA SEMANAS ---
        // Ahora comprueba si las horas semanales superan el límite de 40.
        let weeksSummaryHTML = weeklyHours.map((hours, index) => {
            const limitClass = hours > WEEKLY_HOUR_LIMIT ? 'over-limit' : '';
            return `<li>S${index + 1}: <strong class="${limitClass}">${hours.toFixed(2)}H</strong></li>`;
        }).join('');

        // --- LÓGICA MODIFICADA PARA QUINCENAS ---
        // Ahora comprueba si las horas bisemanales superan el límite de 95.
let biweeksSummaryHTML = biweeklyHours.map((hours, index) => {
    const limitClass = hours > BIWEEKLY_HOUR_LIMIT ? 'over-limit' : '';

    // --- LÓGICA NUEVA PARA EL TEXTO ---
    // Calculamos los números de las semanas que se están sumando.
    const week1Num = index + 1;
    // El truco del '%' (módulo) nos da la siguiente semana de forma circular.
    const week2Num = ((index + 1) % numWeeks) + 1;

    // Construimos el nuevo texto detallado.
    const summaryText = `S${week1Num}+S${week2Num}=`;

    return `<li>${summaryText} <strong class="${limitClass}">${hours.toFixed(2)}H</strong></li>`;
    // --- FIN DE LA LÓGICA NUEVA ---
}).join('');

        const quadrantCard = document.createElement('div');
        quadrantCard.classList.add('summary-card');
        quadrantCard.innerHTML = `
            <h4>Cuadrante que inicia el ${formattedDate}</h4>
            <div class="summary-columns">
                <div class="summary-column">
                    <h5>Semanas</h5>
                    <ul>${weeksSummaryHTML}</ul>
                </div>
                <div class="summary-column">
                    <h5>Quincenas</h5>
                    <ul>${biweeksSummaryHTML}</ul>
                </div>
            </div>
        `;
        container.appendChild(quadrantCard);
    });
}


// --- LÓGICA PARA EL DESPLEGABLE DE ESTADÍSTICAS (VERSIÓN ACORDEÓN) ---
const quadrantSummaryContainer = document.getElementById('quadrant-summary-container');

quadrantSummaryContainer.addEventListener('click', (event) => {
    // Comprobamos si el clic fue en un título H4
    if (event.target.tagName === 'H4') {
        const clickedCard = event.target.closest('.summary-card');
        if (!clickedCard) return;

        // Buscamos todas las tarjetas en el contenedor
        const allCards = quadrantSummaryContainer.querySelectorAll('.summary-card');

        // Recorremos todas las tarjetas para cerrar las que no hemos pulsado
        allCards.forEach(card => {
            // Si la tarjeta es diferente a la que hemos pulsado...
            if (card !== clickedCard) {
                // ...la cerramos quitándole la clase 'expanded'.
                card.classList.remove('expanded');
            }
        });

        // Finalmente, abrimos (o cerramos) la tarjeta que sí hemos pulsado.
        clickedCard.classList.toggle('expanded');
    }
});


/**
 * Calcula las horas trabajadas totales en un rango de fechas.
 * @param {Date} startDate - La fecha de inicio del periodo.
 * @param {Date} endDate - La fecha de fin del periodo.
 * @returns {number} - El total de horas trabajadas.
 */
function calculateTotalHoursForPeriod(startDate, endDate) {
    let totalHours = 0;
    let currentDate = new Date(startDate);

    // Bucle que recorre cada día del periodo
    while (currentDate <= endDate) {
        // Comprobamos que el día no sea de vacaciones
        if (!isDateOnVacation(currentDate)) {
            const turn = getTurnForDate(currentDate);
            // Si hay turno y no es "Descanso", sumamos sus horas
            if (turn && turn.name !== 'Descanso') {
                const hoursString = calculateTotalHours(turn.startTime, turn.endTime);
                totalHours += parseFloat(hoursString) || 0;
            }
        }
        // Pasamos al día siguiente
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return totalHours;
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

/**
 * Calcula las ganancias para un día, permitiendo especificar qué parte calcular.
 * @param {object} turn - El objeto del turno del día.
 * @param {Date} date - La fecha del día que se está calculando.
 * @param {boolean} turnOnly - Si es true, solo calcula las ganancias del turno principal.
 * @param {boolean} extrasOnly - Si es true, solo calcula las ganancias de las horas extra.
 * @returns {string} - Las ganancias calculadas, formateadas.
 */
function calculateEarnings(turn, date, turnOnly = false, extrasOnly = false) {
    let totalEarnings = 0;
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const dayNote = dayNotes[dateKey];

    // 1. Calcula ganancias del turno principal
    if (!extrasOnly && turn && turn.isPaid && turn.overtimeRateId) {
        const rate = overtimeRates.find(r => r.id === Number(turn.overtimeRateId));
        if (rate) {
            const hours = parseFloat(calculateTotalHours(turn.startTime, turn.endTime));
            if (!isNaN(hours)) {
                totalEarnings += hours * rate.price;
            }
        }
    }

    // 2. Suma ganancias de las horas extras
    if (!turnOnly && dayNote && dayNote.extraHours) {
        const rate = overtimeRates.find(r => r.id === Number(dayNote.extraHours.rateId));
        if (rate) {
            totalEarnings += dayNote.extraHours.hours * rate.price;
        }
    }

    return `${totalEarnings.toFixed(2)}€`;
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

/**
 * Carga TODOS los datos de la aplicación.
 * Decide si cargarlos desde la nube (si hay usuario) o desde local.
 * Devuelve una Promesa que se completa cuando todos los datos han sido cargados.
 */
async function loadAllData() {
    // Obtenemos el usuario actual.
    const user = auth.currentUser;

    if (user) {
        // --- MODO REGISTRADO: Cargar desde la Nube ---
        console.log("Usuario conectado. Cargando datos desde la nube...");
        // Usamos Promise.all para ejecutar todas las cargas en paralelo y esperar a que terminen.
        await Promise.all([
            loadShifts(),
            loadQuadrants(),
            loadVacations(),
            loadOvertimeRates(),
            loadShiftClosures(),
            loadDayNotes()
        ]);
    } else {
        // --- MODO INVITADO: Cargar desde Local ---
        console.log("Modo invitado. Cargando datos desde localStorage...");
        // Estas funciones son rápidas porque leen del disco, no de internet.
        loadShifts();
        loadQuadrants();
        loadVacations();
        loadOvertimeRates();
        loadShiftClosures();
        loadDayNotes();
    }
}

function renderAllLists() {
    // Estas funciones dibujan el contenido de las pantallas de ajustes.
    renderShiftsList();
    renderQuadrantsList();
    renderVacationsList();
    renderShiftClosureView();
    renderOvertimeList();
    renderColorSelector();
}


/**
 * Se suscribe a los cambios en los datos del usuario en la nube en tiempo real.
 * Cada vez que algo cambia en la base de datos, este código se ejecuta automáticamente.
 * @param {string} userId - El ID del usuario al que nos vamos a suscribir.
 */
function subscribeToDataChanges(userId) {
    // Apuntamos al documento único que contiene todos los datos de este usuario.
    const userDocRef = db.collection('userData').doc(userId);

    // .onSnapshot() es la orden para "escuchar en tiempo real".
    // Guardamos la función que devuelve en nuestra variable "interruptor".
    unsubscribeFromDataChanges = userDocRef.onSnapshot(
        (doc) => {
            // --- ESTE CÓDIGO SE EJECUTA CADA VEZ QUE HAY UN CAMBIO ---
            console.log("¡Datos de la nube actualizados!");

            if (doc.exists) {
                const data = doc.data();
                // Rellenamos nuestras variables de memoria con los datos actualizados.
                shifts = data.shifts || [];
                quadrants = data.quadrants || [];
                vacations = data.vacations || [];
                overtimeRates = data.overtimeRates || [];
                shiftClosures = data.shiftClosures || {};
                dayNotes = data.dayNotes || {};
            } else {
                // Si el documento se borra, reseteamos los datos.
                shifts = []; quadrants = []; vacations = []; overtimeRates = []; shiftClosures = {}; dayNotes = {};
            }
            
            // Después de actualizar la memoria, volvemos a dibujar todo en la pantalla.
            renderAllLists();
            renderCalendar();
        },
        (error) => {
            console.error("Error al escuchar los cambios de la nube:", error);
            alert("Se ha perdido la conexión con los datos en tiempo real.");
        }
    );
}



// ===============================================================
// --- ARRANQUE DE LA APLICACIÓN (NUEVA VERSIÓN SIN CONFLICTOS) ---
// ===============================================================
auth.onAuthStateChanged(async (user) => {
    
    // Al cambiar de usuario, si había un "oyente" activo, lo apagamos.
    if (unsubscribeFromDataChanges) {
        unsubscribeFromDataChanges();
        unsubscribeFromDataChanges = null;
    }

    if (user) {
        // --- CASO 1: El usuario HA INICIADO SESIÓN ---
        headerTitleContainer.innerHTML = `<h1 class="header-title">📅 Turnos de ${user.displayName}</h1>`;
        logoutMenuButton.classList.remove('hidden');

        // Activamos el "oyente" en tiempo real para este usuario.
        subscribeToDataChanges(user.uid);
        
        // Mostramos la aplicación.
        appContainer.classList.remove('hidden');
        authView.classList.add('hidden');
        calendarView.classList.remove('hidden');
        appHeader.classList.remove('hidden');
        
		} else {
			// --- CASO 2: El usuario NO HA INICIADO SESIÓN (Modo Invitado) ---
			
			// 1. Preparamos la cabecera para el invitado.
			headerTitleContainer.innerHTML = `<button id="show-auth-view-button" class="header-button">Iniciar Sesión</button>`;
			logoutMenuButton.classList.add('hidden');
			
			const showAuthButton = document.getElementById('show-auth-view-button');
			if (showAuthButton) {
				showAuthButton.addEventListener('click', () => {
					appContainer.classList.add('hidden');
					authView.classList.remove('hidden');
					loginForm.classList.remove('hidden');
					registerForm.classList.add('hidden');
				});
			}

			// 2. Cargamos los datos de localStorage.
			await loadAllData(); 
			
			// 3. MOSTRAMOS LA PANTALLA CORRECTA.
			appContainer.classList.remove('hidden');
			authView.classList.add('hidden');
			
			// --- LÍNEAS IMPORTANTES ---
			// Nos aseguramos de ocultar la vista de ajustes y mostrar el calendario.
			settingsView.classList.add('hidden');
			calendarView.classList.remove('hidden');
			appHeader.classList.remove('hidden');
			
			prefillUsername();
			renderCalendar();
			
			checkDailyAlerts();
	
		}
});


// ===============================================================
// --- ARRANQUE DE LA APLICACIÓN Y GESTIÓN DE SESIÓN ---  FIN
// ===============================================================


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

/**
 * Gestiona el clic en el botón "+ Añadir nuevo turno".
 * Limpia el formulario y lo prepara para crear un turno desde cero.
 */
addNewShiftButton.addEventListener('click', () => {
    // 1. Limpiamos todos los campos del formulario (nombre, horas, etc.).
    shiftForm.reset();

    // 2. Nos aseguramos de que el campo oculto del ID esté vacío.
    // Esto es crucial para que el botón "Guardar" sepa que estamos creando, no editando.
    document.getElementById('shift-id-input').value = '';

    // 3. Restauramos el título original del formulario.
    document.getElementById('shift-form-title').textContent = 'Añadir Turno';

    // 4. Quitamos la selección de cualquier color que pudiera estar marcado.
    const allDots = colorSelector.querySelectorAll('.color-dot');
    allDots.forEach(dot => dot.classList.remove('selected'));

    // 5. Nos aseguramos de que la sección de pago por horas esté oculta.
    hourlyRateContainer.classList.add('hidden');

    // 6. Finalmente, mostramos la pantalla del formulario, ahora limpia.
    shiftsListView.classList.add('hidden');
    shiftFormView.classList.remove('hidden');
});

/**
 * Gestiona el clic en el botón de volver (←) desde el formulario de turnos.
 * Limpia el formulario y vuelve a la lista.
 */
cancelShiftFormButton.addEventListener('click', () => {
    // 1. Reseteamos el formulario para limpiar cualquier dato no guardado.
    shiftForm.reset();
    document.getElementById('shift-id-input').value = '';
    document.getElementById('shift-form-title').textContent = 'Añadir Turno';
    const allDots = colorSelector.querySelectorAll('.color-dot');
    allDots.forEach(dot => dot.classList.remove('selected'));
    hourlyRateContainer.classList.add('hidden');

    // 2. Navegamos de vuelta a la lista de turnos.
    shiftFormView.classList.add('hidden');
    shiftsListView.classList.remove('hidden');
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

/**
 * Gestiona el clic en el botón "+ Añadir nuevo cuadrante".
 * Limpia el formulario y lo prepara para crear un cuadrante desde cero.
 */
addNewQuadrantButton.addEventListener('click', () => {
    // 1. Limpiamos todos los campos del formulario (fecha, semanas, etc.).
    quadrantForm.reset();

    // 2. Nos aseguramos de que el campo oculto del ID esté vacío.
    // Esto es crucial para que el botón "Guardar" sepa que estamos creando, no editando.
    document.getElementById('quadrant-id-input').value = '';

    // 3. Restauramos el título original del formulario.
    document.getElementById('quadrant-form-title').textContent = 'Añadir Cuadrante';

    // 4. Llamamos a nuestra "fábrica" y le pasamos 'null' para indicarle
    // explícitamente que queremos un formulario vacío.
    populateQuadrantForm(quadrantWeeksInput.value, null);

    // 5. Finalmente, mostramos la pantalla del formulario, ahora limpia.
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

/**
 * Gestiona el guardado del formulario de cuadrantes.
 * Ahora sabe leer y almacenar múltiples turnos por día.
 */
quadrantForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const startDateValue = document.getElementById('quadrant-start-date').value;
    const quadrantId = document.getElementById('quadrant-id-input').value;

    // --- Validación de fecha duplicada (se mantiene igual) ---
    const isDuplicateDate = quadrants.some(
        quad => quad.startDate === startDateValue && quad.id !== Number(quadrantId)
    );

    if (isDuplicateDate) {
        alert('¡Atención! Ya existe otro cuadrante que empieza en la misma fecha. Por favor, elige otra.');
        return;
    }
    
    // --- NUEVA LÓGICA PARA LEER MÚLTIPLES TURNOS ---
    const weekCount = quadrantWeeksInput.value;
    const patterns = [];
    const daysOfWeek = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

    // Recorremos cada bloque de semana del formulario.
    for (let i = 0; i < weekCount; i++) {
        const weekPattern = {};
        
        // Para cada semana, recorremos cada día.
        daysOfWeek.forEach(day => {
            // Buscamos TODOS los <select> de este día y esta semana.
            const daySelects = document.querySelectorAll(`.turn-select[data-week="${i}"][data-day="${day}"]`);
            
            // Creamos una lista con los IDs de los turnos seleccionados.
            const turnIdsForDay = Array.from(daySelects).map(select => select.value);
            
            // Guardamos la lista de turnos para ese día.
            weekPattern[day] = turnIdsForDay;
        });
        patterns.push(weekPattern);
    }


    const quadrantData = {
        startDate: startDateValue,
        weeks: weekCount,
        patterns: patterns // 'patterns' ahora contiene la nueva estructura.
    };

    // --- Lógica de guardado (se mantiene igual) ---
    if (quadrantId) {
        quadrants = quadrants.map(quad => (quad.id === Number(quadrantId) ? { ...quad, ...quadrantData } : quad));
    } else {
        const newQuadrant = { id: Date.now(), ...quadrantData };
        quadrants.push(newQuadrant);
    }

    saveQuadrants();
    renderQuadrantsList();
    renderCalendar();
    
    // Reseteamos y ocultamos el formulario.
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
    // --- LÓGICA DE EDICIÓN (VERSIÓN CORREGIDA) ---
    const quadrantIdToEdit = Number(event.target.dataset.quadrantId);
    const quadrantToEdit = quadrants.find(q => q.id === quadrantIdToEdit);

    if (quadrantToEdit) {
        // Rellenamos los campos básicos del formulario.
        document.getElementById('quadrant-id-input').value = quadrantToEdit.id;
        document.getElementById('quadrant-start-date').value = quadrantToEdit.startDate;
        quadrantWeeksInput.value = quadrantToEdit.weeks;

        // --- LA CLAVE ESTÁ AQUÍ ---
        // Llamamos a nuestra nueva "fábrica" y le pasamos los datos del cuadrante.

	   populateQuadrantForm(quadrantToEdit.weeks, quadrantToEdit);

        // Cambiamos el título y mostramos el formulario.
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
            
			populateQuadrantForm(quadrantToEdit.weeks, quadrantToEdit);
            
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








// ===============================================================
// --- LÓGICA PARA AÑADIR/QUITAR TURNOS EN EL CUADRANTE ---
// ===============================================================

/**
 * Gestiona los clics en los botones '+' y '-' del editor de cuadrantes.
 */
weekPatternContainer.addEventListener('click', (event) => {
    const target = event.target;

// --- Lógica para el botón AÑADIR (+) ---
if (target.classList.contains('add-turn-btn')) {
    const turnEntriesContainer = target.closest('.turn-entries');
    
    // --- LÓGICA CORREGIDA ---
    // 1. Buscamos el primer <select> para saber de qué día y semana estamos hablando.
    const firstSelect = turnEntriesContainer.querySelector('.turn-select');
    const week = firstSelect.dataset.week;
    const day = firstSelect.dataset.day;

    // 2. Creamos la nueva fila de entrada.
    const newTurnEntry = document.createElement('div');
    newTurnEntry.classList.add('turn-entry');

    // 3. Creamos el nuevo <select> y lo rellenamos.
    const newSelect = document.createElement('select');
    newSelect.classList.add('turn-select');
    // Le añadimos las "etiquetas" que faltaban.
    newSelect.dataset.week = week;
    newSelect.dataset.day = day;

    let optionsHTML = '<option value="REST">Descanso</option>';
    shifts.forEach(shift => {
        optionsHTML += `<option value="${shift.id}">${shift.name}</option>`;
    });
    newSelect.innerHTML = optionsHTML;

    // 4. Creamos el botón de eliminar (-).
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.classList.add('remove-turn-btn');
    removeButton.textContent = '-';
    
    // 5. "Montamos" la nueva fila y la añadimos.
    newTurnEntry.appendChild(newSelect);
    newTurnEntry.appendChild(removeButton);
    turnEntriesContainer.appendChild(newTurnEntry);
}
	
	

// --- Lógica para el botón QUITAR (-) ---
if (target.classList.contains('remove-turn-btn')) {
    const turnEntryToRemove = target.closest('.turn-entry');
    if (turnEntryToRemove) {
        const dayRow = target.closest('.day-pattern-row'); // Guardamos la referencia al día
        turnEntryToRemove.remove(); // Eliminamos la fila

    }
}
	
	
});


weekPatternContainer.addEventListener('change', (event) => {
    if (event.target.classList.contains('turn-select')) {
        // Buscamos la fila del día entero.
        const dayRow = event.target.closest('.day-pattern-row');
        // Y llamamos a nuestra herramienta para que revise.
        updateAddButtonVisibility(dayRow);
    }
});













// ********************************************************************************************************************************************************************************************************************************************
// --- SECCIÓN 14: LÓGICA DE HORAS EXTRAS (EDICIÓN EN LÍNEA) ---
// ********************************************************************************************************************************************************************************************************************************************

// --- Elementos de la sección ---
//const menuItemOvertime = document.querySelector('.settings-menu .settings-item:last-child');
const overtimeListView = document.getElementById('overtime-list-view');
const backToSettingsFromOvertimeButton = document.getElementById('back-to-settings-from-overtime-button');
const addNewOvertimeButton = document.getElementById('add-new-overtime-button');
const overtimeListContainer = document.getElementById('overtime-list-container');

// --- Funciones de guardado y carga ---
/**
 * Guarda la lista de tarifas de horas extras.
 * Si el usuario ha iniciado sesión, la guarda en la nube (Firestore).
 * Si no, la guarda en la memoria local (localStorage).
 */
function saveOvertimeRates() {
    // 1. Obtenemos el usuario que tiene la sesión iniciada.
    const user = auth.currentUser;

    if (user) {
        // --- MODO REGISTRADO: Guardar en la Nube ---
        
        // 2. Apuntamos al documento único de este usuario.
        db.collection('userData').doc(user.uid).set({
            // Usamos 'merge: true' para no sobreescribir los otros datos.
            overtimeRates: overtimeRates 
        }, { merge: true })
        .catch((error) => {
            console.error("Error al guardar las horas extras en la nube:", error);
            alert("No se pudieron guardar los cambios en la nube. Revisa tu conexión.");
        });

    } else {
        // --- MODO INVITADO: Guardar en Local ---
        
        // 3. Si no hay usuario, usamos el método de siempre.
        localStorage.setItem('calendarAppData_overtime', JSON.stringify(overtimeRates));
    }
}


/**
 * Carga la lista de tarifas de horas extras.
 * Si el usuario ha iniciado sesión, la carga desde la nube (Firestore).
 * Si no, la carga desde la memoria local (localStorage).
 */
async function loadOvertimeRates() {
    // 1. Obtenemos el usuario que tiene la sesión iniciada.
    const user = auth.currentUser;

    if (user) {
        // --- MODO REGISTRADO: Cargar desde la Nube ---
        try {
            // 2. Apuntamos al documento único de este usuario.
            const doc = await db.collection('userData').doc(user.uid).get();

            if (doc.exists && doc.data().overtimeRates) {
                // 3. Si el documento existe y tiene datos de horas extras, los cargamos.
                overtimeRates = doc.data().overtimeRates;
            } else {
                // Si no hay nada en la nube, empezamos con una lista vacía.
                overtimeRates = [];
            }
        } catch (error) {
            console.error("Error al cargar las horas extras desde la nube:", error);
            overtimeRates = []; // En caso de error, usamos una lista vacía.
        }
    } else {
        // --- MODO INVITADO: Cargar desde Local ---
        
        // 4. Si no hay usuario, usamos el método de siempre.
        const data = localStorage.getItem('calendarAppData_overtime');
        if (data) {
            overtimeRates = JSON.parse(data);
        } else {
            overtimeRates = [];
        }
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
		  rateItem.classList.add('rate-item', 'quadrant-item');
            rateItem.innerHTML = `
                <div class="rate-content">
                    <span class="rate-name">${rate.name}</span>
                    <span class="rate-price">${rate.price}€/h</span>
                </div>
                <div class="rate-actions">
                    <button class="action-button edit-rate" data-id="${rate.id}">Editar</button>
                    
					<button class="action-button delete" data-id="${rate.id}">Eliminar</button>
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
   editItem.classList.add('rate-item', 'rate-item-edit', 'quadrant-item');
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
	if (target.classList.contains('delete')) {
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
//const menuItemVacations = document.querySelector('.settings-menu .settings-item:nth-child(3)');
const vacationsListView = document.getElementById('vacations-list-view');
const backToSettingsFromVacationsButton = document.getElementById('back-to-settings-from-vacations-button');
const addNewVacationButton = document.getElementById('add-new-vacation-button');

const vacationFormView = document.getElementById('vacation-form-view');
const vacationForm = document.getElementById('vacation-form');
const cancelVacationFormButton = document.getElementById('cancel-vacation-form-button');



/**
 * Guarda la lista de periodos de vacaciones.
 * Si el usuario ha iniciado sesión, la guarda en la nube (Firestore).
 * Si no, la guarda en la memoria local (localStorage).
 */
function saveVacations() {
    // 1. Obtenemos el usuario que tiene la sesión iniciada.
    const user = auth.currentUser;

    if (user) {
        // --- MODO REGISTRADO: Guardar en la Nube ---
        
        // 2. Apuntamos al documento único de este usuario.
        db.collection('userData').doc(user.uid).set({
            // Usamos 'merge: true' para no sobreescribir los otros datos.
            vacations: vacations 
        }, { merge: true })
        .catch((error) => {
            console.error("Error al guardar las vacaciones en la nube:", error);
            alert("No se pudieron guardar los cambios en la nube. Revisa tu conexión.");
        });

    } else {
        // --- MODO INVITADO: Guardar en Local ---
        
        // 3. Si no hay usuario, usamos el método de siempre.
        localStorage.setItem('calendarAppData_vacations', JSON.stringify(vacations));
    }
}

/**
 * Carga la lista de periodos de vacaciones.
 * Si el usuario ha iniciado sesión, la carga desde la nube (Firestore).
 * Si no, la carga desde la memoria local (localStorage).
 */
async function loadVacations() {
    // 1. Obtenemos el usuario que tiene la sesión iniciada.
    const user = auth.currentUser;

    if (user) {
        // --- MODO REGISTRADO: Cargar desde la Nube ---
        try {
            // 2. Apuntamos al documento único de este usuario.
            const doc = await db.collection('userData').doc(user.uid).get();

            if (doc.exists && doc.data().vacations) {
                // 3. Si el documento existe y tiene datos de vacaciones, los cargamos.
                vacations = doc.data().vacations;
            } else {
                // Si no hay nada en la nube, empezamos con una lista vacía.
                vacations = [];
            }
        } catch (error) {
            console.error("Error al cargar las vacaciones desde la nube:", error);
            vacations = []; // En caso de error, usamos una lista vacía.
        }
    } else {
        // --- MODO INVITADO: Cargar desde Local ---
        
        // 4. Si no hay usuario, usamos el método de siempre.
        const data = localStorage.getItem('calendarAppData_vacations');
        if (data) {
            vacations = JSON.parse(data);
        } else {
            vacations = [];
        }
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
//const menuItemClosure = document.querySelector('.settings-menu .settings-item:nth-child(4)');
const shiftClosureView = document.getElementById('shift-closure-view');
const backToSettingsFromClosureButton = document.getElementById('back-to-settings-from-closure-button');
const monthlyClosureList = document.getElementById('monthly-closure-list');


/**
 * Guarda la configuración de los días de cierre.
 * Si el usuario ha iniciado sesión, la guarda en la nube (Firestore).
 * Si no, la guarda en la memoria local (localStorage).
 */
function saveShiftClosures() {
    // 1. Obtenemos el usuario que tiene la sesión iniciada.
    const user = auth.currentUser;

    if (user) {
        // --- MODO REGISTRADO: Guardar en la Nube ---
        
        // 2. Apuntamos al documento único de este usuario.
        db.collection('userData').doc(user.uid).set({
            // Usamos 'merge: true' para no sobreescribir los otros datos.
            shiftClosures: shiftClosures 
        }, { merge: true })
        .catch((error) => {
            console.error("Error al guardar los cierres de turno en la nube:", error);
            alert("No se pudieron guardar los cambios en la nube. Revisa tu conexión.");
        });

    } else {
        // --- MODO INVITADO: Guardar en Local ---
        
        // 3. Si no hay usuario, usamos el método de siempre.
        localStorage.setItem('calendarAppData_closures', JSON.stringify(shiftClosures));
    }
}

/**
 * Carga la configuración de los días de cierre.
 * Si el usuario ha iniciado sesión, la carga desde la nube (Firestore).
 * Si no, la carga desde la memoria local (localStorage).
 */
async function loadShiftClosures() {
    // 1. Obtenemos el usuario que tiene la sesión iniciada.
    const user = auth.currentUser;

    if (user) {
        // --- MODO REGISTRADO: Cargar desde la Nube ---
        try {
            // 2. Apuntamos al documento único de este usuario.
            const doc = await db.collection('userData').doc(user.uid).get();

            if (doc.exists && doc.data().shiftClosures) {
                // 3. Si el documento existe y tiene datos de cierres, los cargamos.
                shiftClosures = doc.data().shiftClosures;
            } else {
                // Si no hay nada en la nube, empezamos con un objeto vacío.
                shiftClosures = {};
            }
        } catch (error) {
            console.error("Error al cargar los cierres de turno desde la nube:", error);
            shiftClosures = {}; // En caso de error, usamos un objeto vacío.
        }
    } else {
        // --- MODO INVITADO: Cargar desde Local ---
        
        // 4. Si no hay usuario, usamos el método de siempre.
        const data = localStorage.getItem('calendarAppData_closures');
        if (data) {
            shiftClosures = JSON.parse(data);
        } else {
            shiftClosures = {};
        }
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


/**
 * Comprueba si un día ha sido modificado manualmente.
 * @param {Date} date - La fecha a comprobar.
 * @returns {boolean} - True si el día tiene un turno personalizado, un comentario o horas extras.
 */
function isDayOverridden(date) {
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const note = dayNotes[dateKey];

    // Un día se considera "editado" si existe una nota para él y esa nota contiene
    // un turno personalizado, un comentario O horas extras.
    return note && (note.overrideShift || (note.dailyComment && note.dailyComment.trim() !== '') || note.extraHours);
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




// ********************************************************************************************************************************************************************************************************************************************
// --- LÓGICA DE LA VENTANA MODAL (CON MODO EDICIÓN) ---
// ********************************************************************************************************************************************************************************************************************************************


// --- Elementos de la modal ---
const dayModal = document.getElementById('day-modal');
const modalViewSection = document.getElementById('modal-view-section');
const modalEditSection = document.getElementById('modal-edit-section');
let currentEditingDate = null; // Variable para recordar qué día estamos viendo/editando



/**
 * Abre y rellena la ventana modal con la información del día,
 * respetando la jerarquía de prioridades (Edición > Vacaciones > Cuadrante).
 */
function openDayModal(dateStr) {
    currentEditingDate = dateStr;
    const date = new Date(dateStr + 'T00:00:00');

    // --- Elementos de la UI ---
    const modalHeader = dayModal.querySelector('.modal-header');
    const modalClosureSummary = document.getElementById('modal-closure-summary');
    const shiftListContainer = document.getElementById('modal-shift-list-container');
    const totalHoursDisplay = document.getElementById('modal-total-hours');
    const earningsDisplay = document.getElementById('modal-earnings');
    const shiftCommentsDisplay = dayModal.querySelector('#modal-shift-comments-display');
    const dailyCommentsDisplay = dayModal.querySelector('#modal-daily-comments-display');

    // --- Reseteo de la Modal ---
    modalClosureSummary.classList.add('hidden');
    modalHeader.classList.remove('closure-day', 'earnings-day', 'today-day');
    shiftListContainer.innerHTML = '';
    shiftCommentsDisplay.style.display = 'none';
    dailyCommentsDisplay.style.display = 'none';
    totalHoursDisplay.textContent = '0.00 H';
    earningsDisplay.textContent = '0.00€';

    // Rellenamos el título y comprobamos si es festivo.
    const holidayName = isHoliday(date);
    const holidayNameDisplay = document.getElementById('modal-holiday-name');
    dayModal.querySelector('#modal-date').textContent = date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    holidayNameDisplay.textContent = holidayName || '';
    holidayNameDisplay.classList.toggle('hidden', !holidayName);

    // --- Búsqueda de datos ---
    const allTurnsForDay = getAllTurnsForDate(date);
    const onVacation = isDateOnVacation(date);
    const isOverridden = isDayOverridden(date);
    const dayNote = dayNotes[dateStr] || {};

    let totalHours = 0;
    let totalEarnings = 0;
    let shiftCommentsHTML = '';

    // --- LÓGICA DE PRIORIDAD CORREGIDA ---

    // 1. PRIMERO, comprobamos si son vacaciones Y el día NO ha sido editado manualmente.
    if (onVacation && !isOverridden) {
			//shiftListContainer.innerHTML = `<div class="shift-list-item"><span class="name">Vacaciones</span></div>`;
			shiftListContainer.innerHTML = `<div class="shift-list-item vacation-day"><span class="name">Vacaciones</span></div>`;
			
        // Los totales se quedan en 0, como ya hemos reseteado.

    // 2. SI NO, mostramos los turnos (ya sean del cuadrante o de una edición manual).
    } else if (allTurnsForDay.length > 0) {
        allTurnsForDay.forEach(turn => {
            const turnHours = calculateTotalHours(turn.startTime, turn.endTime);
            shiftListContainer.innerHTML += `
                <div class="shift-list-item">
                    <span class="name">${turn.name}</span>
                    <span class="time">${turn.startTime && turn.endTime ? `${turn.startTime} - ${turn.endTime}` : ''}</span>
                    <span class="hours">${turnHours !== 'N/A' ? `(${turnHours})` : ''}</span>
                </div>
            `;
            const hours = parseFloat(turnHours);
            if (!isNaN(hours)) totalHours += hours;
            
			const turnEarnings = parseFloat(calculateEarnings(turn, date, true)); // 'true' significa "solo turno"
            if (!isNaN(turnEarnings)) totalEarnings += turnEarnings;
            
			if (turn.comments) shiftCommentsHTML += `<div>${turn.comments}</div>`;
        });
		
// --- LÓGICA NUEVA: SUMAR LAS HORAS EXTRAS AL FINAL ---
    // Buscamos las ganancias de las horas extra una sola vez, fuera del bucle.
    const extraEarnings = parseFloat(calculateEarnings(null, date, false, true)); // 'true' significa "solo extras"
    if (!isNaN(extraEarnings)) {
        totalEarnings += extraEarnings;
    }
    // --- FIN DE LA LÓGICA NUEVA ---		
        
        totalHoursDisplay.textContent = `${totalHours.toFixed(2)} H`;
        earningsDisplay.textContent = `${totalEarnings.toFixed(2)}€`;

    // 3. Si no hay nada, es un día libre.
    } else {
        shiftListContainer.innerHTML = `<div class="shift-list-item"><span class="name">Libre</span></div>`;
    }
    
    // Lógica para mostrar comentarios
    const originalTurn = getBaseTurnForDate(date);
    if (originalTurn && originalTurn.comments && !onVacation) {
        shiftCommentsDisplay.innerHTML = `<div>${originalTurn.comments}</div>`;
        shiftCommentsDisplay.style.display = 'block';
    }
    if (dayNote.dailyComment) {
        dailyCommentsDisplay.textContent = dayNote.dailyComment;
        dailyCommentsDisplay.style.display = 'block';
    }

    // Lógica para colorear cabeceras y mostrar resumen de cierre (se mantiene igual)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date.getTime() === today.getTime()) modalHeader.classList.add('today-day');
    if (totalEarnings > 0) modalHeader.classList.add('earnings-day');
    if (isShiftClosureDay(date)) {
        modalHeader.classList.add('closure-day');
        const prevClosureDate = getPreviousClosureDate(date);
        if (prevClosureDate) {
            const periodStartDate = new Date(prevClosureDate);
            periodStartDate.setDate(periodStartDate.getDate() + 1);
            const summary = calculatePeriodSummary(periodStartDate, date);
            document.getElementById('modal-worked-days').textContent = summary.workedDays;
            document.getElementById('modal-total-earnings').textContent = `${summary.totalEarnings.toFixed(2)}€`;
            // Lógica del desglose
            const breakdownList = document.getElementById('earnings-breakdown-list');
            breakdownList.innerHTML = '';
            if (summary.earningsBreakdown.length > 0) {
                summary.earningsBreakdown.forEach(item => {
                    const formattedDate = item.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                    const listItem = document.createElement('li');
                    listItem.classList.add('breakdown-item');
                    listItem.innerHTML = `
                        <span class="breakdown-date">${formattedDate}</span>
                        <span class="breakdown-source">${item.source}</span>
                        <span class="breakdown-amount">+${item.amount.toFixed(2)}€</span>
                    `;
                    breakdownList.appendChild(listItem);
                });
            } else {
                breakdownList.innerHTML = '<li>No se registraron ganancias en este periodo.</li>';
            }
        } else {
            document.getElementById('modal-worked-days').textContent = 'N/A';
            document.getElementById('modal-total-earnings').textContent = 'N/A';
            document.getElementById('earnings-breakdown-list').innerHTML = '<li>No se encontró un cierre anterior.</li>';
        }
        modalClosureSummary.classList.remove('hidden');
    }

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

/**
 * Cambia la ventana modal a "Modo Edición", rellenando todos los campos guardados.
 */
function switchToEditMode() {
    modalViewSection.classList.add('hidden');
    modalEditSection.classList.remove('hidden');

    // Rellenamos AMBOS selectores de tarifas.
    populateOvertimeSelector('override-hourly-rate');
    populateOvertimeSelector('extra-hours-rate-select'); // <-- AÑADIDO

    const nameInput = document.getElementById('override-shift-name');
    const startTimeInput = document.getElementById('override-start-time');
    const endTimeInput = document.getElementById('override-end-time');
    const isPaidCheckbox = document.getElementById('override-is-paid');
    const overtimeSelector = document.getElementById('override-hourly-rate');
    const commentTextarea = document.getElementById('modal-edit-comment');
    const extraHoursInput = document.getElementById('extra-hours-input'); // <-- NUEVO
    const extraHoursRateSelect = document.getElementById('extra-hours-rate-select'); // <-- NUEVO
    
    const dayNote = dayNotes[currentEditingDate] || {};
    const overrideShift = dayNote.overrideShift;

    // Rellenamos el formulario del turno personalizado (si existe).
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
        nameInput.value = '';
        startTimeInput.value = '';
        endTimeInput.value = '';
        isPaidCheckbox.checked = false;
        overrideHourlyRateContainer.classList.add('hidden');
    }
    
    // --- NUEVO: Rellenamos el formulario de horas extras (si existen) ---
    if (dayNote.extraHours) {
        extraHoursInput.value = dayNote.extraHours.hours;
        extraHoursRateSelect.value = dayNote.extraHours.rateId;
    } else {
        extraHoursInput.value = ''; // Limpiamos el campo si no hay horas guardadas
    }

    // Rellenamos siempre el comentario del día.
    commentTextarea.value = dayNote.dailyComment || '';

// Cambiamos los botones del pie de página a "Guardar" y "Cancelar".
const modalFooter = dayModal.querySelector('.modal-footer');
modalFooter.innerHTML = `
    <button id="modal-set-rest-button" class="action-button reset">Poner Descanso</button> <button id="modal-cancel-button" class="action-button">Cancelar</button>
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
    // 1. Leemos TODOS los datos del formulario, incluyendo los nuevos de horas extras.
    const overrideName = document.getElementById('override-shift-name').value;
    const overrideStart = document.getElementById('override-start-time').value;
    const overrideEnd = document.getElementById('override-end-time').value;
    const overrideIsPaid = document.getElementById('override-is-paid').checked;
    const overrideRateId = document.getElementById('override-hourly-rate').value;
    const newComment = document.getElementById('modal-edit-comment').value;
    const extraHours = parseFloat(document.getElementById('extra-hours-input').value) || 0;
    const extraHoursRateId = document.getElementById('extra-hours-rate-select').value;

    // VALIDACIÓN
    if (overrideName.trim() !== '' && (!overrideStart || !overrideEnd)) {
        alert('Si introduces un nombre de turno, también debes especificar la hora de inicio y fin.');
        return;
    }

    // Preparamos el objeto de notas
    if (!dayNotes[currentEditingDate]) {
        dayNotes[currentEditingDate] = {};
    }

    // --- LÓGICA PARA GUARDAR ---

    // Guardamos el turno personalizado (si lo hay)
    if (overrideName.trim() !== '') {
        dayNotes[currentEditingDate].overrideShift = {
            name: overrideName.trim(),
            startTime: overrideStart,
            endTime: overrideEnd,
            isPaid: overrideIsPaid,
            overtimeRateId: overrideIsPaid ? overrideRateId : null,
            color: '#e0e0e0'
        };
    } else {
        delete dayNotes[currentEditingDate].overrideShift;
    }
    
    // Guardamos el comentario del día
    dayNotes[currentEditingDate].dailyComment = newComment.trim();

    // --- NUEVO: Guardamos las horas extras ---
    if (extraHours > 0) {
        dayNotes[currentEditingDate].extraHours = {
            hours: extraHours,
            rateId: extraHoursRateId
        };
    } else {
        delete dayNotes[currentEditingDate].extraHours;
    }

    // Limpieza final
    if (Object.keys(dayNotes[currentEditingDate]).length === 0) {
        delete dayNotes[currentEditingDate];
    }

    // Actualizamos todo
    saveDayNotes();
    renderCalendar();
    dayModal.classList.add('hidden');
}	



// Si se pulsa el botón "Poner Descanso"
if (target.id === 'modal-set-rest-button') { // Usamos el ID del botón que creamos
    // 1. Preguntamos al usuario para confirmar la acción.
    if (confirm('¿Quieres marcar este día como Descanso? Se sobreescribirá el turno actual.')) {
        
        // 2. Creamos un objeto de turno "Descanso" para usarlo como anulación.
        const descansoShift = {
            name: 'Descanso',
            startTime: '',
            endTime: '',
            isPaid: false,
            overtimeRateId: null,
            color: '#f0f2f5' // Un color gris neutro
        };

        // 3. Preparamos o actualizamos la nota de este día.
        if (!dayNotes[currentEditingDate]) {
            dayNotes[currentEditingDate] = {};
        }
        dayNotes[currentEditingDate].overrideShift = descansoShift;
        // Opcional: borramos el comentario del día si queremos que sea un reseteo completo
        // delete dayNotes[currentEditingDate].dailyComment;

        // 4. Guardamos, actualizamos y cerramos.
        saveDayNotes();
        renderCalendar();
        dayModal.classList.add('hidden');
    }
}


// Si se pulsa el botón "Restablecer"
if (target.id === 'modal-reset-button') {
    if (confirm('¿Quieres eliminar los cambios manuales y restablecer el turno del cuadrante?')) {
        
        // --- LÓGICA DE BORRADO PARA FIREBASE (CORREGIDA) ---
        
        // 1. Borramos la nota de nuestra memoria local para que la UI se actualice al instante.
        delete dayNotes[currentEditingDate];
        
        // 2. Comprobamos si hay un usuario con sesión iniciada.
        const user = auth.currentUser;
        if (user) {
            // 3. Creamos la "ruta" exacta al dato que queremos borrar usando "notación de puntos".
            const fieldPath = `dayNotes.${currentEditingDate}`;

            // 4. Damos la orden de borrado directamente a la base de datos.
            db.collection('userData').doc(user.uid).update({
                [fieldPath]: firebase.firestore.FieldValue.delete()
            });
        }
        
        // 5. Actualizamos el calendario y cerramos la ventana.
        renderCalendar();
        dayModal.classList.add('hidden');
    }
}


});


// Evento para "📊 Estadísticas"
menuItemStats.addEventListener('click', () => {
    // Ponemos el resumen en el año actual cada vez que entramos
    summaryYear = new Date().getFullYear();
    // Dibujamos ambos resúmenes
    renderQuadrantSummary();
    renderMonthlyAnnualSummary();
    // Mostramos la pantalla
    settingsView.classList.add('hidden');
    statsView.classList.remove('hidden');
});

// Evento para el botón de volver desde Estadísticas
backToSettingsFromStatsButton.addEventListener('click', () => {
    statsView.classList.add('hidden');
    settingsView.classList.remove('hidden');
});


// Evento para "ℹ️ Info"
menuItemInfo.addEventListener('click', () => {
    settingsView.classList.add('hidden');
    infoView.classList.remove('hidden');
});

// Evento para volver desde Información
backToSettingsFromInfoButton.addEventListener('click', () => {
    infoView.classList.add('hidden');
    settingsView.classList.remove('hidden');
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
 * Calcula los días trabajados (dietas), las ganancias totales y el desglose
 * en un rango de fechas. Versión compatible con múltiples turnos.
 */
function calculatePeriodSummary(startDate, endDate) {
    let workedDays = 0;
    let totalEarnings = 0;
    const earningsBreakdown = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const onVacation = isDateOnVacation(currentDate);
        // Usamos la función que nos da TODOS los turnos del día.
        const allTurns = getAllTurnsForDate(currentDate);
        
        // --- LÓGICA PARA CONTAR DIETAS (DÍAS TRABAJADOS) ---
        // Un día se considera trabajado si:
        // 1. NO es vacaciones.
        // 2. Tiene al menos un turno asignado.
        // 3. Al menos uno de esos turnos NO es "Descanso".
        const hasWorkTurn = allTurns.length > 0 && allTurns.some(turn => turn.name !== 'Descanso');

        if (!onVacation && hasWorkTurn) {
            workedDays++;
        }

        // --- LÓGICA DE GANANCIAS Y DESGLOSE ---
        if (!onVacation) {
            // 1. Recorremos TODOS los turnos del día para sumar sus ganancias individuales.
            allTurns.forEach(turn => {
                // Calculamos SOLO las ganancias de este turno (sin horas extras del día).
                const turnEarningsStr = calculateEarnings(turn, currentDate, true, false);
                const turnAmount = parseFloat(turnEarningsStr);

                if (turnAmount > 0) {
                    totalEarnings += turnAmount;
                    
                    // Buscamos el nombre de la tarifa para el desglose.
                    let sourceName = turn.name;
                    if (turn.overtimeRateId) {
                        const rate = overtimeRates.find(r => r.id === Number(turn.overtimeRateId));
                        if (rate) sourceName += ` (${rate.name})`;
                    }

                    earningsBreakdown.push({
                        date: new Date(currentDate),
                        source: sourceName,
                        amount: turnAmount
                    });
                }
            });

            // 2. Calculamos las ganancias de las horas extras (una vez por día).
            const extraEarningsStr = calculateEarnings(null, currentDate, false, true);
            const extraAmount = parseFloat(extraEarningsStr);

            if (extraAmount > 0) {
                totalEarnings += extraAmount;
                
                // Buscamos el nombre de la tarifa de las horas extras.
                const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
                const dayNote = dayNotes[dateKey];
                let rateName = '';
                if (dayNote && dayNote.extraHours) {
                    const rate = overtimeRates.find(r => r.id === Number(dayNote.extraHours.rateId));
                    if (rate) rateName = ` (${rate.name})`;
                }

                earningsBreakdown.push({
                    date: new Date(currentDate),
                    source: `Horas Extra${rateName}`,
                    amount: extraAmount
                });
            }
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return { workedDays, totalEarnings, earningsBreakdown };
}


/**
 * Calcula el total de horas para cada semana de un patrón de cuadrante.
 * VERSIÓN ACTUALIZADA: Ahora sabe sumar múltiples turnos por día.
 * @param {object} quadrant - El objeto del cuadrante que se quiere analizar.
 * @returns {Array<number>} - Una lista con el total de horas de cada semana.
 */
function calculateQuadrantWeeklyHours(quadrant) {
    const weeklyHours = [];

    // Recorremos cada patrón de semana que tenga el cuadrante.
    quadrant.patterns.forEach(weekPattern => {
        let totalHoursOfWeek = 0;

        // Recorremos cada día de esa semana (lunes, martes, etc.).
        for (const day in weekPattern) {
            // Obtenemos la LISTA de IDs de turno para ese día.
            const turnIdsForDay = weekPattern[day];

            // --- LÓGICA CORREGIDA ---
            // Nos aseguramos de que es una lista y la recorremos.
            if (Array.isArray(turnIdsForDay)) {
                // Por cada ID de turno en la lista...
                turnIdsForDay.forEach(turnId => {
                    if (turnId !== 'REST') {
                        const turn = shifts.find(s => s.id === Number(turnId));
                        if (turn && turn.startTime && turn.endTime) {
                            // ...calculamos sus horas y las sumamos al total de la semana.
                            const hoursString = calculateTotalHours(turn.startTime, turn.endTime);
                            totalHoursOfWeek += parseFloat(hoursString) || 0;
                        }
                    }
                });
            }
            // --- FIN DE LA CORRECCIÓN ---
        }
        // Añadimos el total de la semana a nuestra lista de resultados.
        weeklyHours.push(totalHoursOfWeek);
    });

    return weeklyHours;
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




// ********************************************************************************************************************************************************************************************************************************************
// --- LÓGICA PARA ACTUALIZAR EL DÍA "HOY" AUTOMÁTICAMENTE ---
// ********************************************************************************************************************************************************************************************************************************************

/**
 * Este "oyente" se activa cada vez que la pestaña de la aplicación se vuelve visible.
 */
document.addEventListener('visibilitychange', () => {
    // Si el estado de la pestaña es "visible"...
    if (document.visibilityState === 'visible') {
        // ...volvemos a dibujar el calendario.
        // La función renderCalendar ya sabe cómo encontrar el día de hoy y destacarlo.
        console.log('La aplicación se ha vuelto visible. Actualizando calendario...');
        renderCalendar();
    }
});




// ********************************************************************************************************************************************************************************************************************************************
// --- LÓGICA PARA EL RESUMEN MENSUAL Y ANUAL ---
// ********************************************************************************************************************************************************************************************************************************************


/**
 * Dibuja el resumen de horas mensual y anual, destacando los totales que superan el límite.
 */
function renderMonthlyAnnualSummary() {
    // Definimos los límites aquí para que sean fáciles de cambiar en el futuro. mensual anual
    const MONTHLY_HOUR_LIMIT = 225;
    const ANNUAL_HOUR_LIMIT = 2160;

    summaryYearDisplay.textContent = summaryYear;
    summaryResultsContainer.innerHTML = '';

    // --- Cálculo Anual ---
    const yearStartDate = new Date(summaryYear, 0, 1);
    const yearEndDate = new Date(summaryYear, 11, 31);
    const totalAnnualHours = calculateTotalHoursForPeriod(yearStartDate, yearEndDate);

    // Comprobamos si el total anual supera el límite.
    const annualLimitClass = totalAnnualHours > ANNUAL_HOUR_LIMIT ? 'over-limit' : '';

    let monthlyResultsHTML = '';
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // --- Cálculo Mensual ---
    for (let month = 0; month < 12; month++) {
        let startDate, endDate;
        // ... (el resto de la lógica para calcular startDate y endDate sigue igual) ...
        if (summaryMode === 'closureToClosure') {
            const currentClosureDay = shiftClosures[month] || 24;
            const prevMonth = (month === 0) ? 11 : month - 1;
            const prevYear = (month === 0) ? summaryYear - 1 : summaryYear;
            const prevClosureDay = shiftClosures[prevMonth] || 24;
            
            startDate = new Date(prevYear, prevMonth, prevClosureDay + 1);
            endDate = new Date(summaryYear, month, currentClosureDay);
        } else {
            startDate = new Date(summaryYear, month, 1);
            endDate = new Date(summaryYear, month + 1, 0);
        }

        const totalMonthHours = calculateTotalHoursForPeriod(startDate, endDate);
        
        // Comprobamos si el total mensual supera el límite.
        const monthlyLimitClass = totalMonthHours > MONTHLY_HOUR_LIMIT ? 'over-limit' : '';
        
        monthlyResultsHTML += `<li><span>${monthNames[month]}</span> <strong class="${monthlyLimitClass}">${totalMonthHours.toFixed(2)} H</strong></li>`;
    }

    // "Pintamos" los resultados en el HTML, aplicando la clase si es necesario.
    summaryResultsContainer.innerHTML = `
        <ul>
            <li class="total-annual"><span>Total Anual</span> <strong class="${annualLimitClass}">${totalAnnualHours.toFixed(2)} H</strong></li>
            ${monthlyResultsHTML}
        </ul>
    `;
}

// --- Eventos para los botones y el interruptor ---

// Botón para ir al año anterior
prevYearSummaryBtn.addEventListener('click', () => {
    summaryYear--;
    renderMonthlyAnnualSummary();
});

// Botón para ir al año siguiente
nextYearSummaryBtn.addEventListener('click', () => {
    summaryYear++;
    renderMonthlyAnnualSummary();
});

// Interruptor para cambiar el modo de cálculo
summaryModeToggle.addEventListener('change', () => {
    summaryMode = summaryModeToggle.checked ? 'closureToClosure' : 'fullMonth';
    renderMonthlyAnnualSummary();
});









// ********************************************************************************************************************************************************************************************************************************************
// --- LÓGICA DEL TUTORIAL DE BIENVENIDA ---
// ********************************************************************************************************************************************************************************************************************************************


/**
 * Comprueba si debe mostrar un tutorial y muestra el mensaje adecuado
 * según si el usuario ha iniciado sesión o está en modo invitado.
 */
function checkAndShowTutorial() {
    // 1. Obtenemos el usuario actual para saber en qué modo estamos.
    const user = auth.currentUser;
    
    // Seleccionamos los elementos de la ventana del tutorial.
    const tutorialTitle = document.getElementById('tutorial-title');
    const tutorialBody = document.getElementById('tutorial-body');

    // --- LÓGICA INVERTIDA Y CORREGIDA ---

    if (!user) {
        // --- CASO 1: MODO INVITADO ---
        // Si no hay usuario, SIEMPRE mostramos el aviso sobre el guardado local.
        tutorialTitle.textContent = 'Estás en Modo Invitado';
        tutorialBody.innerHTML = `
        <p>Todo lo que crees se guardará <strong>únicamente en este dispositivo</strong>. Para guardar tus datos en la nube, te recomendamos <strong>crear una cuenta gratis</strong> o iniciar sesión.</p>
        
        <hr> 

        <p>Para empezar, solo necesitas seguir dos sencillos pasos:</p>
        <ol class="tutorial-steps">
            <li><span>1</span> Ve a <strong>Configuración > 🎨 Turnos</strong> y crea tus turnos.</li>
            <li><span>2</span> Luego, ve a <strong>Configuración > 🔄 Cuadrante</strong> y define tu rotación.</li>
        </ol>
    `;
        welcomeTutorial.classList.remove('hidden');

    } else {
        // --- CASO 2: MODO REGISTRADO ---
        // Si hay un usuario, comprobamos si ya ha completado el tutorial.
        const tutorialCompleted = localStorage.getItem('calendarTutorialCompleted');
        
        // Si no lo ha completado y además no tiene datos, le mostramos los primeros pasos.
        if (tutorialCompleted !== 'true' && (shifts.length === 0 || quadrants.length === 0)) {
            tutorialTitle.textContent = '¡Bienvenido/a!';
            tutorialBody.innerHTML = `
                <p>Para empezar, solo necesitas seguir dos sencillos pasos:</p>
                <ol class="tutorial-steps">
                    <li><span>1</span> Ve a <strong>Configuración > 🎨 Turnos</strong> y crea tus turnos.</li>
                    <li><span>2</span> Luego, ve a <strong>Configuración > 🔄 Cuadrante</strong> y define tu rotación.</li>
                </ol>
                <p>Tus datos se guardarán automáticamente en tu cuenta en la nube.</p>
            `;
            welcomeTutorial.classList.remove('hidden');
        }
    }
}

/**
 * Oculta el tutorial y guarda en memoria que ya se ha completado.
 */
closeTutorialButton.addEventListener('click', () => {
    welcomeTutorial.classList.add('hidden');
    // Guardamos una "marca" para no volver a mostrarlo.
    //localStorage.setItem('calendarTutorialCompleted', 'true');
});






// ********************************************************************************************************************************************************************************************************************************************
// --- LÓGICA DE AUTENTICACIÓN ---
// ********************************************************************************************************************************************************************************************************************************************

//Dibuja la cabecera para un usuario "invitado".


/**
 * Rellena el campo de nombre de usuario si hay uno guardado.
 * Si no hay ninguno, se asegura de que tanto el usuario como la contraseña estén vacíos.
 */
function prefillUsername() {
    // Buscamos el nombre de usuario guardado.
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    // Seleccionamos los campos de texto del formulario.
    const loginNameInput = document.getElementById('login-name');
    const loginPasswordInput = document.getElementById('login-password');

    if (rememberedUsername) {
        // Si encontramos un nombre, lo ponemos en el campo.
        // Dejamos que el navegador rellene la contraseña si quiere.
        loginNameInput.value = rememberedUsername;
    } else {
        // Si NO encontramos nada, nos aseguramos de que AMBOS campos estén vacíos.
        loginNameInput.value = '';
        loginPasswordInput.value = ''; // <-- ESTA LÍNEA ES LA CLAVE
    }
}

function renderGuestHeader() {
    // Creamos el botón de "Iniciar Sesión".
    headerTitleContainer.innerHTML = `<button id="show-auth-view-button" class="header-button">Iniciar Sesión</button>`;

    // Le añadimos la funcionalidad al botón que acabamos de crear.
	document.getElementById('show-auth-view-button').addEventListener('click', () => {
		// Ocultamos la app principal y mostramos la pantalla de login.
		appContainer.classList.add('hidden');
		authView.classList.remove('hidden');

		// --- AÑADIDO ---
		// Nos aseguramos de que siempre se muestre el formulario de login por defecto.
		loginForm.classList.remove('hidden');
		registerForm.classList.add('hidden');
	});
}

// Evento para el nuevo botón de volver desde la pantalla de login al calendario
backToAppFromAuthButton.addEventListener('click', () => {
    authView.classList.add('hidden');
    appContainer.classList.remove('hidden');
});



// --- Lógica para cambiar entre formularios de Login y Registro ---

// Cuando se pulsa en "Regístrate"
showRegisterLink.addEventListener('click', (event) => {
    event.preventDefault(); // Evita que la página se recargue
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

// Cuando se pulsa en "Inicia sesión"
showLoginLink.addEventListener('click', (event) => {
    event.preventDefault(); // Evita que la página se recargue
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});


// --- Lógica del botón de Registro (VERSIÓN CON COMPROBACIÓN DE USUARIO) ---
registerButton.addEventListener('click', (event) => {
    event.preventDefault();
    registerError.classList.add('hidden');

    const name = registerNameInput.value.trim();
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;

    if (!name || !email || !password) {
        registerError.textContent = 'Por favor, rellena todos los campos.';
        registerError.classList.remove('hidden');
        return;
    }
    
    // --- NUEVA COMPROBACIÓN ---
    // 1. Primero, buscamos si el nombre de usuario ya existe en la base de datos.
    db.collection('users').where('displayName', '==', name).get()
        .then((querySnapshot) => {
            // 2. Si la búsqueda encuentra algún resultado, el nombre ya está en uso.
            if (!querySnapshot.empty) {
                registerError.textContent = 'Ese nombre de usuario ya está en uso. Por favor, elige otro.';
                registerError.classList.remove('hidden');
            } else {
                // 3. Si está libre, procedemos a crear el usuario en Firebase Authentication.
                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;

                        // 4. Actualizamos el perfil del usuario con su nombre.
                        user.updateProfile({
                            displayName: name
                        }).then(() => {
                            // 5. Creamos su documento en la base de datos Firestore.
                            db.collection('users').doc(user.uid).set({
                                displayName: name,
								displayName_lowercase: name.toLowerCase(), 
                                email: user.email,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp()
                            });
                            // El "portero" (onAuthStateChanged) se encargará del resto.
                        });
                    })
                    .catch((error) => {
                        // Gestionamos errores de Firebase (email ya en uso, contraseña débil, etc.)
                        switch (error.code) {
                            case 'auth/email-already-in-use':
                                registerError.textContent = 'Este correo electrónico ya está registrado.';
                                break;
                            case 'auth/weak-password':
                                registerError.textContent = 'La contraseña debe tener al menos 6 caracteres.';
                                break;
                            default:
                                registerError.textContent = 'Ha ocurrido un error al registrar la cuenta.';
                        }
                        registerError.classList.remove('hidden');
                    });
            }
        });
});



// --- Lógica del botón de Iniciar Sesión (con "Recordarme") ---
loginButton.addEventListener('click', (event) => {
    event.preventDefault();
    loginError.classList.add('hidden');

    // Leemos el estado de la casilla "Recordarme".
    const rememberMe = rememberMeCheckbox.checked;
    
    // Decidimos qué tipo de sesión usar.
    const persistence = rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
    
    // Le decimos a Firebase qué tipo de sesión queremos.
    auth.setPersistence(persistence)
        .then(() => {
            const name = document.getElementById('login-name').value.trim();
            const password = loginPasswordInput.value;

            if (!name || !password) {
                loginError.textContent = 'Por favor, introduce tu nombre de usuario y contraseña.';
                loginError.classList.remove('hidden');
                return;
            }

            // Si el usuario quiere ser recordado, guardamos su nombre de usuario.
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', name);
            } else {
                localStorage.removeItem('rememberedUsername');
            }

            // ... (el resto de tu código para buscar el email e iniciar sesión sigue aquí sin cambios) ...
             db.collection('users').where('displayName_lowercase', '==', name.toLowerCase()).get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        loginError.textContent = 'El nombre de usuario no existe.';
                        loginError.classList.remove('hidden');
                        return;
                    }
                    const userData = querySnapshot.docs[0].data();
                    auth.signInWithEmailAndPassword(userData.email, password)
                        .catch((error) => {
                            loginError.textContent = 'La contraseña es incorrecta.';
                            loginError.classList.remove('hidden');
                        });
                });
        });
});


// --- Lógica para el botón de Cerrar Sesión en el menú ---
logoutMenuButton.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres cerrar la sesión?')) {
        // Borramos el nombre de usuario guardado de la memoria local.
        //localStorage.removeItem('rememberedUsername'); // <-- AÑADE ESTA LÍNEA

        // Cerramos la sesión en Firebase.
        auth.signOut();
    }
});



// --- Lógica para el enlace de "He olvidado mi contraseña" ---
forgotPasswordLink.addEventListener('click', (event) => {
    event.preventDefault();

    // 1. Pedimos al usuario su correo electrónico.
    const email = prompt('Por favor, introduce tu correo electrónico para restablecer la contraseña:');

    // 2. Si el usuario introduce un correo...
    if (email) {
        // 3. ...le pedimos a Firebase que envíe el correo de recuperación.
        auth.sendPasswordResetEmail(email)
            .then(() => {
                // Si todo va bien, informamos al usuario.
                alert('Se ha enviado un correo a tu dirección. Revisa tu bandeja de entrada para restablecer la contraseña.');
            })
            .catch((error) => {
                // Si hay un error (ej: el correo no existe), también informamos.
                alert('No se pudo enviar el correo. Asegúrate de que la dirección es correcta y está registrada.');
                console.error("Error al enviar correo de recuperación:", error);
            });
    }
});



// ===============================================================
// --- LÓGICA DE NOTIFICACIONES ---
// ===============================================================

// 1. AL CAMBIAR EL INTERRUPTOR
if (notificationsToggle) {
    // Al cargar la página, ponemos el interruptor como estaba guardado
    notificationsToggle.checked = localStorage.getItem('notificationsEnabled') === 'true';

    notificationsToggle.addEventListener('change', () => {
        if (notificationsToggle.checked) {
            // Pedimos permiso al navegador
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    localStorage.setItem('notificationsEnabled', 'true');
                    // Prueba inmediata para confirmar
                    new Notification("✅ Notificaciones activadas", { 
                        body: "Te avisaremos los días de cierre y cambios manuales.",
                        icon: "favicon.png"
                    });
                } else {
                    notificationsToggle.checked = false;
                    alert("No has dado permiso para recibir notificaciones en tu dispositivo.");
                    localStorage.setItem('notificationsEnabled', 'false');
                }
            });
        } else {
            localStorage.setItem('notificationsEnabled', 'false');
        }
    });
}

// 2. EL CEREBRO: Comprobar si toca aviso hoy
function checkDailyAlerts() {
    const isEnabled = localStorage.getItem('notificationsEnabled') === 'true';
    
    // Si están desactivadas o no tenemos permiso, no hacemos nada
    if (!isEnabled || Notification.permission !== 'granted') return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Evitamos repetir la notificación el mismo día
    const lastAlertDate = localStorage.getItem('lastAlertDate');
    const todayStr = today.toDateString();

    if (lastAlertDate === todayStr) return; // Ya avisamos hoy

    // Comprobamos si hay algo importante hoy
    const isClosure = isShiftClosureDay(today);
    const isOverridden = isDayOverridden(today);

    if (isClosure || isOverridden) {
        let title = "📅 Aviso del Calendario";
        let body = "";

        if (isClosure && isOverridden) {
            body = "⚠️ Hoy es CIERRE DE TURNO y tienes cambios manuales (📌).";
        } else if (isClosure) {
            body = "✅ Recordatorio: Hoy es día de CIERRE DE TURNO.";
        } else if (isOverridden) {
            body = "📌 Recordatorio: Hoy tienes cambios manuales en tu turno.";
        }

        // Lanzamos la notificación
        new Notification(title, { body: body, icon: "favicon.png" });
        
        // Marcamos que ya hemos avisado hoy para no ser pesados
        localStorage.setItem('lastAlertDate', todayStr);
    }
}