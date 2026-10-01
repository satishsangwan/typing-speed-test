/* =========================================
   GAME OF EXAMS HARYANA
   FREE TYPING SPEED TEST
   VERSION 1.3
========================================= */





/* =========================================
   VARIABLES
========================================= */

let currentPassage = "";

let currentPaperPassage = null;

let currentMode = "screen";

let testDuration = 1;

let timeRemaining = 0;

let timerInterval = null;

let testStarted = false;

let startTime = null;

let testFinished = false;

let selectedPaperPassage = null;
let selectedPaperDuration = 10;

let selectedScreenPassage = null;
/* =========================================
   SCREEN MANAGEMENT
========================================= */

function showScreen(id) {

    document.querySelectorAll(".screen").forEach(screen => {

        screen.classList.remove("active");

    });

    document.getElementById(id).classList.add("active");

}


/* =========================================
   HOME
========================================= */

function goHome() {

    clearInterval(timerInterval);

    timerInterval = null;

    testStarted = false;

    testFinished = false;

    startTime = null;

    const input =
        document.getElementById("typingInput");

    if (input) {

        input.disabled = false;

        input.value = "";

    }

    showScreen("homeScreen");

}


/* =========================================
   SCREEN TEST SETUP
========================================= */

function openScreenTest() {

    clearInterval(timerInterval);

    timerInterval = null;

    testStarted = false;

    testFinished = false;

    startTime = null;

    currentMode = "screen";

    renderScreenPassages();
showScreen("screenPassageScreen");

}
function renderScreenPassages() {

    const container =
        document.getElementById("screenPassageList");

    const categoryFilter =
        document.getElementById("screenCategoryFilter");

    categoryFilter.innerHTML = `
        <option value="all">
            All Categories
        </option>
    `;

    const categories = [
        ...new Set(
            screenPassages.map(
                passage => passage.category
            )
        )
    ];

    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });

    document.getElementById(
        "screenPassageSearch"
    ).value = "";

    document.getElementById(
        "screenDifficultyFilter"
    ).value = "all";

    filterScreenPassages();
}

function filterScreenPassages() {

    const searchText =
        document.getElementById(
            "screenPassageSearch"
        ).value
        .toLowerCase()
        .trim();

    const category =
        document.getElementById(
            "screenCategoryFilter"
        ).value;

    const difficulty =
        document.getElementById(
            "screenDifficultyFilter"
        ).value;

    const filteredPassages =
        screenPassages.filter(passage => {

            const searchMatch =
                searchText === "" ||
                passage.title
                    .toLowerCase()
                    .includes(searchText) ||
                passage.category
                    .toLowerCase()
                    .includes(searchText);

            const categoryMatch =
                category === "all" ||
                passage.category === category;

            const difficultyMatch =
                difficulty === "all" ||
                passage.difficulty === difficulty;

            return (
                searchMatch &&
                categoryMatch &&
                difficultyMatch
            );
        });

    const container =
        document.getElementById(
            "screenPassageList"
        );

    container.innerHTML = "";

    document.getElementById(
        "screenPassageResultCount"
    ).textContent =
        `${filteredPassages.length} passage${
            filteredPassages.length === 1
                ? ""
                : "s"
        } available`;

    const noResults =
        document.getElementById(
            "screenPassageNoResults"
        );

    if (filteredPassages.length === 0) {

        noResults.style.display = "block";

        return;

    } else {

        noResults.style.display = "none";
    }

filteredPassages.forEach(passage => {

    const card =
        document.createElement("div");

    card.className = "passage-card";

    card.innerHTML = `
        <div class="passage-number">
            ${String(passage.id).padStart(2, "0")}
        </div>

        <div class="passage-card-content">

            <h3>${passage.title}</h3>

            <p class="passage-category">
                ${passage.category}
            </p>

            <div class="passage-meta">

                <span class="word-info">
                    📖 ${passage.wordCount} Words
                </span>

                <span class="difficulty-badge">
                    🟡 ${passage.difficulty}
                </span>

            </div>

        </div>

        <button
            class="passage-start-button"
            onclick="selectScreenPassage(${passage.id})">

            Start This Passage →
        </button>
    `;

    container.appendChild(card);
});
}

