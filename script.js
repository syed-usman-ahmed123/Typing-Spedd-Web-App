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
const resultHeaderPb = document.getElementById('result-header-pb');

const resultIcon = document.getElementById('result-icon');
const patternStarLeft = document.getElementById('pattern-star-left');
const patternStarRight = document.getElementById('pattern-star-right');
const patternConfetti = document.getElementById('pattern-confetti');

// Mobile Dropdown Elements
const mobileDiffBtn = document.getElementById('mobile-difficulty-btn');
const mobileDiffMenu = document.getElementById('mobile-difficulty-menu');
const mobileDiffLabel = document.getElementById('mobile-difficulty-label');
const mobileDiffOptions = document.querySelectorAll('.mobile-diff-option');

const mobileModeBtn = document.getElementById('mobile-mode-btn');
const mobileModeMenu = document.getElementById('mobile-mode-menu');
const mobileModeLabel = document.getElementById('mobile-mode-label');
const mobileModeOptions = document.querySelectorAll('.mobile-mode-option');

const cursor = document.getElementById('cursor');
// const mobileInput = document.getElementById('mobile-input');


let currentText = "";
let currentDifficulty = "medium";
let currentMode = "timed";
let isTestRunning = false;
let currentIndex = 0;

let timer = 60;
let timerInterval = null;
let totalTyped = 0;
let errors = 0;

function updateCursorPosition() {
    const currentChar = textDisplay.querySelector('.char.current');
    if (currentChar && cursor) {
        const charRect = currentChar.getBoundingClientRect();
        const parentRect = cursor.parentElement.getBoundingClientRect();

        const left = charRect.left - parentRect.left;
        const top = charRect.top - parentRect.top;

        cursor.style.height = `${charRect.height}px`;
        cursor.style.transform = `translate(${left}px, ${top}px)`;
    }
}


const currentBest = `${localStorage.getItem('typingPersonalBest') || 0} WPM`;
personalBestElement.innerText = currentBest;

if (resultHeaderPb) {
    resultHeaderPb.innerText = currentBest;
}

