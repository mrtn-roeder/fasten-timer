if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('Service Worker registriert'))
    .catch(err => console.error('SW Fehler', err));
}

let startTime = localStorage.getItem('fastingStartTime');
let timerInterval;

function updateTimer() {
    if (!startTime) return;

    const now = new Date().getTime();
    const elapsed = Math.floor((now - startTime) / 1000);
    
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor(elapsed / 60) % 60;
    const seconds = elapsed % 60;

    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;

    const totalMinutes = hours * 60 + minutes;
    const phases = [
        { time: 0, id: 'phase-1' }, { time: 30, id: 'phase-2' },
        { time: 60, id: 'phase-3' }, { time: 240, id: 'phase-4' },
        { time: 480, id: 'phase-5' }, { time: 720, id: 'phase-6' }
    ];

    phases.forEach((phase, index) => {
        const element = document.getElementById(phase.id);
        const isCurrent = totalMinutes >= phase.time && (index === phases.length - 1 || totalMinutes < phases[index + 1].time);
        
        if (isCurrent && !element.classList.contains('current')) {
            document.querySelector('.phase.current')?.classList.remove('current');
            element.classList.add('current');
        }
    });
}

function startTimer() {
    const input = document.getElementById('last-meal-datetime').value;
    const display = document.getElementById('timer-display');

    if (input) {
        startTime = new Date(input).getTime();
        localStorage.setItem('fastingStartTime', startTime);
        
        display.style.transition = "color 0.3s";
        display.style.color = "#4CAF50"; 
        setTimeout(() => display.style.color = "", 500);
    } else if (!startTime) {
        startTime = new Date().getTime();
        localStorage.setItem('fastingStartTime', startTime);
    }

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

function resetTimer() {
    if(confirm("Timer wirklich zurücksetzen?")) {
        localStorage.removeItem('fastingStartTime');
        startTime = null;
        clearInterval(timerInterval);
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        document.querySelector('.phase.current')?.classList.remove('current');
        document.getElementById('last-meal-datetime').value = '';
    }
}

if (startTime) {
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}