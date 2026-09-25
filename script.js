/* =========================================
   GAME OF EXAMS HARYANA
   FREE TYPING SPEED TEST
   VERSION 1.2
========================================= */


/* =========================================
   PASSAGE DATABASE
========================================= */

const passages = [

    "The development of technology has changed the way people communicate, learn and work. Modern students have access to information from many different sources. Regular practice, careful reading and effective time management can help students improve their performance.",

    "Education plays an important role in the development of an individual and society. A good education develops knowledge, skills, confidence and responsible citizenship. Students should develop the habit of learning regularly and applying their knowledge in practical situations.",

    "India is a diverse country with a rich cultural heritage. Different regions have their own languages, traditions, festivals and food habits. Despite this diversity, the people of India share a common identity and work together for the progress of the nation.",

    "Regular typing practice can improve speed and accuracy. Students should focus on correct finger placement, proper posture and consistent practice. Speed should increase naturally as accuracy and familiarity with the keyboard improve.",

    "The government provides various services for the welfare and development of citizens. Digital technology has made many public services easier to access. Students should develop good reading habits and improve their knowledge of current affairs and general awareness.",

    "Time management is an important skill for every student. A proper study plan helps students complete their work on time and reduces unnecessary stress. Regular practice, discipline and concentration can help students achieve their academic goals.",

    "The internet has become an important source of information and communication. Students can use digital resources to learn new concepts, practise questions and improve their skills. However, information should always be checked carefully before it is accepted as accurate.",

    "Public administration involves the implementation of government policies and the delivery of services to citizens. Efficient administration requires responsibility, transparency, discipline and proper use of resources. Technology can make administrative processes faster and more accessible.",

    "India has made significant progress in science, technology and infrastructure. New developments in digital services, transportation, communication and education are changing the lives of millions of people. Continuous innovation can contribute to economic and social development.",

    "A healthy lifestyle includes regular physical activity, nutritious food, adequate sleep and good personal habits. Students should maintain a balanced routine because physical health and mental concentration are closely connected with learning and productivity."

];


/* =========================================
   VARIABLES
========================================= */

let currentPassage = "";

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

    const input = document.getElementById("typingInput");

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

    showScreen("setupScreen");

}


/* =========================================
   PAPER TEST
========================================= */

function openPaperTest() {

    showScreen("paperScreen");

}


/* =========================================
   START TEST
========================================= */

function startTest(minutes) {

    clearInterval(timerInterval);

    testDuration = minutes;

    timeRemaining = minutes * 60;

    testStarted = false;

    testFinished = false;

    startTime = null;


    /* Random passage */

    currentPassage =
        passages[
            Math.floor(
                Math.random() * passages.length
            )
        ];


    /* Reset input */

    const input =
        document.getElementById("typingInput");

    input.value = "";

    input.disabled = false;


    /* Display passage with characters */

    renderPassage("");


    /* Reset timer */

    document.getElementById("timer").textContent =
        formatTime(timeRemaining);


    /* Reset statistics */

    document.getElementById("liveGrossWpm").textContent =
        "0";

    document.getElementById("liveWpm").textContent =
        "0";

    document.getElementById("liveMistakes").textContent =
        "0";

    document.getElementById("liveAccuracy").textContent =
        "100%";


    /* Reset progress */

    updateProgress(0);


    /* Open test */

    showScreen("testScreen");


    input.focus();

}


/* =========================================
   RENDER PASSAGE
========================================= */

function renderPassage(typedText) {

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


        span.classList.add("typing-char");


        span.textContent =
            currentPassage[i];


        /* Correct */

        if (
            i < typedText.length &&
            typedText[i] === currentPassage[i]
        ) {

            span.classList.add("correct");

        }


        /* Incorrect */

        else if (
            i < typedText.length &&
            typedText[i] !== currentPassage[i]
        ) {

            span.classList.add("incorrect");

        }


        /* Current character */

        if (
            i === typedText.length &&
            typedText.length < currentPassage.length
        ) {

            span.classList.add("current");

        }


        passageElement.appendChild(span);

    }


    /* Scroll current character into view */

    const current =
        passageElement.querySelector(".current");


    if (current) {

        current.scrollIntoView({
            block: "center",
            behavior: "smooth"
        });

    }

}


/* =========================================
   START TIMER
========================================= */

function startTimer() {

    if (testStarted || testFinished) {

        return;

    }


    testStarted = true;

    startTime = performance.now();


    timerInterval = setInterval(() => {

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
                (testDuration * 60) -
                elapsedSeconds
            );


        document.getElementById("timer").textContent =
            formatTime(timeRemaining);


        updateLiveStats();


        /* Time finished */

        if (timeRemaining <= 0) {

            finishTest();

        }

    }, 200);

}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);


    const secs =
        seconds % 60;


    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    );

}