const texts = {
    easy: [
        "The quick brown fox jumps over the lazy dog in the sunny meadow. Practice makes perfect when you are learning how to type faster and more accurately every single day of the week. Building good habits early will help you become a much better writer and developer over time without making too many silly mistakes.",
        "Learning how to type without ever looking down at your keyboard is a wonderful skill. It helps you get your thoughts onto the screen much faster and reduces hand fatigue over long hours of work. Consistency is the real key to success when practicing your daily routines.",
        "A journey of a thousand miles always begins with just a single step forward. Keep pushing yourself every day and never give up on your personal goals and dreams. Hard work and dedication will always pay off in the long run if you stay focused.",
        "Reading good books opens up your mind to entirely new worlds and creative ideas. It improves your vocabulary and helps you express yourself clearly in any situation. Make it a daily habit to read at least a few pages before you go to sleep at night.",
        "Morning exercise gives you plenty of energy for the rest of your busy day. A healthy body leads to a much sharper mind and better overall productivity in everything you do. Eating well and getting enough rest are equally important parts of a balanced lifestyle.",
        "Technology surrounds us in almost every single thing we do today. Understanding the basics of how it works can open up many exciting career opportunities for young people everywhere. The digital world is growing faster than ever before in history.",
        "Music has the wonderful power to change our mood instantly whenever we feel down. Whether you prefer upbeat pop tunes or calm classical melodies, it is always a great companion during long coding sessions. Finding the right soundtrack helps you stay focused.",
        "Writing clean and readable code requires a lot of patience and strict attention to detail. Every great software engineer started exactly where you are right now by learning the simple fundamentals. Do not rush the process and enjoy every single step of your learning.",
        "Friendly communication is the backbone of any successful team project in the workplace. Listening carefully to what others have to say prevents misunderstandings and builds strong trust among colleagues. Always treat your team members with respect and kindness.",
        "Setting clear daily targets helps you stay organized and motivated throughout the week. When you break big tasks down into smaller pieces, everything becomes much easier to handle. Celebrate your small victories along the way to keep your spirits high."
    ],
    medium: [
        "The archaeological expedition recently unearthed several fascinating artifacts that dramatically complicated prevailing theories about Bronze Age trade networks across distant regions. Researchers spent months carefully cataloging every single item found within the ancient ruins to understand how early human societies interacted with one another.",
        "Obsidian originating from Anatolia, brilliant lapis lazuli imported from Afghanistan, and precious amber gathered from the Baltic shores were all discovered together inside a single ancient tomb complex. This surprising combination proved that long-distance commerce was far more active than previously imagined.",
        "Many modern scientists firmly believe that early prehistoric civilizations possessed much more advanced commercial and logistical systems than historians previously thought. New physical evidence continues to emerge from various excavation sites, strongly supporting this revolutionary idea across academic circles.",
        "Digital transformation is rapidly reshaping industries worldwide, demanding continuous learning and adaptation from professionals across all technical fields. Keeping your skillset up to date with modern frameworks and best practices is essential for long-term career growth in the software industry.",
        "Building fully responsive web applications requires a strong foundational understanding of modern CSS layout frameworks, asynchronous JavaScript features, and clean component architectures. Developers must ensure that their user interfaces look pristine on every single device screen size.",
        "Effective communication within a multidisciplinary development team ensures that critical project milestones are met efficiently without unnecessary friction or costly delays. Clear documentation and regular code reviews help maintain high standards of code quality across the board.",
        "Exploring new cities and experiencing foreign cultures helps broaden your perspective on history, art, and the diverse ways people live their lives around the globe. Traveling teaches you adaptability and opens your mind to unique problem-solving approaches.",
        "Optimizing website performance metrics is crucial for retaining active users and improving search engine rankings in today's highly competitive digital marketplace. Reducing load times and minimizing unnecessary asset requests can dramatically boost user engagement.",
        "Sustainable energy solutions are becoming increasingly critical as modern societies strive to reduce their carbon footprint and protect fragile natural ecosystems. Engineers and scientists are working tirelessly to develop cleaner alternatives to fossil fuels.",
        "The rapid evolution of artificial intelligence tools has fundamentally transformed how developers build intelligent software systems, turning complex machine learning concepts into accessible daily utilities for modern web developers everywhere."
    ],
    hard: [
        "The archaeological expedition successfully unearthed diverse artifacts that significantly complicated prevailing paradigms regarding Bronze Age transnational trade networks. Obsidian originating from Anatolian deposits, lapis lazuli procured from remote Afghan mines, and amber harvested along Baltic coasts—all meticulously cataloged within a singular Mycenaean sepulcher—collectively implied commercial interconnections vastly more extensive than previously hypothesized by mainstream historians.",
        "We have historically underestimated ancient populations' sophisticated navigational capabilities and their insatiable appetite for exotic luxury commodities, the lead anthropological researcher remarked during the press conference. Globalization is by no means an exclusively contemporary phenomenon; intricate, multi-layered supply chains flourished millennia before the inception of the modern industrial era.",
        "Recent stratigraphic discoveries across the Mediterranean basin have compelled classical historians to radically reconsider long-standing assumptions concerning prehistoric macroeconomic commerce. The concurrent presence of raw materials originating from three distinct continental landmasses within a single burial precinct unequivocally demonstrates sophisticated cartographic knowledge and maritime logistics.",
        "Asynchronous execution paradigms within modern JavaScript runtime environments empower software engineers to orchestrate non-blocking network I/O operations and intensive computational threads concurrently. This architectural capability guarantees buttery-smooth graphical user interfaces and responsive user experiences even when applications are subjected to extreme computational stress.",
        "Implementing robust cryptographic authentication protocols utilizing JSON Web Tokens alongside salted hashing algorithms is paramount for safeguarding sensitive user databases against sophisticated cyber security vectors. Security-conscious developers must continuously audit their backend architectures to mitigate vulnerabilities before deployment into production environments.",
        "The intricate psychological synergy binding user experience design with meticulous frontend engineering dictates how successfully a digital product captures and retains audience attention. Balancing avant-garde visual aesthetics with lightning-fast DOM rendering performance across fragmented hardware architectures remains one of the greatest challenges for web creators.",
        "Navigating the labyrinthine complexities of centralized versus decentralized state management architectures within enterprise-grade single-page applications necessitates rigorous architectural foresight. Leveraging predictable data-flow patterns ensures that application states remain synchronized and debugging overhead is minimized across massive codebase repositories.",
        "Quantum computing represents an epochal paradigm shift in computational throughput, leveraging fundamental principles of quantum superposition and particle entanglement to execute algorithmic simulations that would require classical supercomputers millennia to process. This nascent technological frontier promises to revolutionize cryptography and pharmaceutical research.",
        "The exponential proliferation of generative artificial intelligence frameworks has irrevocably revolutionized software engineering workflows, seamlessly integrating natural language processing and computer vision into standard development toolchains. Programmers now leverage AI-assisted architecture generation to accelerate feature delivery while maintaining rigorous code quality standards.",
        "Maintaining disciplined version control protocols via intricate Git branching strategies guarantees frictionless collaboration among geographically distributed engineering teams. Standardizing pull request reviews, automated CI/CD pipeline checks, and semantic commit messaging drastically minimizes catastrophic merge conflicts and ensures seamless continuous deployment cycles."
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
    updateCursorPosition();
}

function startTest() {
    currentText = getRandomText(currentDifficulty);
    renderText(currentText);


    startOverlay.classList.add("hidden");
    restartBtn.classList.remove("hidden");


    textDisplay.classList.remove("blurred");

    isTestRunning = true;
    currentIndex = 0;
    updateCursorPosition();

    let hiddenInput = document.getElementById('hidden-typing-input');
    if (!hiddenInput) {
        hiddenInput = document.createElement('textarea');
        hiddenInput.id = 'hidden-typing-input';
        // Isko screen se bilkul bahar aur invisible kar diya hai taake design kharab na ho
        hiddenInput.style.position = 'absolute';
        hiddenInput.style.left = '-9999px';
        hiddenInput.style.opacity = '0';
        document.body.appendChild(hiddenInput);
    }
    hiddenInput.focus();
}

let typingTimeout;

// Keyboard input sunne ke liye
document.addEventListener('keydown', (e) => {
    if (!isTestRunning) return;


    if (e.key.length === 1 || e.key === 'Backspace') {
        document.body.classList.remove('idle');
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            document.body.classList.add('idle');

        }, 500);
    }
    // Space se page scroll na ho
    if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
    }

    // Agar timer pehli baar chal raha hai, to countdown shuru karo
    if (!timerInterval) {
        startTimer();
    }


    if (e.key === 'Backspace') {
        if (currentIndex > 0) {
            const spanElements = textDisplay.querySelectorAll('.char');


            spanElements[currentIndex].classList.remove('current');
            currentIndex--;


            if (spanElements[currentIndex].classList.contains('incorrect')) {
                errors--;
            }


            spanElements[currentIndex].classList.remove('correct', 'incorrect');
            spanElements[currentIndex].classList.add('current');

            updateStats();
            updateCursorPosition();
        }
        return;
    }



    if (e.key.length === 1) {
        const spanElements = textDisplay.querySelectorAll('.char');
        const targetChar = currentText[currentIndex];

        totalTyped++;

        if (e.key === targetChar) {
            spanElements[currentIndex].classList.add('correct');
        } else {
            spanElements[currentIndex].classList.add('incorrect');
            errors++;
        }

        spanElements[currentIndex].classList.remove('current');
        currentIndex++;

        if (currentIndex < spanElements.length) {
            spanElements[currentIndex].classList.add('current');
            updateStats();
            updateCursorPosition();
        } else {
            endTest();
        }
    }
});


