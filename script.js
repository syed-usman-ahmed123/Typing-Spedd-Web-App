const textDisplay = document.getElementById('text-display');
const startBtn = document.getElementById('start-btn');
const startOverlay = document.getElementById('start-overlay');
const restartBtn = document.getElementById('restart-btn');

const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const timerElement = document.getElementById('timer');
const personalBestElement = document.getElementById('personal-best');

const resultsScreen = document.getElementById('results-screen');
const finalWpm = document.getElementById('final-wpm');
const finalAccuracy = document.getElementById('final-accuracy');
const finalChars = document.getElementById('final-chars');
const resultTitle = document.getElementById('result-title');
const resultSubtitle = document.getElementById('result-subtitle');
const goAgainBtn = document.getElementById('go-again-btn');


let currentText = "";
let currentDifficulty = "medium";
let isTestRunning = false;
let currentIndex = 0;

let timer = 60;
let timerInterval = null;
let totalTyped = 0;
let errors = 0;

// 3. Page load hote hi Personal Best show karwane wali line YAHAN aayegi (variables ke baad)
personalBestElement.innerText = `${localStorage.getItem('typingPersonalBest') || 0} WPM`;

const texts = {
    easy: [
        "The quick brown fox jumps over the lazy dog. Practice makes perfect when learning to type faster and more accurately every day.",
        "Typing is a useful skill in the modern world. Everyone should try to improve their speed and accuracy with regular practice sessions.",
        "Learning to type without looking at the keyboard is called touch typing. It helps you work much faster and reduces mistakes over time.",
        "Simple sentences are the best way to start practicing. Focus on accuracy first, then slowly try to increase your typing speed."
    ],
    medium: [
        "The archaeological expedition unearthed artifacts that complicated prevailing theories about Bronze Age trade networks across distant regions.",
        "Obsidian from Anatolia, lapis lazuli from Afghanistan, and amber from the Baltic were all discovered in a single ancient tomb complex.",
        "Scientists believe that early civilizations had more advanced trade systems than previously thought. Evidence continues to support this idea.",
        "Many researchers now agree that cultural exchange happened on a much larger scale during the Bronze Age than old textbooks suggested."
    ],
    hard: [
        "The archaeological expedition unearthed artifacts that complicated prevailing theories about Bronze Age trade networks. Obsidian from Anatolia, lapis lazuli from Afghanistan, and amber from the Baltic—all discovered in a single Mycenaean tomb—suggested commercial connections far more extensive than previously hypothesized.",
        "We've underestimated ancient peoples' navigational capabilities and their appetite for luxury goods, the lead researcher observed. Globalization isn't as modern as we assume. Complex supply chains existed thousands of years before the modern era began.",
        "Recent discoveries in the Mediterranean have forced historians to reconsider long-held assumptions about prehistoric commerce. The presence of materials from three different continents in one burial site indicates sophisticated knowledge of geography and trade routes."
    ]
};

function getRandomText(difficulty) {
    const arr = texts[difficulty];
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function renderText(text) {
    textDisplay.innerHTML = "";

    text.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.classList.add("char");
        span.innerText = char;

        if (index === 0) {
            span.classList.add("current");
        }

        textDisplay.appendChild(span);
    });
}

function startTest() {
    currentText = getRandomText(currentDifficulty);
    renderText(currentText);


    startOverlay.classList.add("hidden");
    restartBtn.classList.remove("hidden");


    textDisplay.classList.remove("blurred");

    isTestRunning = true;
    currentIndex = 0;
}


// Keyboard input sunne ke liye
document.addEventListener('keydown', (e) => {
    if (!isTestRunning) return;

    // Agar timer pehli baar chal raha hai, to countdown shuru karo
    if (!timerInterval) {
        startTimer();
    }

    // Backspace handle karne ke liye (optional abhi ke liye, pehle normal typing dekhte hain)
    if (e.key === 'Backspace') return;


    // Sirf single characters ko handle karein (jaise letters, spaces, punctuation)
    if (e.key.length === 1) {
        const spanElements = textDisplay.querySelectorAll('.char');
        const targetChar = currentText[currentIndex];

        totalTyped++; // Total characters typed track karne ke liye

        if (e.key === targetChar) {
            spanElements[currentIndex].classList.add('correct');
        } else {
            spanElements[currentIndex].classList.add('incorrect');
            errors++; // Ghalat key press hone par errors barhayein
        }

        spanElements[currentIndex].classList.remove('current');
        currentIndex++;

        if (currentIndex < spanElements.length) {
            spanElements[currentIndex].classList.add('current');
            updateStats(); // Live WPM aur Accuracy update karein
        } else {
            endTest(); // Agar text khatam ho jaye
        }
    }
});


