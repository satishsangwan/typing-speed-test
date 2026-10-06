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

// ================================
// SKAU UNIVERSITY TYPING TEST
// ================================


function openSKAUTest() {

    renderSKAUPassages();

    showScreen("skauPassageScreen");

}

// Start SKAU test after instructions
function startSKAUTestFromInstructions() {

    const agreement =
        document.getElementById("skauInstructionAgreement");

    if (!agreement.checked) {

        alert(
            "Please read and accept the instructions before starting the SKAU typing test."
        );

        return;
    }

  loadSKAUPassage();

showScreen("skauTypingScreen");

startSKAUTimer();

const skauInput =
    document.getElementById("skauTypingInput");

if (skauInput) {

    skauInput.value = "";

}

setupSKAUTyping();

if (skauInput) {

    skauInput.focus();

}
}
// ================================
// SKAU TYPING PASSAGE
// ================================

const skauPassage = `
The development of education plays an important role in the progress of society. A good education system provides individuals with knowledge, skills and values that help them participate effectively in social and professional life. Educational institutions also encourage discipline, responsibility, communication and critical thinking among students.

In the modern world, technology has become an important part of education. Computers and digital resources provide students with access to a wide range of information and learning materials. However, technology should be used carefully and responsibly. Students need to develop both technical skills and the ability to understand, evaluate and apply information correctly.

Regular practice is essential for improving typing speed and accuracy. A candidate should maintain proper posture, keep both hands correctly positioned on the keyboard and concentrate on the displayed passage. Accuracy should be given importance because typing quickly with frequent mistakes may reduce the overall performance.

A successful typing test requires concentration, consistency and familiarity with the keyboard. Candidates should avoid unnecessary movements and should type the passage exactly as displayed. Careful practice can gradually improve speed, reduce errors and increase confidence during an examination.
`.trim();

