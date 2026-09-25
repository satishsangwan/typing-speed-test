const passages = [

    "The development of technology has changed the way people communicate, learn and work. Modern students have access to information from many different sources. Regular practice, careful reading and effective time management can help students improve their performance.",

    "Education plays an important role in the development of an individual and society. A good education develops knowledge, skills, confidence and responsible citizenship. Students should develop the habit of learning regularly and applying their knowledge in practical situations.",

    "India is a diverse country with a rich cultural heritage. Different regions have their own languages, traditions, festivals and food habits. Despite this diversity, the people of India share a common identity and work together for the progress of the nation.",

    "Regular typing practice can improve speed and accuracy. Students should focus on correct finger placement, proper posture and consistent practice. Speed should increase naturally as accuracy and familiarity with the keyboard improve.",

    "The government provides various services for the welfare and development of citizens. Digital technology has made many public services easier to access. Students should develop good reading habits and improve their knowledge of current affairs and general awareness."

];


let currentPassage = "";
let testDuration = 1;
let timeRemaining = 0;
let timerInterval = null;
let testStarted = false;
let startTime = null;


/* ==============================
   SCREEN MANAGEMENT
============================== */

function showScreen(id) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");
}


function goHome() {

    clearInterval(timerInterval);

    timerInterval = null;
    testStarted = false;
    startTime = null;

    showScreen("homeScreen");
}


/* ==============================
   OPEN SCREEN TEST
============================== */

function openScreenTest() {

    clearInterval(timerInterval);

    timerInterval = null;
    testStarted = false;
    startTime = null;

    showScreen("setupScreen");
}


/* ==============================
   PAPER TEST
============================== */

function openPaperTest() {

    showScreen("paperScreen");

}


/* ==============================
   START TEST
============================== */

function startTest(minutes) {

    clearInterval(timerInterval);

    testDuration = minutes;

    timeRemaining = minutes * 60;

    testStarted = false;

    startTime = null;


    /* Select random passage */

    currentPassage =
        passages[Math.floor(Math.random() * passages.length)];


    document.getElementById("passage").textContent =
        currentPassage;


    /* Reset input */

    const input =
        document.getElementById("typingInput");

    input.value = "";


    /* Reset statistics */

    document.getElementById("timer").textContent =
        formatTime(timeRemaining);

    document.getElementById("liveWpm").textContent =
        "0";

    document.getElementById("liveMistakes").textContent =
        "0";

    document.getElementById("liveAccuracy").textContent =
        "100%";


    showScreen("testScreen");

    input.focus();

}


/* ==============================
   START TIMER
============================== */

function startTimer() {

    if (testStarted) {
        return;
    }


    testStarted = true;

    startTime = performance.now();


    timerInterval = setInterval(() => {

        const elapsedSeconds =
            Math.floor(
                (performance.now() - startTime) / 1000
            );


        timeRemaining =
            Math.max(
                0,
                (testDuration * 60) - elapsedSeconds
            );


        document.getElementById("timer").textContent =
            formatTime(timeRemaining);


        updateLiveStats();


        if (timeRemaining <= 0) {

            finishTest();

        }

    }, 200);

}


/* ==============================
   FORMAT TIME
============================== */

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


/* ==============================
   GET WORDS
============================== */

function getWords(text) {

    return text
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0);

}


/* ==============================
   CALCULATE MISTAKES
============================== */

function calculateMistakes(typedText) {

    const typedWords =
        getWords(typedText);

    const originalWords =
        getWords(currentPassage);


    let mistakes = 0;


    typedWords.forEach((word, index) => {

        if (
            index >= originalWords.length ||
            word !== originalWords[index]
        ) {

            mistakes++;

        }

    });


    return mistakes;

}


/* ==============================
   GET ELAPSED TIME
============================== */

function getElapsedSeconds() {

    if (!testStarted || !startTime) {

        return 0;

    }


    const elapsed =
        Math.floor(
            (performance.now() - startTime) / 1000
        );


    return Math.min(
        elapsed,
        testDuration * 60
    );

}


/* ==============================
   LIVE STATISTICS
============================== */

function updateLiveStats() {

    const typedText =
        document.getElementById("typingInput").value;


    const typedWords =
        getWords(typedText);


    const wordsTyped =
        typedWords.length;


    const mistakes =
        calculateMistakes(typedText);


    const elapsedSeconds =
        getElapsedSeconds();


    const elapsedMinutes =
        elapsedSeconds / 60;


    let grossWpm = 0;


    if (elapsedMinutes > 0) {

        grossWpm =
            wordsTyped / elapsedMinutes;

    }


    let accuracy = 100;


    if (wordsTyped > 0) {

        accuracy =
            (
                (wordsTyped - mistakes) /
                wordsTyped
            ) * 100;

    }


    document.getElementById("liveWpm").textContent =
        Math.max(
            0,
            Math.round(grossWpm)
        );


    document.getElementById("liveMistakes").textContent =
        mistakes;


    document.getElementById("liveAccuracy").textContent =
        Math.max(
            0,
            accuracy
        ).toFixed(1) + "%";

}


/* ==============================
   FINISH TEST
============================== */

function finishTest() {

    clearInterval(timerInterval);

    timerInterval = null;


    const typedText =
        document.getElementById("typingInput").value;


    const typedWords =
        getWords(typedText);


    const wordsTyped =
        typedWords.length;


    const mistakes =
        calculateMistakes(typedText);


    let elapsedSeconds =
        getElapsedSeconds();


    /*
       If the timer has finished automatically,
       use the complete test duration.
    */

    if (
        timeRemaining <= 0 &&
        testStarted
    ) {

        elapsedSeconds =
            testDuration * 60;

    }


    /*
       Prevent division by zero.
    */

    if (elapsedSeconds <= 0) {

        elapsedSeconds = 1;

    }


    const elapsedMinutes =
        elapsedSeconds / 60;


    /*
       YOUR FORMULA:

       Net WPM =
       (Total Words Typed - Mistakes)
       / Time in Minutes
    */

    const netWpm =
        (
            wordsTyped -
            mistakes
        ) / elapsedMinutes;


    let accuracy = 100;


    if (wordsTyped > 0) {

        accuracy =
            (
                (wordsTyped - mistakes) /
                wordsTyped
            ) * 100;

    }


    /* Display results */

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


    testStarted = false;

    startTime = null;


    showScreen("resultScreen");

}


/* ==============================
   START TEST WHEN USER TYPES
============================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const input =
            document.getElementById("typingInput");


        input.addEventListener(
            "input",
            () => {

                if (!testStarted) {

                    startTimer();

                }


                updateLiveStats();

            }
        );

    }
);