function selectScreenPassage(passageId) {

    selectedScreenPassage =
        screenPassages.find(
            passage => passage.id === passageId
        );

    if (!selectedScreenPassage) {
        alert("Passage not found.");
        return;
    }

    currentPassage =
        selectedScreenPassage.text;

    document.getElementById(
        "selectedScreenPassageTitle"
    ).textContent =
        selectedScreenPassage.title;

    document.getElementById(
        "selectedScreenPassageDetails"
    ).textContent =
        `${selectedScreenPassage.category} | ${selectedScreenPassage.wordCount} Words | ${selectedScreenPassage.difficulty}`;

    showScreen("setupScreen");
}

function selectRandomScreenPassage() {

    if (!screenPassages || screenPassages.length === 0) {
        alert("No screen passages available.");
        return;
    }

    const randomIndex =
        Math.floor(
            Math.random() * screenPassages.length
        );

    selectedScreenPassage =
        screenPassages[randomIndex];

    currentPassage =
        selectedScreenPassage.text;

    document.getElementById(
        "selectedScreenPassageTitle"
    ).textContent =
        selectedScreenPassage.title;

    document.getElementById(
        "selectedScreenPassageDetails"
    ).textContent =
        `${selectedScreenPassage.category} | ${selectedScreenPassage.wordCount} Words | ${selectedScreenPassage.difficulty}`;

    showScreen("setupScreen");
}
/* =========================================
   PAPER TEST
========================================= */

function openPaperTest() {

    currentMode = "paper";

    renderPaperPassages();

    showScreen("paperScreen");

}


/* =========================================
   RENDER PAPER PASSAGE LIST
========================================= */

function renderPaperPassages() {

    populateCategoryFilter();

    filterPaperPassages();

}


/* =========================================
   FIND PAPER PASSAGE
========================================= */

function getPaperPassage(id) {

    return paperPassages.find(
        passage => passage.id === id
    );

}

/* =========================================
   POPULATE CATEGORY FILTER
========================================= */

function populateCategoryFilter() {

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    if (!categoryFilter) {

        return;

    }


    const categories =
        [
            ...new Set(
                paperPassages.map(
                    passage =>
                        passage.category
                )
            )
        ]
        .sort();


    categoryFilter.innerHTML = `

        <option value="all">
            All Categories
        </option>

    `;


    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );


        option.value = category;

        option.textContent = category;


        categoryFilter.appendChild(
            option
        );

    });

}


/* =========================================
   FILTER PAPER PASSAGES
========================================= */

function filterPaperPassages() {

    const container =
        document.getElementById(
            "paperPassageList"
        );


    const searchInput =
        document.getElementById(
            "passageSearch"
        );


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    const difficultyFilter =
        document.getElementById(
            "difficultyFilter"
        );


    if (!container) {

        return;

    }


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const category =
        categoryFilter
            ? categoryFilter.value
            : "all";


    const difficulty =
        difficultyFilter
            ? difficultyFilter.value
            : "all";


    const filtered =
        paperPassages.filter(
            passage => {

                const matchesSearch =
                    passage.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    passage.category
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    category === "all" ||
                    passage.category === category;


                const matchesDifficulty =
                    difficulty === "all" ||
                    passage.difficulty === difficulty;


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesDifficulty
                );

            }
        );


    container.innerHTML = "";


    /* No results */

    if (filtered.length === 0) {

        container.innerHTML = `

            <div class="no-passages">

                <h3>
                    No passages found
                </h3>

                <p>
                    Try changing your search
                    or filters.
                </p>

            </div>

        `;

    }


    /* Display cards */

    filtered.forEach(passage => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "paper-passage-card";


        const wordCount =
            getWords(
                passage.text
            ).length;


        card.innerHTML = `

            <h3>
                ${passage.title}
            </h3>

            <p>
                <strong>
                    Category:
                </strong>
                ${passage.category}
            </p>

            <p>
                <strong>
                    Difficulty:
                </strong>
                ${passage.difficulty}
            </p>

            <p>
                <strong>
                    Words:
                </strong>
                ${wordCount}
            </p>

            <button
                onclick="printPaperPassage(
                    ${passage.id}
                )">

                🖨️ Print Passage

            </button>

            <button
                onclick="startPaperTest(
                    ${passage.id}
                )">

                ⌨️ Start Test

            </button>

        `;


        container.appendChild(card);

    });


    /* Result count */

    const resultCount =
        document.getElementById(
            "passageResultCount"
        );


    if (resultCount) {

        resultCount.textContent =
            `Showing ${filtered.length} of ${paperPassages.length} passages`;

    }

}


