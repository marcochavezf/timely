let dayTimeMilli = -1;
let nowDate = null;
let initDate = null;
let prevDate = null;
let totalTimeElement = null;
let sessionTimeElement = null;
let dayTimeDivWasAdded = false;
let showTimeOut = null;
const colors = [
	'#ffffff', //white
	'#FFFFBF',
	'#FFFF80',
	'#FFFF40',
	'#ffff00', //yellow
	'#FFE900',
	'#FFD200',
	'#FFBC00',
	'#ffa500', //orange
	'#FF7C00',
	'#FF5300',
	'#FF2900',
	'#ff0000'  //red
];

init();

////////////

function init() {
	nowDate = new Date();
	initDate = new Date();

	//create div elements
	sessionTimeElement = document.createElement('div');
	sessionTimeElement.classList.add('timely-clock');
	sessionTimeElement.classList.add('timely-session-time');
	document.body.appendChild(sessionTimeElement);

	totalTimeElement = document.createElement('div');
	totalTimeElement.classList.add('timely-clock');
	totalTimeElement.classList.add('timely-day-time');

	showTime();
	window.onunload = onunloadEvent;
	document.addEventListener('mousemove', mousemoveEvent);
	chrome.runtime.sendMessage({ requireDayTime: initDate.getTime() }, responseDayTime);
}

function getColor(value, maxValue) {
	let indexColor = Math.floor(value / maxValue * (colors.length - 1));
	indexColor = indexColor >= colors.length ? colors.length - 1 : indexColor;
	return colors[indexColor];
}

function getClockData(milliseconds, minutesTopColor) {
	let width = 170;
	const dayInMilli = 1000 * 60 * 60 * 24;
	milliseconds = milliseconds % dayInMilli;
	let h = 0;
	let m = Math.trunc(milliseconds / 1000 / 60);
	let s = Math.trunc(milliseconds / 1000 % 60);

	const color = getColor(m, minutesTopColor);
	if (m >= 60) {
		h = Math.trunc(m / 60);
		m = Math.trunc(m % 60);
		width = 220;
	}

	h = h < 0 ? '' : (h < 10) ? '0' + h : h;
	m = (m < 10) ? '0' + m : m;
	s = (s < 10) ? '0' + s : s;

	let label = m + ':' + s;
	if (h > 0) {
		label = h + ':' + label;
	}
	return { label, width, color };
}

function showTime() {
	prevDate = nowDate;
	nowDate = new Date();
	const sessionMilli = nowDate - initDate;
	const sessionData = getClockData(sessionMilli, 15);
	sessionTimeElement.innerText = sessionData.label;
	sessionTimeElement.textContent = sessionData.label;
	sessionTimeElement.style.width = sessionData.width + 'px';
	sessionTimeElement.style.color = sessionData.color;

	if (dayTimeMilli >= 0) {
		dayTimeMilli += nowDate - prevDate; //save dayTime in local storage
		const dayData = getClockData(dayTimeMilli, 60);

		if (!dayTimeDivWasAdded) {
			dayTimeDivWasAdded = true;
			document.body.appendChild(totalTimeElement);
		}

		totalTimeElement.innerText = dayData.label;
		totalTimeElement.textContent = dayData.label;
		totalTimeElement.style.width = dayData.width + 'px';
		totalTimeElement.style.right = (sessionData.width + 20) + 'px';
		totalTimeElement.style.color = dayData.color;
	}

	showTimeOut = setTimeout(showTime, 1000);
}

function onunloadEvent(e) {
	clearTimeout(showTimeOut);
	if (dayTimeMilli) {
		chrome.runtime.sendMessage({ newDayTime: dayTimeMilli, requireDayTime: initDate.getTime() });
	}
}

function mousemoveEvent(e) {
	const inZoneX = e.view.outerWidth - e.x <= 400;
	const inZoneY = e.y < 65;
	if (inZoneX && inZoneY) {
		sessionTimeElement.style.top = 'auto';
		totalTimeElement.style.top = 'auto';
		sessionTimeElement.style.bottom = 0;
		totalTimeElement.style.bottom = 0;
	} else {
		sessionTimeElement.style.top = 0;
		totalTimeElement.style.top = 0;
		sessionTimeElement.style.bottom = 'auto';
		totalTimeElement.style.bottom = 'auto';
	}
}

function responseDayTime(response) {
	const { dayTime, initDayTime } = response;
	dayTimeMilli = dayTime || 0;
	if (initDayTime >= 0) {
		dayTimeMilli += nowDate - initDayTime;
	}
	dayTimeMilli += nowDate - initDate;
}