const skauPassages = [

    {
        id: 1,
        title: "Education and Society",
        difficulty: "Easy",
        text: skauPassage
    },

    {
        id: 2,
        title: "Importance of Discipline",
        difficulty: "Easy",
        text: `
Discipline is one of the most important qualities required for success in personal, academic and professional life. It teaches a person to follow rules, respect time and complete responsibilities in an organized manner. A disciplined individual understands that regular effort and consistency are necessary to achieve meaningful goals. Discipline does not mean that a person must live without freedom. Rather, it helps an individual use freedom responsibly and make sensible decisions.

In student life, discipline plays a particularly important role. Students who attend classes regularly, complete their assignments on time and revise their lessons systematically are generally better prepared for examinations. A proper daily routine also provides sufficient time for study, rest, recreation and other activities. When students learn to manage their time effectively, they become more confident and independent.

Punctuality is another important part of discipline. Reaching school, college or the workplace on time shows respect for other people's time and reflects a responsible attitude. Delaying important tasks repeatedly may create unnecessary pressure and affect the quality of work. Therefore, developing the habit of completing work within the required time can be extremely useful in both education and employment.

Discipline is also important while using modern technology. Computers, mobile phones and the internet provide many opportunities for learning and communication, but careless use can waste valuable time. Students should learn to use digital resources for productive purposes and avoid unnecessary distractions. Maintaining a healthy balance between online activities, studies and physical exercise is essential for overall development.

Good discipline is developed gradually through regular practice. A person can begin by setting small and realistic goals, following a timetable and reviewing daily progress. Mistakes should not be considered failures; instead, they should be treated as opportunities to improve. With patience and continuous effort, disciplined habits can become a natural part of daily life.

In professional life, discipline contributes to reliability and teamwork. Employees are expected to follow instructions, maintain professional standards, meet deadlines and cooperate with colleagues. A disciplined workplace can function more efficiently because responsibilities are clearly understood and tasks are completed systematically. Thus, discipline benefits not only individuals but also families, educational institutions, offices and society as a whole.

True discipline comes from self-control and an understanding of responsibility. It encourages people to make thoughtful choices even when nobody is watching. By developing discipline at an early stage of life, students can build habits that support academic success, professional growth and responsible citizenship. Regular practice, punctuality, concentration and respect for others can together create a strong foundation for a successful and balanced life.
`.trim()
    },
       {
        id: 3,
        title: "Value of Time",
        difficulty: "Easy",
        text: `
Time is one of the most valuable resources available to every person. Unlike money or material possessions, time once lost can never be recovered. Every individual receives the same number of hours in a day, but people use those hours in different ways. The wise use of time can help a person achieve goals, develop useful habits and maintain a balanced life.

Students should understand the importance of time from an early age. A student who prepares a daily timetable can divide available time between studies, revision, exercise, recreation and rest. Such a routine reduces confusion and makes it easier to complete important tasks. It is not necessary to study continuously for many hours. Regular study with proper concentration is often more effective than long periods of distracted work.

Punctuality is closely connected with the proper use of time. Reaching school or an examination centre on time shows responsibility and respect for others. Similarly, completing assignments and other tasks before their deadlines prevents unnecessary stress. People who regularly postpone their work may eventually have several unfinished tasks at the same time. This can reduce confidence and affect the quality of their performance.

Modern technology has made time management both easier and more difficult. Digital calendars, reminders and planning applications can help people organize their schedules. At the same time, social media, online entertainment and unnecessary notifications can consume many hours without providing any meaningful benefit. Students should therefore learn to control their use of digital devices and give priority to important activities.

Effective time management does not mean filling every minute of the day with work. Rest and recreation are also necessary for physical and mental well-being. A balanced schedule allows a person to remain productive without becoming exhausted. Short breaks during study can improve concentration and help the mind remain fresh. Adequate sleep is equally important because tiredness can reduce attention and memory.

Another useful habit is to identify tasks according to their importance. Urgent and important work should be completed first, while less important activities can be planned for later. Breaking a large task into smaller steps can also make it easier to begin and complete. When a person follows such simple methods regularly, managing time becomes more natural.

The value of time becomes especially clear during examinations and other important events. A candidate who has prepared well but fails to manage the available time may not be able to complete the required work. Therefore, students should practise not only knowledge and skills but also the ability to work within a fixed period.

Time management is ultimately a form of self-discipline. It teaches people to make thoughtful choices about how they spend their day. By respecting time, setting priorities and avoiding unnecessary distractions, students can improve their academic performance and develop habits that remain useful throughout their lives.
`.trim()
    },

       {
        id: 4,
        title: "Role of Technology in Education",
        difficulty: "Moderate",
        text: `
Technology has transformed the way information is created, shared and accessed in modern society. Educational institutions are increasingly using computers, digital classrooms, online resources and learning platforms to support traditional methods of teaching. When used appropriately, these tools can provide students with additional opportunities to understand difficult concepts, practise skills and obtain information from a wide variety of reliable sources.

One of the major advantages of technology in education is the availability of learning material beyond the physical classroom. Students can access electronic books, recorded lectures, educational websites and digital reference material according to their individual requirements. This flexibility can be particularly useful for students who need additional time to understand a topic or who wish to revise a lesson several times. However, easy access to information does not automatically guarantee meaningful learning. Students must develop the ability to distinguish reliable information from inaccurate or misleading content.

Teachers also have an important role in guiding students in the responsible use of technology. Digital tools should support learning rather than replace concentration, discussion and independent thinking. A teacher can encourage students to compare information from different sources, ask relevant questions and use evidence before accepting a particular conclusion. Such activities help learners develop analytical skills that are useful both inside and outside the classroom.

Another important consideration is digital discipline. Continuous notifications, entertainment applications and social networking platforms can easily distract students from academic work. Excessive screen time may also affect sleep, physical activity and personal interaction. Therefore, students should establish reasonable limits for recreational use of digital devices. Planning specific periods for study, communication and entertainment can help maintain a healthier routine.

Technology has also changed the nature of communication between educational institutions, teachers and families. Notices, assignments, schedules and other information can be shared quickly through digital platforms. Parents may receive regular updates about academic activities and school programmes. At the same time, institutions must ensure that personal information is handled carefully and that digital communication follows appropriate standards of privacy and security.

The growing use of technology also highlights the importance of equal access. Not every student has the same quality of internet connection, digital equipment or technical support at home. Educational institutions should therefore consider the needs of students who may face difficulties in accessing digital resources. Providing alternatives and appropriate support can help reduce the gap between learners.

Artificial intelligence and other advanced technologies are creating new possibilities in education as well. These systems can assist with information processing, personalised learning and certain administrative tasks. Nevertheless, technology should remain a tool under responsible human supervision. Students need to understand that using a digital system to complete a task is not the same as developing the knowledge and skills required to perform that task independently.

The most effective approach is therefore a balanced one. Traditional classroom interaction, reading, writing, practical activities and discussion can be combined with carefully selected digital resources. Technology can make education more flexible and accessible, but its success depends on how thoughtfully it is used. Students who learn to combine technological skills with concentration, judgement, creativity and responsibility will be better prepared for the changing demands of higher education, employment and society.
`.trim()
    },

       {
        id: 5,
        title: "Importance of Public Services",
        difficulty: "Moderate",
        text: `
Public services play an essential role in the functioning of a modern society. Roads, public transport, healthcare facilities, schools, sanitation systems, water supply and administrative services affect the daily lives of millions of people. The quality of these services influences not only individual convenience but also economic development, public health and social well-being. Effective public administration is therefore an important foundation for a stable and progressive society.

Education and healthcare are among the most important public services. Schools provide children with knowledge, skills and opportunities for personal development, while healthcare institutions help people receive treatment and preventive care. Equal access to these services is particularly important because differences in income should not prevent individuals from obtaining basic facilities. Governments and public institutions therefore have a responsibility to improve accessibility and maintain appropriate standards.

Public infrastructure also contributes significantly to economic activity. Well-maintained roads and transport networks make it easier for people and goods to move from one place to another. Reliable electricity, communication systems and water facilities support households, businesses and educational institutions. When infrastructure is poorly maintained, delays and additional costs can affect both citizens and economic organisations. Regular planning, monitoring and maintenance are therefore necessary for efficient public infrastructure.

Another important area is sanitation and waste management. Clean surroundings reduce the risk of disease and contribute to a healthier environment. Waste must be collected, transported and processed using appropriate methods. Citizens also have a responsibility to avoid littering and to follow local waste-management practices. Public authorities and communities can achieve better results when they cooperate rather than treating cleanliness as the responsibility of only one group.

Technology has increasingly become part of public service delivery. Online applications, digital records, electronic payments and information portals can reduce paperwork and save time for citizens. Digital systems may also improve transparency by making certain procedures easier to track. However, technology should not create new barriers for people who have limited access to the internet or lack digital skills. Public institutions must continue to provide suitable alternatives and assistance where necessary.

Accountability is another important principle in the delivery of public services. Citizens expect public institutions to use resources responsibly and provide services according to established rules. Clear procedures, proper record keeping and effective grievance mechanisms can help improve confidence in public administration. When a problem occurs, people should have reasonable opportunities to report it and receive information about the steps taken to address it.

Public participation can also improve the quality of services. Local communities often understand their needs and problems better than outside observers. Consultation with residents can therefore help authorities identify priorities and design practical solutions. Participation may take the form of meetings, surveys, feedback systems or other appropriate methods of communication. Listening to citizens does not mean that every request can be accepted, but it can help institutions make better informed decisions.

Ultimately, good public services require planning, adequate resources, trained personnel and continuous evaluation. Improvements cannot always be achieved immediately, and different regions may face different challenges. Nevertheless, consistent attention to quality, accessibility, accountability and responsible use of technology can make a significant difference. Strong public services help create healthier communities, support economic opportunity and strengthen people's confidence in the institutions that serve them.
`.trim()
    },

       {
        id: 6,
        title: "Environmental Responsibility",
        difficulty: "Moderate",
        text: `
Environmental responsibility has become an important part of modern life because human activities have a direct effect on natural resources and ecological systems. Population growth, expanding cities, industrial development and increasing consumption have created new challenges for air, water, soil and biodiversity. Economic development is necessary for improving living standards, but development that ignores environmental consequences can create problems that are difficult and expensive to solve later.

One of the most visible environmental concerns is the quality of air in urban and industrial areas. Vehicles, factories, construction activities and the burning of certain fuels can release pollutants into the atmosphere. Poor air quality may affect human health and can also contribute to wider environmental problems. Reducing unnecessary emissions requires cooperation between authorities, industries and citizens. Cleaner technologies, better public transport and responsible use of energy can all contribute to improvement.

Water is another essential resource that requires careful management. Freshwater is needed for drinking, agriculture, sanitation, industry and many other activities. In some regions, excessive extraction of groundwater and irregular rainfall have created serious concerns about water availability. Pollution from untreated waste and chemicals can further reduce the quality of available water. Conservation, efficient use and proper treatment of wastewater are therefore important parts of responsible water management.

Waste management is closely connected with environmental protection. Increasing consumption produces large quantities of household, commercial and industrial waste. If waste is not collected and processed properly, it can pollute land and water and create unhealthy surroundings. Segregating waste at the source can make recycling and treatment more effective. Citizens can contribute by reducing unnecessary consumption, reusing suitable materials and following local waste-disposal systems.

Energy use also has an important environmental dimension. Fossil fuels have supported industrial and economic development for many decades, but their use can contribute to air pollution and greenhouse gas emissions. Renewable sources such as solar and wind energy provide alternatives that can reduce dependence on conventional fuels. Improving energy efficiency is equally important because using less energy for the same purpose can reduce both costs and environmental pressure.

Protecting biodiversity is another major responsibility. Forests, wetlands, grasslands and other natural habitats support a wide range of plants and animals. They also provide services that benefit human communities, including soil protection, water regulation and climate-related functions. Unplanned development, pollution and excessive exploitation of natural resources can damage these habitats. Conservation efforts should therefore consider both ecological requirements and the legitimate needs of local communities.

Environmental responsibility is not limited to governments or large organisations. Individuals can make meaningful contributions through everyday decisions. Saving electricity and water, using public transport when practical, avoiding unnecessary plastic and maintaining clean surroundings are simple examples. Educational institutions can also encourage environmental awareness through projects, campaigns and practical activities that help students understand the connection between human behaviour and natural systems.

Long-term environmental protection requires informed decision-making and cooperation. Scientific information can help identify problems and evaluate possible solutions, while local knowledge can provide useful understanding of conditions on the ground. Policies should be implemented consistently and reviewed when circumstances change. Businesses also have a role in adopting cleaner processes and using resources efficiently.

A responsible approach to the environment does not require society to stop developing. Instead, it requires development to be planned in a way that considers long-term consequences. By combining economic opportunity with conservation, efficient resource use and public participation, communities can work towards a healthier and more sustainable future for present and future generations.
`.trim()
    },

    {
        id: 7,
        title: "Importance of Communication Skills",
        difficulty: "Moderate",
        text: `
Communication is an essential part of human life and plays an important role in education, employment and social relationships. People communicate with one another to exchange information, express ideas, explain problems and understand different points of view. Effective communication is not limited to speaking clearly. It also involves listening carefully, selecting appropriate words and understanding the situation in which a message is being delivered.

Students can benefit greatly from developing good communication skills. Classroom discussions, presentations, group activities and written assignments provide opportunities to express thoughts in an organised manner. A student who can explain an idea clearly is often better able to participate in academic activities. Communication skills also help students ask questions when they do not understand a topic and seek appropriate guidance from teachers or other individuals.

Listening is an important but sometimes overlooked part of communication. A good listener pays attention to the speaker and tries to understand the complete message before responding. Interrupting frequently or preparing a response without listening carefully can lead to misunderstanding. In academic and professional environments, careful listening helps people understand instructions, identify important information and respond more accurately.

Written communication has become increasingly important with the growth of digital communication. Emails, applications, reports, notices and official messages are commonly used in educational institutions and workplaces. Written information should be clear, concise and properly organised. Spelling, grammar and punctuation can influence how easily a message is understood. Before sending an important document, it is useful to read it again and check whether the intended meaning is clear.

Communication also depends on confidence and appropriate behaviour. A person may have valuable ideas but may find it difficult to express them because of hesitation or fear of making mistakes. Regular practice can gradually improve confidence. However, confidence should not be confused with speaking without considering others. Respectful communication requires people to listen to different opinions and respond politely even when they disagree.

Non-verbal communication can also influence the way a message is understood. Facial expressions, gestures, posture and eye contact may provide additional information during a conversation. These signals should be appropriate to the situation and cultural context. In formal settings, professional behaviour and attentive body language can create a positive impression and make communication more effective.

Modern technology has created many new methods of communication. Video meetings, instant messaging, electronic mail and online learning platforms allow people to communicate across long distances. These tools can save time and improve access to information, but they also require responsible use. Messages written quickly may sometimes be misunderstood because they do not include the tone or expressions present in face-to-face communication. Users should therefore choose their words carefully and avoid sending unnecessary or offensive content.

Good communication is especially important in teamwork. When several people work together, responsibilities and expectations need to be understood clearly. Team members should share relevant information, discuss difficulties and provide constructive feedback. If communication is poor, even a well-planned task may face delays or confusion. Open and respectful communication can help a group solve problems more efficiently.

Communication skills can be developed through continuous practice. Reading regularly can improve vocabulary and understanding, while writing can help organise thoughts. Participating in discussions and presentations can increase confidence in speaking. Most importantly, people should learn from their communication mistakes rather than avoiding opportunities to communicate. Strong communication skills help individuals express themselves effectively, understand others and build productive relationships in academic, professional and social life.
`.trim()
    }
   
];

