const textDisplay = document.getElementById('text-display');
const startBtn = document.getElementById('start-btn');
const startOverlay = document.getElementById('start-overlay');
const restartBtn = document.getElementById('restart-btn');

const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const timerElement = document.getElementById('timer');
const personalBestElement = document.getElementById('personal-best');

let currentText = "";
let currentDifficulty = "medium";
let isTestRunning = false;
let currentIndex = 0;