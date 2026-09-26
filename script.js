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

    const container =
        document.getElementById("paperPassageList");


    container.innerHTML = "";


    paperPassages.forEach(passage => {

        const card =
            document.createElement("div");


        card.className =
            "paper-passage-card";


        card.innerHTML = `

    <h3>${passage.title}</h3>

    <p>
        ${passage.category}
    </p>

    <p>
        Difficulty: <strong>
        ${passage.difficulty}
        </strong>
    </p>

    <p>
        ${getWords(passage.text).length} words
    </p>

    <button
        onclick="printPaperPassage(${passage.id})">

        🖨️ Print Passage

    </button>

    <button
        onclick="startPaperTest(${passage.id})">

        ⌨️ Start Test

    </button>

`;


        container.appendChild(card);

    });

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


/* =========================================
   START SCREEN TEST
========================================= */

function startTest(minutes) {

    currentMode = "screen";


    const randomPassage =
        screenPassages[
            Math.floor(
                Math.random() *
                screenPassages.length
            )
        ];


    prepareTest(
        minutes,
        randomPassage.text
    );

}

/* =========================================
   START PAPER TEST
========================================= */

function startPaperTest(id) {

    const passage =
        getPaperPassage(id);


    if (!passage) {

        return;

    }


    currentPaperPassage =
        passage;


    currentMode = "paper";


    prepareTest(
        10,
        passage.text
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
            "📄 PAPER → SCREEN";

    } else {

        modeLabel.textContent =
            "⌨️ SCREEN → SCREEN";

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


    const current =
        passageElement.querySelector(
            ".current"
        );


    if (current) {

        current.scrollIntoView({
            block: "center",
            behavior: "smooth"
        });

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

function calculateMistakes(
    typedText
) {

    const typedWords =
        getWords(typedText);


    const originalWords =
        getWords(
            currentPassage
        );


    let mistakes = 0;


    typedWords.forEach(
        (word, index) => {

            if (
                index >=
                originalWords.length ||

                word !==
                originalWords[index]
            ) {

                mistakes++;

            }

        }
    );


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

function updateProgress(
    typedCharacters
) {

    const totalCharacters =
        currentPassage.length;


    let percentage = 0;


    if (
        totalCharacters > 0
    ) {

        percentage =
            (
                typedCharacters /
                totalCharacters
            ) * 100;

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
            Math.round(
                percentage
            ) + "%";

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
        typedText.length
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