let selectedSKAUPassage = null;

function renderSKAUPassages() {

    const list =
        document.getElementById("skauPassageList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    skauPassages.forEach(function(passage) {

        const card =
            document.createElement("div");

        card.className =
            "skau-passage-card";

        card.innerHTML = `

            <div class="skau-passage-card-info">

                <h3>
                    ${passage.id}. ${passage.title}
                </h3>

                <span class="skau-difficulty">
                    ${passage.difficulty}
                </span>

            </div>

            <button
                class="skau-select-button"
                onclick="selectSKAUPassage(${passage.id})">

                Select →

            </button>

        `;

        list.appendChild(card);

    });

}

function selectSKAUPassage(passageId) {

    const passage =
        skauPassages.find(function(item) {

            return item.id === passageId;

        });

    if (!passage) {
        return;
    }

    selectedSKAUPassage =
        passage;

    showScreen(
        "skauInstructionsScreen"
    );

}

function selectRandomSKAUPassage() {

    const randomIndex =
        Math.floor(
            Math.random() *
            skauPassages.length
        );

    selectedSKAUPassage =
        skauPassages[randomIndex];

    showScreen(
        "skauInstructionsScreen"
    );

}

// Load SKAU typing passage
function loadSKAUPassage() {

    const sourceText =
        document.getElementById("skauSourceText");

    if (!sourceText) {
        return;
    }

    const currentPassageText =
        selectedSKAUPassage
            ? selectedSKAUPassage.text
            : skauPassage;

    const parts =
        currentPassageText.split(/(\s+)/);

    sourceText.innerHTML = "";

    let wordIndex = 0;

    parts.forEach(function(part) {

        if (/^\s+$/.test(part)) {

            sourceText.appendChild(
                document.createTextNode(part)
            );

        } else {

            const word =
                document.createElement("span");

            word.textContent = part;

            word.dataset.wordIndex =
                wordIndex;

            sourceText.appendChild(word);

            wordIndex++;

        }

    });

    sourceText.scrollTop = 0;

}