function startTimer() {
    timerInterval = setInterval(() => {
        if (currentMode === "timed") {
            if (timer > 0) {
                timer--;
                timerElement.innerText = `0:${timer < 10 ? '0' : ''}${timer}`;
            } else {
                endTest();
            }
        } else {
            // Passage Mode:
            timer++;
            const mins = Math.floor(timer / 60);
            const secs = timer % 60;
            timerElement.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
    }, 1000);
}

function updateStats() {
    // Timed mein (60 - timer), Passage  direct 'timer' 
    const secondsElapsed = currentMode === "timed" ? (60 - timer) : timer;
    const timeElapsed = secondsElapsed / 60;

    const correctTyped = currentIndex - errors;
    const wpm = timeElapsed > 0 ? Math.round((correctTyped / 5) / timeElapsed) : 0;
    wpmElement.innerText = wpm;

    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
    accuracyElement.innerText = `${accuracy}%`;
}

function endTest() {
    if (!isTestRunning) return;
    isTestRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    updateStats();

    // Final stats calculate 
    const currentWpm = parseInt(wpmElement.innerText) || 0;
    const currentAcc = accuracyElement.innerText;
    const correctCount = currentIndex - errors;

    // Results screen values set 
    finalWpm.innerText = currentWpm;
    finalAccuracy.innerText = currentAcc;

    // 1. Accuracy Color Logic 
    if (currentAcc === "100%") {
        finalAccuracy.className = "text-2xl font-bold text-[var(--green-500)]";
    } else {
        finalAccuracy.className = "text-2xl font-bold text-[var(--red-500)]";
    }

    // 2. Characters Color Logic 
    finalChars.innerHTML = `<span class="text-[var(--green-500)]">${correctCount}</span><span class="text-[var(--neutral-400)]">/</span><span class="text-[var(--red-500)]">${errors}</span>`;


    // LocalStorage personal best check
    let personalBest = Number(localStorage.getItem('typingPersonalBest')) || 0;

    if (personalBest === 0) {
        // 1) BASELINE (first test): 
        if (resultTitle) resultTitle.innerText = "Baseline Established!";
        if (resultSubtitle) resultSubtitle.innerText = "You've set the bar. Now the real challenge begins—time to beat it.";
        if (goAgainBtn) goAgainBtn.innerHTML = "Beat This Score ↺";

        if (resultIcon) resultIcon.innerHTML = `<img src="./assets/images/icon-completed.svg" alt="Completed" class="w-16 h-16">`;
        if (patternStarLeft) patternStarLeft.style.display = '';
        if (patternStarRight) patternStarRight.style.display = '';
        if (patternConfetti) patternConfetti.classList.add('hidden');

        localStorage.setItem('typingPersonalBest', currentWpm);

    } else if (currentWpm > personalBest) {
        // 2) HIGH SCORE: 
        resultTitle.innerText = "High Score Smashed!";
        resultSubtitle.innerText = "You're getting faster. That was incredible typing.";
        goAgainBtn.innerHTML = "Beat This Score ↺";

        if (resultIcon) resultIcon.innerHTML = `<img src="./assets/images/icon-new-pb.svg" alt="New Personal Best" class="w-16 h-16">`;
        if (patternStarLeft) patternStarLeft.style.display = 'none';
        if (patternStarRight) patternStarRight.style.display = 'none';
        if (patternConfetti) patternConfetti.classList.remove('hidden');

        localStorage.setItem('typingPersonalBest', currentWpm);

    } else {
        // 3) TEST COMPLETE:
        resultTitle.innerText = "Test Complete!";
        resultSubtitle.innerText = "Solid run. Keep pushing to beat your high score.";
        goAgainBtn.innerHTML = "Go Again ↺";

        if (resultIcon) resultIcon.innerHTML = `
            <div class="absolute w-20 h-20 bg-green-500/10 rounded-full"></div>
            <div class="absolute w-16 h-16 bg-green-500/20 rounded-full"></div>
            <div class="relative w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <img src="./assets/images/icon-completed.svg" alt="Completed" class="w-12 h-12">
            </div>`;
        if (patternStarLeft) patternStarLeft.style.display = '';
        if (patternStarRight) patternStarRight.style.display = '';
        if (patternConfetti) patternConfetti.classList.add('hidden');
    }

    // Modal show
    resultsScreen.classList.remove('hidden');

    // Header ka personal best update 
    const updatedBest = `${localStorage.getItem('typingPersonalBest')} WPM`;
    personalBestElement.innerText = updatedBest;
    if (resultHeaderPb) {
        resultHeaderPb.innerText = updatedBest;
    }
    resultsScreen.classList.remove('hidden');

}

// Go Again button click  reset 
goAgainBtn.addEventListener('click', () => {
    resultsScreen.classList.add('hidden');
    resetTest();
});

function resetTest() {
    clearInterval(timerInterval);
    clearTimeout(typingTimeout);
    timerInterval = null;
    isTestRunning = false;

    document.body.classList.add('idle');

    if (currentMode === "timed") {
        timer = 60;
        timerElement.innerText = "1:00";
    } else {
        timer = 0;
        timerElement.innerText = "0:00";
    }
    totalTyped = 0;
    errors = 0;
    currentIndex = 0;
    timerElement.innerText = "1:00";
    wpmElement.innerText = "0";
    accuracyElement.innerText = "100%";

    currentText = getRandomText(currentDifficulty);
    renderText(currentText);
    textDisplay.classList.add("blurred");
    startOverlay.classList.remove("hidden");
    restartBtn.classList.add("hidden");
}

restartBtn.addEventListener('click', resetTest);



startBtn.addEventListener('click', () => {
    // console.log("Button clicked successfully!"); 
    startTest();
});


startOverlay.addEventListener('click', () => {
    if (!isTestRunning) {
        startTest();
    }
});


/// random text load
currentText = getRandomText(currentDifficulty);
renderText(currentText);
textDisplay.classList.add("blurred");


const difficultyBtns = document.querySelectorAll('.difficulty-btn');

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {

        difficultyBtns.forEach(b => {
            b.classList.remove('border-[var(--blue-500)]', 'text-[var(--blue-400)]');
            b.classList.add('border-[var(--neutral-500)]', 'text-[var(--neutral-400)]');
        });


        btn.classList.remove('border-[var(--neutral-500)]', 'text-[var(--neutral-400)]');
        btn.classList.add('border-[var(--blue-500)]', 'text-[var(--blue-400)]');


        currentDifficulty = btn.getAttribute('data-difficulty');
        resetTest();
    });
});