/* =========================================
   GET WORDS
========================================= */

function getWords(text) {

    return text
        .trim()
        .split(/\s+/)
        .filter(
            word => word.length > 0
        );

}


/* =========================================
   COUNT MISTAKES
========================================= */

function calculateMistakes(typedText) {

    const typedWords =
        getWords(typedText);


    const originalWords =
        getWords(currentPassage);


    let mistakes = 0;


    typedWords.forEach(
        (word, index) => {

            if (
                index >= originalWords.length ||
                word !== originalWords[index]
            ) {

                mistakes++;

            }

        }
    );


    return mistakes;

}


/* =========================================
   GET ELAPSED TIME
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
   UPDATE PROGRESS
========================================= */

function updateProgress(typedCharacters) {

    const totalCharacters =
        currentPassage.length;


    let percentage = 0;


    if (totalCharacters > 0) {

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
        document.getElementById("progressFill");


    const progressText =
        document.getElementById("progressText");


    const characterCount =
        document.getElementById("characterCount");


    if (progressFill) {

        progressFill.style.width =
            percentage + "%";

    }


    if (progressText) {

        progressText.textContent =
            Math.round(percentage) + "%";

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
        document.getElementById("typingInput");


    const typedText =
        input.value;


    /* Update passage */

    renderPassage(typedText);


    /* Words */

    const typedWords =
        getWords(typedText);


    const wordsTyped =
        typedWords.length;


    /* Mistakes */

    const mistakes =
        calculateMistakes(typedText);


    /* Time */

    const elapsedSeconds =
        getElapsedSeconds();


    const elapsedMinutes =
        elapsedSeconds / 60;


    /* Gross WPM */

    let grossWpm = 0;


    if (elapsedMinutes > 0) {

        grossWpm =
            wordsTyped /
            elapsedMinutes;

    }


    /* Net WPM */

    let netWpm = 0;


    if (elapsedMinutes > 0) {

        netWpm =
            (
                wordsTyped -
                mistakes
            ) /
            elapsedMinutes;

    }


    /* Accuracy */

    let accuracy = 100;


    if (wordsTyped > 0) {

        accuracy =
            (
                (
                    wordsTyped -
                    mistakes
                ) /
                wordsTyped
            ) * 100;

    }


    /* Display Gross WPM */

    document.getElementById("liveGrossWpm").textContent =
        Math.max(
            0,
            Math.round(grossWpm)
        );


    /* Display Net WPM */

    document.getElementById("liveWpm").textContent =
        Math.max(
            0,
            Math.round(netWpm)
        );


    /* Mistakes */

    document.getElementById("liveMistakes").textContent =
        mistakes;


    /* Accuracy */

    document.getElementById("liveAccuracy").textContent =
        Math.max(
            0,
            accuracy
        ).toFixed(1) + "%";


    /* Progress */

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


    clearInterval(timerInterval);

    timerInterval = null;


    const input =
        document.getElementById("typingInput");


    const typedText =
        input.value;


    const typedWords =
        getWords(typedText);


    const wordsTyped =
        typedWords.length;


    const mistakes =
        calculateMistakes(typedText);


    let elapsedSeconds =
        getElapsedSeconds();


    /* Full duration */

    if (
        timeRemaining <= 0 &&
        testStarted
    ) {

        elapsedSeconds =
            testDuration * 60;

    }


    /* Avoid division by zero */

    if (elapsedSeconds <= 0) {

        elapsedSeconds = 1;

    }


    const elapsedMinutes =
        elapsedSeconds / 60;


    /* YOUR FORMULA */

    const netWpm =
        (
            wordsTyped -
            mistakes
        ) /
        elapsedMinutes;


    /* Accuracy */

    let accuracy = 100;


    if (wordsTyped > 0) {

        accuracy =
            (
                (
                    wordsTyped -
                    mistakes
                ) /
                wordsTyped
            ) * 100;

    }


    /* Stop test */

    testFinished = true;

    testStarted = false;

    startTime = null;


    input.disabled = true;


    /* Final results */

    document.getElementById("finalWpm").textContent =
        Math.max(
            0,
            netWpm
        ).toFixed(1);


    document.getElementById("finalWords").textContent =
        wordsTyped;


    document.getElementById("finalMistakes").textContent =
        mistakes;


    document.getElementById("finalAccuracy").textContent =
        Math.max(
            0,
            accuracy
        ).toFixed(1) + "%";


    document.getElementById("finalTime").textContent =
        formatTime(elapsedSeconds);


    /* Result screen */

    showScreen("resultScreen");

}


/* =========================================
   INPUT EVENT
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const input =
            document.getElementById("typingInput");


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