// SKAU Timer
let skauTimeRemaining = 10 * 60;
let skauTimerInterval = null;
// SKAU typing control
let skauLockedPosition = 0;

function setupSKAUTyping() {

    const skauInput =
        document.getElementById("skauTypingInput");

    if (!skauInput) {
        return;
    }

    skauLockedPosition = 0;

    skauInput.onkeydown = function(event) {

        // Space Bar commits the current word
        if (event.key === " ") {

            skauLockedPosition =
                skauInput.selectionStart + 1;

            return;
        }


        // Prevent Backspace from entering a previously
        // completed word
        if (event.key === "Backspace") {

            if (
                skauInput.selectionStart <=
                skauLockedPosition
            ) {

                event.preventDefault();

            }

        }

    };
// Live error calculation
    skauInput.oninput = function() {

    const typedText =
        skauInput.value;

  // -------------------------------
// AUTO-SCROLL TYPING MATTER
// -------------------------------

const sourceText =
    document.getElementById("skauSourceText");

if (sourceText) {

    const typedWords =
        typedText.trim() === ""
            ? 0
            : typedText.trim().split(/\s+/).length;

    const currentWordIndex =
        Math.max(
            0,
            typedWords - 1
        );

    const currentWord =
        sourceText.querySelector(
            '[data-word-index="' +
            currentWordIndex +
            '"]'
        );

    if (currentWord) {

        const sourceRect =
            sourceText.getBoundingClientRect();

        const wordRect =
            currentWord.getBoundingClientRect();

        const top =
            wordRect.top -
            sourceRect.top;

        const bottom =
            wordRect.bottom -
            sourceRect.top;

        const visibleHeight =
            sourceText.clientHeight;


        // Keep the current word inside
        // the comfortable middle area.

        const upperLimit =
            visibleHeight * 0.20;

        const lowerLimit =
            visibleHeight * 0.75;


        // Current word has reached the
        // lower viewing limit.
        if (bottom > lowerLimit) {

            const newScrollTop =
                sourceText.scrollTop +
                (bottom - lowerLimit);

            sourceText.scrollTop =
                Math.min(
                    newScrollTop,
                    sourceText.scrollHeight -
                    sourceText.clientHeight
                );
        }


        // Also correct the position if the
        // current word somehow goes above
        // the viewing area.
        else if (top < upperLimit) {

            const newScrollTop =
                sourceText.scrollTop -
                (upperLimit - top);

            sourceText.scrollTop =
                Math.max(
                    0,
                    newScrollTop
                );
        }

    }

}
       
    // Calculate errors
    const errors =
        calculateSKAUErrors(typedText);


    // -------------------------------
    // LIVE ERRORS
    // -------------------------------

    const errorDisplay =
        document.getElementById("skauLiveErrors");

    if (errorDisplay) {

        errorDisplay.textContent =
            errors;

    }


    // -------------------------------
    // LIVE SPEED
    // -------------------------------

    const elapsedSeconds =
        (10 * 60) - skauTimeRemaining;

    const elapsedMinutes =
        elapsedSeconds / 60;

    const typedWords =
        typedText.trim() === ""
            ? 0
            : typedText.trim().split(/\s+/).length;

    let speed = 0;

    if (elapsedMinutes > 0) {

        speed =
            typedWords / elapsedMinutes;

    }

    const speedDisplay =
        document.getElementById("skauLiveWpm");

    if (speedDisplay) {

        speedDisplay.textContent =
            Math.max(0, speed).toFixed(1);

    }


    // -------------------------------
    // LIVE ACCURACY
    // -------------------------------

    let accuracy = 100;

    if (typedWords > 0) {

        accuracy =
            ((typedWords - errors) /
            typedWords) * 100;

    }

    accuracy =
        Math.max(
            0,
            Math.min(
                100,
                accuracy
            )
        );

    const accuracyDisplay =
        document.getElementById(
            "skauLiveAccuracy"
        );

    if (accuracyDisplay) {

        accuracyDisplay.textContent =
            accuracy.toFixed(1) + "%";

    }

};
}