const modeBtns = document.querySelectorAll('.mode-btn');

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {

        modeBtns.forEach(b => {
            b.classList.remove('border-[var(--blue-500)]', 'text-[var(--blue-400)]');
            b.classList.add('border-[var(--neutral-500)]', 'text-[var(--neutral-400)]');
        });


        btn.classList.remove('border-[var(--neutral-500)]', 'text-[var(--neutral-400)]');
        btn.classList.add('border-[var(--blue-500)]', 'text-[var(--blue-400)]');


        currentMode = btn.getAttribute('data-mode');
        resetTest();
    });
});

// Toggle Difficulty Menu
mobileDiffBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileDiffMenu.classList.toggle('hidden');
    mobileModeMenu.classList.add('hidden');
});

// Toggle Mode Menu
mobileModeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileModeMenu.classList.toggle('hidden');
    mobileDiffMenu.classList.add('hidden');
});

/// dropdown close when click out
document.addEventListener('click', () => {
    mobileDiffMenu.classList.add('hidden');
    mobileModeMenu.classList.add('hidden');
});

// Difficulty Option Select
mobileDiffOptions.forEach(option => {
    option.addEventListener('click', () => {
        const selectedDiff = option.dataset.difficulty;
        mobileDiffLabel.innerText = option.innerText.trim();

        // Radio circle UI update
        mobileDiffOptions.forEach(opt => {
            const circle = opt.querySelector('.radio-circle');
            if (opt.dataset.difficulty === selectedDiff) {
                circle.className = 'radio-circle w-4 h-4 rounded-full border-4 border-[var(--blue-400)] bg-[var(--neutral-800)] flex items-center justify-center';
            } else {
                circle.className = 'radio-circle w-4 h-4 rounded-full border-2 border-[var(--neutral-400)] flex items-center justify-center';
            }
        });

        const desktopBtn = document.querySelector(`.difficulty-btn[data-difficulty="${selectedDiff}"]`);
        if (desktopBtn) desktopBtn.click();

        mobileDiffMenu.classList.add('hidden');
    });
});

// Mode Option Select 
mobileModeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const selectedMode = option.dataset.mode;
        mobileModeLabel.innerText = option.innerText.trim();

        // Radio circle UI update
        mobileModeOptions.forEach(opt => {
            const circle = opt.querySelector('.radio-circle');
            if (opt.dataset.mode === selectedMode) {
                circle.className = 'radio-circle w-4 h-4 rounded-full border-4 border-[var(--blue-400)] bg-[var(--neutral-800)] flex items-center justify-center';
            } else {
                circle.className = 'radio-circle w-4 h-4 rounded-full border-2 border-[var(--neutral-400)] flex items-center justify-center';
            }
        });

        const desktopBtn = document.querySelector(`.mode-btn[data-mode="${selectedMode}"]`);
        if (desktopBtn) desktopBtn.click();

        mobileModeMenu.classList.add('hidden');
    });
});

// cursor blink when page load
document.body.classList.add('idle');
updateCursorPosition();