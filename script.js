const passages = [

    "The development of technology has changed the way people communicate, learn and work. Modern students have access to information from many different sources. Regular practice, careful reading and effective time management can help students improve their performance.",

    "Education plays an important role in the development of an individual and society. A good education develops knowledge, skills, confidence and responsible citizenship. Students should develop the habit of learning regularly and applying their knowledge in practical situations.",

    "India is a diverse country with a rich cultural heritage. Different regions have their own languages, traditions, festivals and food habits. Despite this diversity, the people of India share a common identity and work together for the progress of the nation.",

    "Regular typing practice can improve speed and accuracy. Students should focus on correct finger placement, proper posture and consistent practice. Speed should increase naturally as accuracy and familiarity with the keyboard improve."

];


let currentPassage = "";

let testDuration = 1;

let timeRemaining = 0;

let timerInterval = null;

let testStarted = false;

let startTime = null;


/* SCREEN MANAGEMENT */

function showScreen(id) {

    document.querySelectorAll(".screen").forEach(screen => {

        screen.classList.remove("active");

    });

    document.getElementById(id).classList.add("active");
}


function goHome() {

    clearInterval(timerInterval);

    testStarted = false;

    showScreen("homeScreen");

}


/* OPEN SCREEN TEST */

function openScreenTest() {

    showScreen("setupScreen");

}


/* PAPER TEST */

function openPaperTest() {

    showScreen("paperScreen");

}


/* START TEST */

function startTest(minutes) {

    testDuration = minutes;

    timeRemaining = minutes * 60;

    testStarted = false;

    startTime = null;

    clearInterval(timerInterval);


    currentPassage =
        passages[Math.floor(Math.random() * passages.length)];


    document.getElementById("passage").textContent =
        currentPassage;


    document.getElementById("typingInput").value = "";

    document.getElementById("timer").textContent =
        formatTime(timeRemaining);

    document.getElementById("liveWpm").textContent = "0";

    document.getElementById("liveMistakes").textContent = "0";

    document.getElementById("liveAccuracy").textContent = "100%";


    showScreen("testScreen");


    document.getElementById("typingInput").focus();

}


/* TIMER */

function startTimer() {

    if (testStarted) return;

    testStarted = true;

    startTime = Date.now();


    timerInterval = setInterval(() => {

        timeRemaining--;

        document.getElementById("timer").textContent =
            formatTime(timeRemaining);


        updateLiveStats();


        if (timeRemaining <= 0) {

            finishTest();

        }

    }, 1000);

}


/* FORMAT TIME */

function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    );

}


/* WORD COUNT */

function getWords(text) {

    return text
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0);

}


/* MISTAKE COUNT */

function calculateMistakes(typedText) {

    const typedWords = getWords(typedText);

    const originalWords = getWords(currentPassage);

    let mistakes = 0;


    typedWords.forEach((word, index) => {

        if (word !== originalWords[index]) {

            mistakes++;

        }

    });


    return mistakes;

}


/* UPDATE LIVE STATS */

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
        (testDuration * 60) - timeRemaining;


    const elapsedMinutes =
        elapsedSeconds / 60;


    let wpm = 0;


    if (elapsedMinutes > 0) {

        wpm =
            wordsTyped / elapsedMinutes;

    }


    let accuracy = 100;


    if (wordsTyped > 0) {

        accuracy =
            ((wordsTyped - mistakes) / wordsTyped) * 100;

    }


    document.getElementById("liveWpm").textContent =
        Math.max(0, Math.round(wpm));


    document.getElementById("liveMistakes").textContent =
        mistakes;


    document.getElementById("liveAccuracy").textContent =
        Math.max(0, accuracy).toFixed(1) + "%";

}


/* FINISH TEST */

function finishTest() {

    clearInterval(timerInterval);


    const typedText =
        document.getElementById("typingInput").value;


    const typedWords =
        getWords(typedText);


    const wordsTyped =
        typedWords.length;


    const mistakes =
        calculateMistakes(typedText);


    const elapsedSeconds =
        (testDuration * 60) - timeRemaining;


    const elapsedMinutes =
        elapsedSeconds / 60;


    let netWpm = 0;


    if (elapsedMinutes > 0) {

        netWpm =
            (wordsTyped - mistakes) /
            elapsedMinutes;

    }


    let accuracy = 100;


    if (wordsTyped > 0) {

        accuracy =
            ((wordsTyped - mistakes) /
            wordsTyped) * 100;

    }


    document.getElementById("finalWpm").textContent =
        Math.max(0, netWpm).toFixed(1);


    document.getElementById("finalWords").textContent =
        wordsTyped;


    document.getElementById("finalMistakes").textContent =
        mistakes;


    document.getElementById("finalAccuracy").textContent =
        Math.max(0, accuracy).toFixed(1) + "%";


    document.getElementById("finalTime").textContent =
        formatTime(elapsedSeconds);


    showScreen("resultScreen");

}


/* START TIMER WHEN USER TYPES */

document.addEventListener("DOMContentLoaded", () => {

    const input =
        document.getElementById("typingInput");


    input.addEventListener("input", () => {

        if (!testStarted) {

            startTimer();

        }

        updateLiveStats();

    });

});