/* =========================================
   PRINT PAPER PASSAGE
========================================= */

function printPaperPassage(id) {

    const passage =
        getPaperPassage(id);


    if (!passage) {

        return;

    }


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=900,height=700"
        );


    if (!printWindow) {

        alert(
            "Please allow pop-ups for this website to print the passage."
        );

        return;

    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                ${passage.title} - Game of Exams Haryana
            </title>

            <style>

                body {

                    font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

                    margin: 40px;

                    color: #111;

                }


                .header {

                    text-align: center;

                    margin-bottom: 30px;

                }


                .header h1 {

                    font-size: 22px;

                    margin-bottom: 8px;

                }


                .header h2 {

                    font-size: 18px;

                    margin-bottom: 20px;

                }


                .details {

                    display: flex;

                    justify-content:
                    space-between;

                    margin-bottom: 30px;

                    font-size: 14px;

                }


                .passage {

                    font-size: 18px;

                    line-height: 1.9;

                    text-align: justify;

                    border: 1px solid #ccc;

                    padding: 25px;

                }


                .instructions {

                    margin-top: 25px;

                    font-size: 13px;

                    color: #555;

                }


                @media print {

                    body {

                        margin: 20mm;

                    }

                }

            </style>

        </head>


        <body>

            <div class="header">

                <h1>
                    GAME OF EXAMS HARYANA
                </h1>

                <h2>
                    ${passage.title}
                </h2>

            </div>


            <div class="details">

                <span>
                    Name: ____________________
                </span>

                <span>
                    Date: ____________________
                </span>

            </div>


            <div class="passage">

                ${passage.text}

            </div>


            <div class="instructions">

                <strong>
                    Typing Practice:
                </strong>

                Type the above passage exactly as printed.

            </div>


            <script>

                window.onload = function() {

                    window.print();

                };

            <\/script>


        </body>

        </html>

    `);


    printWindow.document.close();

}

function printSelectedPaperPassage() {

    if (!selectedPaperPassage) {
        alert("No passage selected.");
        return;
    }

    printPaperPassage(selectedPaperPassage.id);
}

/* =========================================
   START SCREEN TEST
========================================= */

function startTest(minutes) {

    currentMode = "screen";


    if (!selectedScreenPassage) {
    alert("Please select a passage first.");
    return;
}

const randomPassage = selectedScreenPassage;


    prepareTest(
        minutes,
        randomPassage.text
    );

}

/* =========================================
   START PAPER TEST
========================================= */

function startPaperTest(id) {
    const passage = getPaperPassage(id);

    if (!passage) {
        alert("Passage not found.");
        return;
    }

    currentMode = "paper";

    // Store selected paper passage
    selectedPaperPassage = passage;

    // Default duration
    selectedPaperDuration = 10;

    // Show passage information
    document.getElementById("setupPassageTitle").textContent = passage.title;
    document.getElementById("setupPassageCategory").textContent = passage.category;
    document.getElementById("setupPassageDifficulty").textContent = passage.difficulty;

    const wordCount = passage.text.trim().split(/\s+/).length;
    document.getElementById("setupPassageWords").textContent = wordCount;

    // Reset duration buttons
    updatePaperDurationButtons();

    // Show setup screen
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById("paperSetupScreen").classList.add("active");
}
function selectPaperDuration(minutes) {
    selectedPaperDuration = minutes;
    updatePaperDurationButtons();
}


function updatePaperDurationButtons() {
    const durations = [5, 10, 15, 20];

    durations.forEach(minutes => {
        const button = document.getElementById(`paperDuration${minutes}`);

        if (button) {
            button.classList.remove("selected");

            if (minutes === selectedPaperDuration) {
                button.classList.add("selected");
            }
        }
    });
}

function retrySamePassage() {

    if (currentMode === "paper" && selectedPaperPassage) {

        prepareTest(
            testDuration,
            selectedPaperPassage.text
        );

    } else {

        prepareTest(
            testDuration,
            currentPassage
        );
    }
}

function chooseAnotherPassage() {

    if (currentMode === "paper") {

        // Paper → Screen
        renderPaperPassages();

        document.querySelectorAll(".screen").forEach(screen => {
            screen.classList.remove("active");
        });

        document.getElementById("paperScreen").classList.add("active");

    } else {

        // Screen → Screen
        openScreenTest();
    }
}

function beginPaperTest() {
    if (!selectedPaperPassage) {
        alert("Please select a passage first.");
        return;
    }

    prepareTest(
        selectedPaperDuration,
        selectedPaperPassage.text
    );
}
/* =========================================
   PREPARE TEST
========================================= */

function prepareTest(
    minutes,
    passageText
) {

    clearInterval(timerInterval);

    testDuration = minutes;

    timeRemaining =
        minutes * 60;
   
document.getElementById("testModeLabel").textContent =
    currentMode === "paper"
        ? `📄 PAPER → SCREEN | ⏱️ ${minutes} MINUTES`
        : `⌨️ SCREEN → SCREEN | ⏱️ ${minutes} MINUTES`;
   
    testStarted = false;

    testFinished = false;

    startTime = null;

    currentPassage =
        passageText;


    const input =
        document.getElementById("typingInput");


    input.value = "";

    input.disabled = false;




    /* Mode label */

const modeLabel =
    document.getElementById("testModeLabel");

if (currentMode === "paper") {

    modeLabel.textContent =
        `📄 PAPER → SCREEN | ⏱️ ${testDuration} MINUTES`;

} else {

    modeLabel.textContent =
        `⌨️ SCREEN → SCREEN | ⏱️ ${testDuration} MINUTES`;
}


    /* Passage display */

    const passageElement =
        document.getElementById("passage");


    if (currentMode === "paper") {

        passageElement.classList.add(
            "paper-mode-hidden"
        );


        passageElement.innerHTML = "";


    } else {

        passageElement.classList.remove(
            "paper-mode-hidden"
        );

    }


    /* Timer */

    document.getElementById("timer").textContent =
        formatTime(timeRemaining);


    /* Statistics */

    document.getElementById("liveGrossWpm").textContent =
        "0";

    document.getElementById("liveWpm").textContent =
        "0";

    document.getElementById("liveMistakes").textContent =
        "0";

    document.getElementById("liveAccuracy").textContent =
        "100%";


    /* Progress */

    updateProgress(0);


    /* Render screen passage */

    if (currentMode === "screen") {

        renderPassage("");

    }


    showScreen("testScreen");

    input.focus();

}


/* =========================================
   RENDER SCREEN PASSAGE
========================================= */

function renderPassage(typedText) {

    if (currentMode === "paper") {

        return;

    }


    const passageElement =
        document.getElementById("passage");


    passageElement.innerHTML = "";


    for (
        let i = 0;
        i < currentPassage.length;
        i++
    ) {

        const span =
            document.createElement("span");


        span.classList.add(
            "typing-char"
        );


        span.textContent =
            currentPassage[i];


        if (
            i < typedText.length &&
            typedText[i] ===
            currentPassage[i]
        ) {

            span.classList.add(
                "correct"
            );

        }

        else if (
            i < typedText.length &&
            typedText[i] !==
            currentPassage[i]
        ) {

            span.classList.add(
                "incorrect"
            );

        }


        if (
            i === typedText.length &&
            typedText.length <
            currentPassage.length
        ) {

            span.classList.add(
                "current"
            );

        }


        passageElement.appendChild(span);

    }


    

}


/* =========================================
   TIMER
========================================= */

function startTimer() {

    if (
        testStarted ||
        testFinished
    ) {

        return;

    }


    testStarted = true;

    startTime =
        performance.now();


    timerInterval =
        setInterval(() => {

            const elapsedSeconds =
                Math.floor(
                    (
                        performance.now() -
                        startTime
                    ) / 1000
                );


            timeRemaining =
                Math.max(
                    0,
                    (
                        testDuration * 60
                    ) -
                    elapsedSeconds
                );


            document.getElementById(
                "timer"
            ).textContent =
                formatTime(
                    timeRemaining
                );


            updateLiveStats();


            if (
                timeRemaining <= 0
            ) {
 
                finishTest();

            }

        }, 200);

}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(seconds) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        seconds % 60;


    return (
        String(minutes)
            .padStart(2, "0") +
        ":" +
        String(secs)
            .padStart(2, "0")
    );

}


/* =========================================
   WORDS
========================================= */

function getWords(text) {

    return text
        .trim()
        .split(/\s+/)
        .filter(
            word =>
                word.length > 0
        );

}


/* =========================================
   MISTAKES
========================================= */

function calculateMistakes(typedText) {

    const typedWords = getWords(typedText);
    const originalWords = getWords(currentPassage);

    let mistakes = 0;

    let typedIndex = 0;
    let originalIndex = 0;

    while (
        typedIndex < typedWords.length &&
        originalIndex < originalWords.length
    ) {

        // Correct word
        if (
            typedWords[typedIndex] ===
            originalWords[originalIndex]
        ) {

            typedIndex++;
            originalIndex++;

        }

        // Check if the student skipped an original word
        else if (
            originalIndex + 1 < originalWords.length &&
            typedWords[typedIndex] ===
            originalWords[originalIndex + 1]
        ) {

            // The original word was skipped.
            // Count the skipped word as a mistake,
            // but do not consume the typed word.
            mistakes++;
            originalIndex++;

        }

        // Check if the student added an extra word
        else if (
            typedIndex + 1 < typedWords.length &&
            typedWords[typedIndex + 1] ===
            originalWords[originalIndex]
        ) {

            // Extra typed word
            mistakes++;
            typedIndex++;

        }

        // Different word
        else {

            mistakes++;
            typedIndex++;
            originalIndex++;
        }
    }

    // Any words typed beyond the passage are mistakes
    if (typedIndex < typedWords.length) {

        mistakes +=
            typedWords.length - typedIndex;
    }

    // IMPORTANT:
    // Do NOT count remaining untyped original words as mistakes.

    return mistakes;
}
/* =========================================
   ELAPSED TIME
========================================= */

function getElapsedSeconds() {

    if (
        !testStarted ||
        !startTime
    ) {

        return 0;

    }


    const elapsed =
        Math.floor(
            (
                performance.now() -
                startTime
            ) / 1000
        );


    return Math.min(
        elapsed,
        testDuration * 60
    );

}


/* =========================================
   PROGRESS
========================================= */

function updateProgress(typedText) {

   typedText =
        typeof typedText === "string"
            ? typedText
            : "";
   
    const totalCharacters =
        currentPassage.length;

    const typedCharacters =
        typedText.length;

    const totalWords =
        getWords(currentPassage).length;

    const typedWords =
        getWords(typedText).length;

    let percentage = 0;

    if (totalWords > 0) {

        percentage =
            (typedWords / totalWords) * 100;
    }

    percentage =
        Math.min(
            100,
            Math.max(
                0,
                percentage
            )
        );

    const progressFill =
        document.getElementById(
            "progressFill"
        );

    const progressText =
        document.getElementById(
            "progressText"
        );

    const characterCount =
        document.getElementById(
            "characterCount"
        );

    if (progressFill) {

        progressFill.style.width =
            percentage + "%";
    }

    if (progressText) {

        progressText.textContent =
            typedWords +
            " / " +
            totalWords +
            " words";
    }

    if (characterCount) {

        characterCount.textContent =
            typedCharacters +
            " / " +
            totalCharacters +
            " characters";
    }
}

/* =========================================
   LIVE STATISTICS
========================================= */

function updateLiveStats() {

    const input =
        document.getElementById(
            "typingInput"
        );


    const typedText =
        input.value;


    /* Screen highlighting */

    renderPassage(
        typedText
    );


    const typedWords =
        getWords(
            typedText
        );


    const wordsTyped =
        typedWords.length;


    const mistakes =
        calculateMistakes(
            typedText
        );


    const elapsedSeconds =
        getElapsedSeconds();


    const elapsedMinutes =
        elapsedSeconds / 60;


    let grossWpm = 0;

    let netWpm = 0;


    if (
        elapsedMinutes > 0
    ) {

        grossWpm =
            wordsTyped /
            elapsedMinutes;


        netWpm =
            (
                wordsTyped -
                mistakes
            ) /
            elapsedMinutes;

    }


    let accuracy = 100;


    if (
        wordsTyped > 0
    ) {

        accuracy =
            (
                (
                    wordsTyped -
                    mistakes
                ) /
                wordsTyped
            ) * 100;

    }


    document.getElementById(
        "liveGrossWpm"
    ).textContent =
        Math.max(
            0,
            Math.round(
                grossWpm
            )
        );


    document.getElementById(
        "liveWpm"
    ).textContent =
        Math.max(
            0,
            Math.round(
                netWpm
            )
        );


    document.getElementById(
        "liveMistakes"
    ).textContent =
        mistakes;


    document.getElementById(
        "liveAccuracy"
    ).textContent =
        Math.max(
            0,
            accuracy
        ).toFixed(1) + "%";


   updateProgress(
    typedText
);
}


/* =========================================
   FINISH TEST
========================================= */

function finishTest() {

   
    if (testFinished) {

        return;

    }


    clearInterval(
        timerInterval
    );


    timerInterval = null;


    const input =
        document.getElementById(
            "typingInput"
        );


    const typedText =
        input.value;


    const typedWords =
        getWords(
            typedText
        );


    const wordsTyped =
        typedWords.length;


    const mistakes =
        calculateMistakes(
            typedText
        );


    let elapsedSeconds =
        getElapsedSeconds();


    if (
        timeRemaining <= 0 &&
        testStarted
    ) {

        elapsedSeconds =
            testDuration * 60;

    }


    if (
        elapsedSeconds <= 0
    ) {

        elapsedSeconds = 1;

    }


    const elapsedMinutes =
        elapsedSeconds / 60;


    /* USER'S FORMULA */

    const netWpm =
        (
            wordsTyped -
            mistakes
        ) /
        elapsedMinutes;

   /* GROSS WPM */

const grossWpm =
    wordsTyped /
    elapsedMinutes;

    let accuracy = 100;


    if (
        wordsTyped > 0
    ) {

        accuracy =
            (
                (
                    wordsTyped -
                    mistakes
                ) /
                wordsTyped
            ) * 100;

    }


    testFinished = true;

    testStarted = false;

    startTime = null;


    input.disabled = true;


    document.getElementById(
        "finalWpm"
    ).textContent =
        Math.max(
            0,
            netWpm
        ).toFixed(1);

   document.getElementById(
    "finalGrossWpm"
).textContent =
    Math.max(
        0,
        grossWpm
    ).toFixed(1);

   
    document.getElementById(
        "finalWords"
    ).textContent =
        wordsTyped;


    document.getElementById(
        "finalMistakes"
    ).textContent =
        mistakes;


    document.getElementById(
        "finalAccuracy"
    ).textContent =
        Math.max(
            0,
            accuracy
        ).toFixed(1) + "%";


    document.getElementById(
        "finalTime"
    ).textContent =
        formatTime(
            elapsedSeconds
        );

// Result test information
const resultPassageTitle = document.getElementById("resultPassageTitle");
const resultTestDetails = document.getElementById("resultTestDetails");

if (currentMode === "paper" && selectedPaperPassage) {

    resultPassageTitle.textContent =
        selectedPaperPassage.title;

    resultTestDetails.textContent =
        `📄 PAPER → SCREEN | ⏱️ ${testDuration} MINUTES`;

} else {

    resultPassageTitle.textContent =
        "Screen Typing Test";

    resultTestDetails.textContent =
        `⌨️ SCREEN → SCREEN | ⏱️ ${testDuration} MINUTES`;
}

   // ================================
// VERSION 2.0 - SAVE TEST HISTORY
// ================================

const testResult = {
    passage:
        currentMode === "paper" && selectedPaperPassage
            ? selectedPaperPassage.title
            : "Screen Typing Test",

    mode: currentMode,

    duration: testDuration,

    grossWpm: Number(
        Math.max(0, grossWpm).toFixed(1)
    ),

    netWpm: Number(
        Math.max(0, netWpm).toFixed(1)
    ),

    accuracy: Number(
        accuracy.toFixed(1)
    ),

    mistakes: mistakes,

    date: new Date().toLocaleString()
};

// Get existing history
let testHistory = JSON.parse(
    localStorage.getItem("typingTestHistory")
) || [];

// Add current test
testHistory.push(testResult);

// Save history
localStorage.setItem(
    "typingTestHistory",
    JSON.stringify(testHistory)
);


    showScreen(
        "resultScreen"
    );

}


/* =========================================
   INPUT EVENT
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const input =
            document.getElementById(
                "typingInput"
            );


        input.addEventListener(
            "input",
            () => {

                if (
                    !testStarted &&
                    !testFinished
                ) {

                    startTimer();

                }


                updateLiveStats();

            }
        );

    }
);
// =====================================
// VERSION 2.1 - OPEN PERFORMANCE
// =====================================

function openPerformance() {
   
   loadPerformance();
   
    showScreen("performanceScreen");
}
// =====================================
// VERSION 2.1 - LOAD PERFORMANCE DATA
// =====================================

function loadPerformance() {

    const history =
        JSON.parse(
            localStorage.getItem("typingTestHistory")
        ) || [];

    // No tests yet
    if (history.length === 0) {
        return;
    }

    // Best Net WPM
    const bestNetWpm = Math.max(
        ...history.map(test => test.netWpm)
    );

    // Best Gross WPM
    const bestGrossWpm = Math.max(
        ...history.map(test => test.grossWpm)
    );

    // Best Accuracy
    const bestAccuracy = Math.max(
        ...history.map(test => test.accuracy)
    );

    // Average Net WPM
    const totalNetWpm = history.reduce(
        (sum, test) => sum + test.netWpm,
        0
    );

    const averageNetWpm =
        totalNetWpm / history.length;

    // Update statistics
    document.getElementById("bestNetWpm").textContent =
        bestNetWpm.toFixed(1);

    document.getElementById("bestGrossWpm").textContent =
        bestGrossWpm.toFixed(1);

    document.getElementById("bestAccuracy").textContent =
        bestAccuracy.toFixed(1) + "%";

    document.getElementById("testsCompleted").textContent =
        history.length;

    document.getElementById("averageNetWpm").textContent =
        averageNetWpm.toFixed(1);

    // Load test history table
    const tableBody =
        document.getElementById("historyTableBody");

    tableBody.innerHTML = "";

    history.slice().reverse().forEach(test => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${test.date}</td>
            <td>${test.passage}</td>
            <td>${test.mode}</td>
            <td>${test.duration} min</td>
            <td>${test.netWpm.toFixed(1)}</td>
            <td>${test.accuracy.toFixed(1)}%</td>
            <td>${test.mistakes}</td>
        `;

        tableBody.appendChild(row);
    });
}
// =====================================
// VERSION 2.1 - FILTER TEST HISTORY
// =====================================