function startSKAUTimer() {

    clearInterval(skauTimerInterval);

    skauTimeRemaining = 10*60;

    updateSKAUTimerDisplay();

    skauTimerInterval = setInterval(function () {

        skauTimeRemaining--;

        updateSKAUTimerDisplay();

        if (skauTimeRemaining <= 0) {

    clearInterval(skauTimerInterval);

    skauTimeRemaining = 0;

    updateSKAUTimerDisplay();

    finishSKAUTest();
}

    }, 1000);
}

function finishSKAUTest() {

    clearInterval(skauTimerInterval);

    const skauInput =
        document.getElementById("skauTypingInput");

    const typedText =
        skauInput
            ? skauInput.value
            : "";

    const errors =
        calculateSKAUErrors(typedText);

    const typedWords =
        typedText.trim() === ""
            ? 0
            : typedText.trim().split(/\s+/).length;

    const elapsedMinutes =
        10;

    const speed =
        typedWords / elapsedMinutes;

    let accuracy = 100;

    if (typedWords > 0) {

        accuracy =
            ((typedWords - errors) /
            typedWords) * 100;

    }

    accuracy =
        Math.max(
            0,
            Math.min(
                100,
                accuracy
            )
        );


    // Store final SKAU result
    const skauResult = {

        words:
            typedWords,

        speed:
            Number(speed.toFixed(1)),

        accuracy:
            Number(accuracy.toFixed(1)),

        errors:
            errors,

        date:
            new Date().toLocaleString()

    };


    // Show final result for now
   // Update result screen
document.getElementById("skauResultSpeed").textContent =
    skauResult.speed;

document.getElementById("skauResultAccuracy").textContent =
    skauResult.accuracy + "%";

document.getElementById("skauResultErrors").textContent =
    skauResult.errors;

document.getElementById("skauResultWords").textContent =
    skauResult.words;


// Show SKAU result screen
showScreen("skauResultScreen");

}

