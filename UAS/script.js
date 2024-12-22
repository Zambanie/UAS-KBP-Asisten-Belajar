// Timer functionality
let timerInterval;
let isStudyTime = true;
let isRunning = false;
let timeLeft;

// DOM Elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('startTimer');
const pauseButton = document.getElementById('pauseTimer');
const resetButton = document.getElementById('resetTimer');
const studyMinutesInput = document.getElementById('studyMinutes');
const breakMinutesInput = document.getElementById('breakMinutes');
const timerState = document.getElementById('timerState');
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTask');
const taskList = document.getElementById('taskList');

// Music Player Control
const localMusicInput = document.getElementById('localMusic');
const onlineMusicInput = document.getElementById('onlineMusic');
const playMusicButton = document.getElementById('playMusic');
const pauseMusicButton = document.getElementById('pauseMusic');
const musicState = document.getElementById('musicState');
let audio = new Audio();

// Alarm sounds
const alarmSound = new Audio('alarm.mp3'); // Add your alarm sound file here
const breakAlarmSound = new Audio('selesai.mp3'); // Add your break alarm sound file here

function playMusic() {
    const localMusicFile = localMusicInput.files[0];
    const onlineMusicUrl = onlineMusicInput.value.trim();

    if (localMusicFile) {
        const fileURL = URL.createObjectURL(localMusicFile);
        audio.src = fileURL;
    } else if (onlineMusicUrl) {
        audio.src = onlineMusicUrl;
    } else {
        alert('Please select a local music file or enter an online music URL.');
        return;
    }

    audio.play();
    musicState.textContent = 'Playing Music';
}

function pauseMusic() {
    audio.pause();
    musicState.textContent = 'Music Paused';
}

// Timer Functions
function startTimer() {
    if (isRunning) return;

    if (!timeLeft) {
        timeLeft = isStudyTime ? studyMinutesInput.value * 60 : breakMinutesInput.value * 60;
    }

    isRunning = true;
    document.querySelector('.timer-display').classList.add('running');
    saveTimerState();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        saveTimerState();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (isStudyTime) {
                alarmSound.play();
            } else {
                breakAlarmSound.play();
            }
            switchTimerMode();
        }
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;

    clearInterval(timerInterval);
    isRunning = false;
    document.querySelector('.timer-display').classList.remove('running');
    saveTimerState();
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    document.querySelector('.timer-display').classList.remove('running');
    timeLeft = isStudyTime ? studyMinutesInput.value * 60 : breakMinutesInput.value * 60;
    updateTimerDisplay();
    saveTimerState();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function switchTimerMode() {
    isStudyTime = !isStudyTime;
    timerState.textContent = isStudyTime ? 'Waktu Belajar' : 'Waktu Istirahat';
    timeLeft = isStudyTime ? studyMinutesInput.value * 60 : breakMinutesInput.value * 60;
    updateTimerDisplay();
    isRunning = false;
    document.querySelector('.timer-display').classList.remove('running');
    saveTimerState();
    if (!isStudyTime) {
        startTimer();
    }
}

function saveTimerState() {
    const timerState = {
        isStudyTime,
        isRunning,
        timeLeft,
        studyMinutes: studyMinutesInput.value,
        breakMinutes: breakMinutesInput.value
    };
    localStorage.setItem('timerState', JSON.stringify(timerState));
}

function loadTimerState() {
    const savedState = JSON.parse(localStorage.getItem('timerState'));
    if (savedState) {
        isStudyTime = savedState.isStudyTime;
        isRunning = savedState.isRunning;
        timeLeft = savedState.timeLeft;
        studyMinutesInput.value = savedState.studyMinutes;
        breakMinutesInput.value = savedState.breakMinutes;
        timerState.textContent = isStudyTime ? 'Waktu Belajar' : 'Waktu Istirahat';
        updateTimerDisplay();
        if (isRunning) {
            startTimer();
        }
    } else {
        resetTimer();
    }
}

// Todo List Functions
function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement('li');
    li.innerHTML = `
        <span>${taskText}</span>
        <div class="task-actions">
            <button class="complete-btn" onclick="toggleTask(this)">
                <i class="fas fa-check"></i>
            </button>
            <button class="delete-btn" onclick="deleteTask(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    taskList.appendChild(li);
    taskInput.value = '';
    saveTasksToLocalStorage();
}

function toggleTask(button) {
    const li = button.closest('li');
    li.classList.toggle('completed');
    saveTasksToLocalStorage();
}

function deleteTask(button) {
    const li = button.closest('li');
    li.remove();
    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('.task-list li').forEach(li => {
        tasks.push({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleTask(this)">
                    <i class="fas fa-check"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Event Listeners for Music controls
playMusicButton.addEventListener('click', playMusic);
pauseMusicButton.addEventListener('click', pauseMusic);

// Initialize
loadTimerState();
loadTasksFromLocalStorage();