function filterTestHistory() {

    const modeFilter =
        document.getElementById("historyModeFilter").value;

    const durationFilter =
        document.getElementById("historyDurationFilter").value;

    const history =
        JSON.parse(
            localStorage.getItem("typingTestHistory")
        ) || [];

    // Filter tests
    const filteredHistory = history.filter(test => {

        const modeMatches =
            modeFilter === "all" ||
            test.mode === modeFilter;

        const durationMatches =
            durationFilter === "all" ||
            Number(test.duration) === Number(durationFilter);

        return modeMatches && durationMatches;
    });


    // =====================================
    // UPDATE STATISTICS
    // =====================================

    if (filteredHistory.length > 0) {

        const bestNetWpm = Math.max(
            ...filteredHistory.map(test => test.netWpm)
        );

        const bestGrossWpm = Math.max(
            ...filteredHistory.map(test => test.grossWpm)
        );

        const bestAccuracy = Math.max(
            ...filteredHistory.map(test => test.accuracy)
        );

        const totalNetWpm = filteredHistory.reduce(
            (sum, test) => sum + test.netWpm,
            0
        );

        const averageNetWpm =
            totalNetWpm / filteredHistory.length;


        document.getElementById("bestNetWpm").textContent =
            bestNetWpm.toFixed(1);

        document.getElementById("bestGrossWpm").textContent =
            bestGrossWpm.toFixed(1);

        document.getElementById("bestAccuracy").textContent =
            bestAccuracy.toFixed(1) + "%";

        document.getElementById("testsCompleted").textContent =
            filteredHistory.length;

        document.getElementById("averageNetWpm").textContent =
            averageNetWpm.toFixed(1);

    } else {

        // No matching tests
        document.getElementById("bestNetWpm").textContent =
            "0.0";

        document.getElementById("bestGrossWpm").textContent =
            "0.0";

        document.getElementById("bestAccuracy").textContent =
            "0.0%";

        document.getElementById("testsCompleted").textContent =
            "0";

        document.getElementById("averageNetWpm").textContent =
            "0.0";
    }


    // =====================================
    // UPDATE HISTORY TABLE
    // =====================================

    const tableBody =
        document.getElementById("historyTableBody");

    tableBody.innerHTML = "";

    filteredHistory.slice().reverse().forEach(test => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${test.date}</td>
            <td>${test.passage}</td>
            <td>${test.mode}</td>
            <td>${test.duration} min</td>
            <td>${test.netWpm.toFixed(1)}</td>
            <td>${test.accuracy.toFixed(1)}%</td>
            <td>${test.mistakes}</td>
        `;

        tableBody.appendChild(row);
    });
}
// =====================================
// VERSION 2.1 - CLEAR TEST HISTORY
// =====================================

function clearTestHistory() {

    const confirmClear = confirm(
        "Are you sure you want to clear all test history?\n\n" +
        "This will permanently remove all saved typing-test results from this browser."
    );

    if (!confirmClear) {
        return;
    }

    // Delete saved history
    localStorage.removeItem("typingTestHistory");

    // Reset filters
    document.getElementById("historyModeFilter").value = "all";
    document.getElementById("historyDurationFilter").value = "all";

    // Reset dashboard
    document.getElementById("bestNetWpm").textContent = "0.0";
    document.getElementById("bestGrossWpm").textContent = "0.0";
    document.getElementById("bestAccuracy").textContent = "0.0%";
    document.getElementById("testsCompleted").textContent = "0";
    document.getElementById("averageNetWpm").textContent = "0.0";

    // Clear history table
    document.getElementById("historyTableBody").innerHTML = "";

    alert("Test history has been cleared.");
}