function startSKAUTestAgain() {

    clearInterval(skauTimerInterval);

    const skauInput =
        document.getElementById("skauTypingInput");

    if (skauInput) {
        skauInput.value = "";
    }

    skauTimeRemaining = 10 * 60;

    loadSKAUPassage();

    showScreen("skauTypingScreen");

    startSKAUTimer();

    setupSKAUTyping();

    if (skauInput) {
        skauInput.focus();
    }

}

function updateSKAUTimerDisplay() {

    const minutes =
        Math.floor(skauTimeRemaining / 60);

    const seconds =
        skauTimeRemaining % 60;

    const formattedTime =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

    const timer =
        document.getElementById("skauTimer");

    const liveTime =
        document.getElementById("skauLiveTime");

    if (timer) {
        timer.textContent = formattedTime;
    }

    if (liveTime) {
        liveTime.textContent = formattedTime;
    }
}

// ================================
// SKAU ERROR CALCULATION
// ================================

function calculateSKAUErrors(typedText) {

   const originalText =
    selectedSKAUPassage
        ? selectedSKAUPassage.text
        : skauPassage;

const originalWords =
    originalText.trim().split(/\s+/);

    const typedWords =
        typedText.trim().split(/\s+/);

    let errors = 0;

    let originalIndex = 0;
    let typedIndex = 0;


    while (
        originalIndex < originalWords.length &&
        typedIndex < typedWords.length
    ) {

        const originalWord =
            originalWords[originalIndex];

        const typedWord =
            typedWords[typedIndex];


        // Correct word
        if (typedWord === originalWord) {

            originalIndex++;
            typedIndex++;

            continue;
        }


        // Check whether the candidate skipped
        // the current original word
        if (
            originalIndex + 1 <
            originalWords.length &&
            typedWord ===
            originalWords[originalIndex + 1]
        ) {

            errors++;

            originalIndex++;

            continue;
        }


        // Check whether an extra typed word
        // has been entered
        if (
            typedIndex + 1 <
            typedWords.length &&
            typedWords[typedIndex + 1] ===
            originalWord
        ) {

            errors++;

            typedIndex++;

            continue;
        }


        // Word is incorrect
        errors++;

        originalIndex++;
        typedIndex++;

    }


    // Any extra typed words are errors
    if (
        typedIndex <
        typedWords.length
    ) {

        errors +=
            typedWords.length -
            typedIndex;

    }


    return errors;
}