function startTimer() {
    timerInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            timerElement.innerText = `0:${timer < 10 ? '0' : ''}${timer}`;
        } else {
            endTest();
        }
    }, 1000);
}

function updateStats() {
    // WPM Formula: (Correct Characters / 5) / Elapsed Minutes
    const timeElapsed = (60 - timer) / 60;
    const correctTyped = currentIndex - errors;
    const wpm = timeElapsed > 0 ? Math.round((correctTyped / 5) / timeElapsed) : 0;
    wpmElement.innerText = wpm;

    // Accuracy Formula: ((Total - Errors) / Total) * 100
    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
    accuracyElement.innerText = `${accuracy}%`;
}

function endTest() {
    if (!isTestRunning) return;
    isTestRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;

    // Final stats calculate karein
    const currentWpm = parseInt(wpmElement.innerText);
    const currentAcc = accuracyElement.innerText;
    const correctCount = currentIndex - errors;

    // Results screen par values set karein
    finalWpm.innerText = currentWpm;
    finalAccuracy.innerText = currentAcc;

    // 1. Accuracy Color Logic (100% ho to green, warna red)
    if (currentAcc === "100%") {
        finalAccuracy.className = "text-2xl font-bold text-[var(--green-500)]";
    } else {
        finalAccuracy.className = "text-2xl font-bold text-[var(--red-500)]";
    }

    // 2. Characters Color Logic (Correct green mein, Errors red mein)
    finalChars.innerHTML = `<span class="text-[var(--green-500)]">${correctCount}</span><span class="text-[var(--neutral-400)]">/</span><span class="text-[var(--red-500)]">${errors}</span>`;

    // LocalStorage se Personal Best check karein
    let personalBest = localStorage.getItem('typingPersonalBest') || 0;


    if (personalBest == 0) {
        resultTitle.innerText = "Baseline Established!";
        resultSubtitle.innerText = "You've set the bar. Now the real challenge begins—time to beat it.";
        goAgainBtn.innerHTML = "Beat This Score ↺"; // Seedha goAgainBtn use kiya
        localStorage.setItem('typingPersonalBest', currentWpm);
    } else if (currentWpm > personalBest) {
        resultTitle.innerText = "High Score Smashed!";
        resultSubtitle.innerText = "You're getting faster. That was incredible typing.";
        goAgainBtn.innerHTML = "Beat This Score ↺";
        localStorage.setItem('typingPersonalBest', currentWpm);
    } else {
        resultTitle.innerText = "Test Complete!";
        resultSubtitle.innerText = "Solid run. Keep pushing to beat your high score.";
        goAgainBtn.innerHTML = "Go Again ↺";
    }

    // Header ka personal best update karein
    personalBestElement.innerText = `${localStorage.getItem('typingPersonalBest')} WPM`;

    // Results screen show karein
    resultsScreen.classList.remove('hidden');

    // Go Again button click par reset karein
    goAgainBtn.addEventListener('click', () => {
        resultsScreen.classList.add('hidden');
        resetTest();
    });
    function resetTest() {
        timer = 60;
        totalTyped = 0;
        errors = 0;
        currentIndex = 0;
        timerElement.innerText = "0:60";
        wpmElement.innerText = "0";
        accuracyElement.innerText = "100%";

        currentText = getRandomText(currentDifficulty);
        renderText(currentText);
        textDisplay.classList.add("blurred");
        startOverlay.classList.remove("hidden");
        restartBtn.classList.add("hidden");
    }
}



startBtn.addEventListener('click', () => {
    console.log("Button clicked successfully!"); // Console mein check karein ke yeh print ho raha hai ya nahi
    startTest();
});

// Page load hote hi ek random text load karwao aur blur rakho
currentText = getRandomText(currentDifficulty);
renderText(currentText);
textDisplay.classList.add("blurred");