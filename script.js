/* =========================================================
   27 YEARS TOGETHER — SCRIPT.JS
   ========================================================= */


/* =========================================================
   STATO GENERALE
   ========================================================= */

const screens = [
    "cardScreen",
    "mapScreen",
    "aidScreen",
    "vespaScreen",
    "draculaScreen",
    "roomScreen",
    "familyScreen",
    "finalScreen"
];

let unlockedLevel = 1;


/* =========================================================
   UTILITY
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function showOverlay(id) {
    const element = $(id);

    if (element) {
        element.classList.remove("hidden");
    }
}

function hideOverlay(id) {
    const element = $(id);

    if (element) {
        element.classList.add("hidden");
    }
}

function showScreen(id) {

    stopRunner();
    stopCleaning();

    if (typeof panicInterval !== "undefined") {
        clearInterval(panicInterval);
    }

    screens.forEach(screenId => {

        const screen = $(screenId);

        if (screen) {
            screen.classList.remove("active");
        }

    });

    const nextScreen = $(id);

    if (nextScreen) {
        nextScreen.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
}


/* =========================================================
   BIGLIETTO
   ========================================================= */

window.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => {

        if ($("paperCard")) {
            $("paperCard").classList.add("open");
        }

    }, 1200);

});


$("journeyBtn").addEventListener("click", () => {

    showScreen("mapScreen");
    updateMap();

});


/* =========================================================
   MAPPA
   ========================================================= */

function updateMap() {

    for (let i = 1; i <= 5; i++) {

        const node = $("node" + i);

        if (!node) continue;

        if (i <= unlockedLevel) {
            node.classList.add("available");
        } else {
            node.classList.remove("available");
        }

    }

    if (unlockedLevel <= 5) {

        $("mapStatus").textContent =
            "LIVELLO " +
            String(unlockedLevel).padStart(2, "0") +
            " DISPONIBILE";

        $("mapPlay").textContent =
            "▶ GIOCA IL LIVELLO " +
            String(unlockedLevel).padStart(2, "0");

        $("mapPlay").disabled = false;

    } else {

        $("mapStatus").textContent =
            "TUTTI I LIVELLI COMPLETATI";

        $("mapPlay").textContent =
            "♥ VEDI IL FINALE";

        $("mapPlay").disabled = false;
    }
}


function openLevel(level) {

    if (level > unlockedLevel) {
        return;
    }

    switch (level) {

        case 1:
            openAid();
            break;

        case 2:
            openVespa();
            break;

        case 3:
            openDracula();
            break;

        case 4:
            openRoom();
            break;

        case 5:
            openFamily();
            break;

        default:
            showScreen("finalScreen");
    }
}


function openCurrentLevel() {

    if (unlockedLevel <= 5) {
        openLevel(unlockedLevel);
    } else {
        showScreen("finalScreen");
    }
}


$("mapPlay").addEventListener("click", openCurrentLevel);


/* I livelli già sbloccati possono essere rigiocati */

for (let i = 1; i <= 5; i++) {

    const node = $("node" + i);

    if (!node) continue;

    node.addEventListener("click", () => {

        if (i <= unlockedLevel) {
            openLevel(i);
        }

    });
}


/* pulsanti MAPPA */

document.querySelectorAll(".back-map").forEach(button => {

    button.addEventListener("click", () => {

        showScreen("mapScreen");
        updateMap();

    });

});


/* =========================================================
   LEVEL 01 — FIRST AID PANIC
   ========================================================= */

let aidStep = 1;
let selectedTool = null;
let aidActive = false;

let momPanic = 10;
let dadPanic = 12;

let panicInterval = null;
let cleanInterval = null;
let cleanValue = 0;

let aidDrag = null;


/* =========================================================
   APERTURA LEVEL 01
   ========================================================= */

function openAid() {

    showScreen("aidScreen");

    showOverlay("aidIntro");
    hideOverlay("aidComplete");

}


$("startAid").addEventListener("click", () => {

    hideOverlay("aidIntro");
    resetAid();

});


/* =========================================================
   RESET LEVEL 01
   ========================================================= */

function resetAid() {

    aidStep = 1;
    aidActive = true;

    selectedTool = null;

    momPanic = 10;
    dadPanic = 12;

    cleanValue = 0;

    $("cleanProgress").style.width = "0%";

    $("woundTarget").classList.remove("healed");
    $("woundTarget").textContent = "!";

    $("aidClean").classList.add("hidden");

    document.querySelectorAll(".aid-tool").forEach(tool => {

        tool.classList.remove(
            "selected",
            "hidden"
        );

    });

    document
        .querySelector('[data-tool="bandage"]')
        .classList.add("hidden");

    updateAidMeters();
    updateAidStage();

    clearInterval(panicInterval);

    panicInterval = setInterval(() => {

        if (!aidActive) return;

        dadPanic = Math.min(
            100,
            dadPanic + 0.45
        );

        if (aidStep === 2) {

            momPanic = Math.min(
                100,
                momPanic + 0.45
            );

        }

        updateAidMeters();

    }, 500);
}


/* =========================================================
   HUD
   ========================================================= */

function updateAidMeters() {

    $("momMeter").style.width =
        Math.max(
            0,
            Math.min(100, momPanic)
        ) + "%";

    $("dadMeter").style.width =
        Math.max(
            0,
            Math.min(100, dadPanic)
        ) + "%";

}


/* =========================================================
   STADI LEVEL 01
   ========================================================= */

function updateAidStage() {

    if (aidStep === 1) {

        $("aidTitle").textContent =
            "1. Trova il disinfettante";

        $("aidDescription").textContent =
            "Trascina la bottiglietta sulla ferita.";

        $("aidBubble").textContent =
            "AIUTO! MI SONO TAGLIATO!";

    }


    if (aidStep === 2) {

        $("aidTitle").textContent =
            "2. Disinfetta la ferita";

        $("aidDescription").textContent =
            "Tieni premuto senza impressionarti.";

        $("aidClean").classList.remove("hidden");

        $("aidBubble").textContent =
            "NON GUARDARE IL SANGUE!";

    }


    if (aidStep === 3) {

        $("aidTitle").textContent =
            "3. Applica il cerotto";

        $("aidDescription").textContent =
            "Trascina il cerotto sulla mano di papà.";

        $("aidClean").classList.add("hidden");

        document.querySelectorAll(".aid-tool").forEach(tool => {
            tool.classList.add("hidden");
        });

        document
            .querySelector('[data-tool="bandage"]')
            .classList.remove("hidden");

        $("aidBubble").textContent =
            "CI SIAMO QUASI!";

    }

}


/* =========================================================
   DRAG OGGETTI LEVEL 01
   ========================================================= */

document.querySelectorAll(".aid-tool").forEach(tool => {

    tool.addEventListener("pointerdown", event => {

        if (!aidActive || aidStep === 2) {
            return;
        }

        event.preventDefault();

        const type = tool.dataset.tool;

        selectedTool = type;

        document.querySelectorAll(".aid-tool").forEach(item => {
            item.classList.remove("selected");
        });

        tool.classList.add("selected");

        const ghost = document.createElement("div");

        ghost.className = "drag-ghost";

        ghost.textContent =
            tool.querySelector("span").textContent;

        document.body.appendChild(ghost);

        aidDrag = {
            type,
            ghost
        };

        moveAidGhost(
            event.clientX,
            event.clientY
        );

    });

});


function moveAidGhost(x, y) {

    if (!aidDrag) return;

    aidDrag.ghost.style.left =
        x + "px";

    aidDrag.ghost.style.top =
        y + "px";

}


document.addEventListener("pointermove", event => {

    if (!aidDrag) return;

    event.preventDefault();

    moveAidGhost(
        event.clientX,
        event.clientY
    );

});


document.addEventListener("pointerup", event => {

    if (!aidDrag) return;

    const target = $("woundTarget");

    const rect =
        target.getBoundingClientRect();

    const inside =
        event.clientX >= rect.left - 30 &&
        event.clientX <= rect.right + 30 &&
        event.clientY >= rect.top - 30 &&
        event.clientY <= rect.bottom + 30;

    const type = aidDrag.type;

    aidDrag.ghost.remove();
    aidDrag = null;

    if (inside) {
        useAidTool(type);
    }

});


$("woundTarget").addEventListener("click", () => {

    if (selectedTool) {
        useAidTool(selectedTool);
    }

});


function useAidTool(type) {

    if (!aidActive) return;


    if (aidStep === 1) {

        if (type === "disinfectant") {

            aidStep = 2;

            dadPanic = Math.max(
                0,
                dadPanic - 8
            );

            $("aidBubble").textContent =
                "OTTIMA SCELTA!";

            updateAidStage();

        } else {

            momPanic = Math.min(
                100,
                momPanic + 8
            );

            dadPanic = Math.min(
                100,
                dadPanic + 8
            );

            $("aidBubble").textContent =
                "FORSE NON È IL CASO!";

        }

    }


    else if (
        aidStep === 3 &&
        type === "bandage"
    ) {

        completeAid();

    }


    selectedTool = null;

    document.querySelectorAll(".aid-tool").forEach(tool => {
        tool.classList.remove("selected");
    });

    updateAidMeters();

}


/* =========================================================
   DISINFEZIONE
   ========================================================= */

function startCleaning() {

    if (
        !aidActive ||
        aidStep !== 2 ||
        cleanInterval
    ) {
        return;
    }

    cleanInterval = setInterval(() => {

        cleanValue += 4;

        momPanic = Math.min(
            100,
            momPanic + 0.7
        );

        $("cleanProgress").style.width =
            Math.min(
                100,
                cleanValue
            ) + "%";

        updateAidMeters();

        if (cleanValue >= 100) {

            stopCleaning();

            aidStep = 3;

            updateAidStage();

        }

    }, 80);

}


function stopCleaning() {

    if (cleanInterval) {

        clearInterval(cleanInterval);
        cleanInterval = null;

    }

}


$("cleanButton").addEventListener(
    "pointerdown",
    startCleaning
);

document.addEventListener(
    "pointerup",
    stopCleaning
);

document.addEventListener(
    "pointercancel",
    stopCleaning
);

$("cleanButton").addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space" ||
            event.code === "Enter"
        ) {

            event.preventDefault();
            startCleaning();

        }

    }
);

$("cleanButton").addEventListener(
    "keyup",
    stopCleaning
);


/* =========================================================
   COMPLETE LEVEL 01
   ========================================================= */

function completeAid() {

    aidActive = false;

    clearInterval(panicInterval);

    $("woundTarget").classList.add("healed");
    $("woundTarget").textContent = "✓";

    $("aidBubble").textContent =
        "MEDICAZIONE COMPLETATA!";

    setTimeout(() => {

        showOverlay("aidComplete");

    }, 700);

}


$("finishAid").addEventListener("click", () => {

    unlockedLevel = Math.max(
        unlockedLevel,
        2
    );

    showScreen("mapScreen");
    updateMap();

});


/* =========================================================
   LEVEL 02 — VESPA PANIC
   ========================================================= */

let runnerActive = false;
let runnerFrame = null;

let vespaLane = 1;
let runnerDistance = 0;
let runnerLives = 3;

let obstacles = [];
let spawnTimer = 0;
let lastFrameTime = 0;

let runnerInvulnerable = 0;

const RUNNER_TARGET = 300;
const RUNNER_SPEED = 190;


/* =========================================================
   APERTURA LEVEL 02
   ========================================================= */

function openVespa() {

    showScreen("vespaScreen");

    showOverlay("vespaIntro");

    hideOverlay("vespaGameOver");
    hideOverlay("vespaComplete");

}


$("startVespa").addEventListener("click", () => {

    hideOverlay("vespaIntro");
    startRunner();

});


/* =========================================================
   START RUNNER
   ========================================================= */

function startRunner() {

    stopRunner();

    runnerActive = true;

    vespaLane = 1;

    runnerDistance = 0;
    runnerLives = 3;

    runnerInvulnerable = 0;

    spawnTimer = 0;
    lastFrameTime = 0;

    obstacles = [];

    $("obstacleLayer").innerHTML = "";

    $("vespa").className =
        "vespa lane-1";

    $("distance").textContent =
        "0 / 300 m";

    $("lives").textContent =
        "♥ ♥ ♥";

    hideOverlay("vespaGameOver");
    hideOverlay("vespaComplete");

    $("runnerCountdown").textContent =
        "3";

    let countdown = 3;

    const countdownTimer =
        setInterval(() => {

            if (
                !$("vespaScreen")
                    .classList
                    .contains("active")
            ) {

                clearInterval(
                    countdownTimer
                );

                return;
            }

            countdown--;

            if (countdown > 0) {

                $("runnerCountdown")
                    .textContent =
                    countdown;

            } else {

                clearInterval(
                    countdownTimer
                );

                $("runnerCountdown")
                    .textContent = "";

                lastFrameTime =
                    performance.now();

                runnerFrame =
                    requestAnimationFrame(
                        updateRunner
                    );
            }

        }, 700);

}


/* =========================================================
   MOVIMENTO VESPA
   ========================================================= */

function moveVespa(direction) {

    if (!runnerActive) return;

    const newLane = Math.max(
        0,
        Math.min(
            2,
            vespaLane + direction
        )
    );

    if (newLane === vespaLane) {
        return;
    }

    vespaLane = newLane;

    const vespa = $("vespa");

    vespa.classList.remove(
        "lane-0",
        "lane-1",
        "lane-2"
    );

    vespa.classList.add(
        "lane-" + vespaLane
    );

    showMammaArm(direction);

}


function showMammaArm(direction) {

    const left = $("leftArm");
    const right = $("rightArm");

    left.classList.remove("signal");
    right.classList.remove("signal");

    const arm =
        direction < 0
            ? left
            : right;

    void arm.offsetWidth;

    arm.classList.add("signal");

    setTimeout(() => {

        arm.classList.remove("signal");

    }, 600);

}


$("moveLeft").addEventListener(
    "click",
    () => moveVespa(-1)
);

$("moveRight").addEventListener(
    "click",
    () => moveVespa(1)
);


document.addEventListener(
    "keydown",
    event => {

        if (
            !$("vespaScreen")
                .classList
                .contains("active")
        ) {
            return;
        }

        if (event.key === "ArrowLeft") {

            event.preventDefault();

            moveVespa(-1);

        }

        if (event.key === "ArrowRight") {

            event.preventDefault();

            moveVespa(1);

        }

    }
);


/* =========================================================
   OSTACOLI
   ========================================================= */

function createObstacle() {

    const lane =
        Math.floor(
            Math.random() * 3
        );

    const types = [
        "car",
        "box",
        "hole"
    ];

    const type =
        types[
            Math.floor(
                Math.random() *
                types.length
            )
        ];

    const element =
        document.createElement("div");

    element.className =
        "runner-obstacle lane-" +
        lane;

    const graphic =
        document.createElement("div");

    graphic.className =
        "obstacle-" + type;

    element.appendChild(graphic);

    $("obstacleLayer")
        .appendChild(element);

    obstacles.push({
        lane,
        y: -90,
        element,
        hit: false
    });

}


/* =========================================================
   LOOP RUNNER
   ========================================================= */

function updateRunner(timestamp) {

    if (!runnerActive) return;

    const delta = Math.min(
        (
            timestamp -
            lastFrameTime
        ) / 1000,
        0.05
    );

    lastFrameTime = timestamp;

    runnerDistance +=
        delta * 12;

    $("distance").textContent =
        Math.min(
            RUNNER_TARGET,
            Math.floor(
                runnerDistance
            )
        ) +
        " / 300 m";

    spawnTimer += delta;

    if (spawnTimer >= 1.15) {

        spawnTimer = 0;

        createObstacle();

    }

    const sceneHeight =
        $("runnerScene")
            .clientHeight;

    const vespaRect =
        $("vespa")
            .getBoundingClientRect();

    runnerInvulnerable =
        Math.max(
            0,
            runnerInvulnerable -
            delta
        );

    obstacles.forEach(
        obstacle => {

            obstacle.y +=
                RUNNER_SPEED *
                delta;

            obstacle.element
                .style.top =
                obstacle.y +
                "px";

            if (
                !obstacle.hit &&
                runnerInvulnerable <= 0 &&
                obstacle.lane ===
                    vespaLane
            ) {

                const obstacleRect =
                    obstacle.element
                        .getBoundingClientRect();

                const collision =
                    obstacleRect.bottom >
                        vespaRect.top +
                        25 &&
                    obstacleRect.top <
                        vespaRect.bottom -
                        20;

                if (collision) {

                    obstacle.hit = true;

                    hitVespa();

                }
            }

        }
    );


    obstacles =
        obstacles.filter(
            obstacle => {

                if (
                    obstacle.y >
                    sceneHeight + 100
                ) {

                    obstacle.element
                        .remove();

                    return false;
                }

                return true;

            }
        );


    if (runnerLives <= 0) {

        loseRunner();
        return;

    }


    if (
        runnerDistance >=
        RUNNER_TARGET
    ) {

        winRunner();
        return;

    }


    runnerFrame =
        requestAnimationFrame(
            updateRunner
        );

}


/* =========================================================
   COLLISIONE
   ========================================================= */

function hitVespa() {

    runnerLives--;

    runnerInvulnerable = 1.2;

    $("lives").textContent =
        runnerLives > 0
            ? "♥ ".repeat(
                runnerLives
            ).trim()
            : "—";

    $("vespa")
        .classList
        .add("hit");

    showRunnerMessage("OPS!");

    setTimeout(() => {

        $("vespa")
            .classList
            .remove("hit");

    }, 500);

}


function showRunnerMessage(text) {

    const message =
        $("runnerMessage");

    message.textContent = text;

    message.classList.remove(
        "hidden"
    );

    setTimeout(() => {

        message.classList.add(
            "hidden"
        );

    }, 700);

}


/* =========================================================
   STOP RUNNER
   ========================================================= */

function stopRunner() {

    runnerActive = false;

    if (runnerFrame !== null) {

        cancelAnimationFrame(
            runnerFrame
        );

        runnerFrame = null;

    }

}


/* =========================================================
   GAME OVER / WIN
   ========================================================= */

function loseRunner() {

    stopRunner();

    showOverlay(
        "vespaGameOver"
    );

}


$("retryVespa")
    .addEventListener(
        "click",
        startRunner
    );


function winRunner() {

    stopRunner();

    showOverlay(
        "vespaComplete"
    );

}


$("finishVespa")
    .addEventListener(
        "click",
        () => {

            unlockedLevel =
                Math.max(
                    unlockedLevel,
                    3
                );

            showScreen(
                "mapScreen"
            );

            updateMap();

        }
    );


/* =========================================================
   LEVEL 03 — DRACULA
   ========================================================= */

let draculaAnswered = false;


/*
   Cambia semplicemente questa lettera
   se vuoi cambiare la risposta corretta:

   a = castello
   b = ultimo incontro
   c = alba
*/

const correctDraculaAnswer = "b";


function openDracula() {

    showScreen(
        "draculaScreen"
    );

    resetDracula();

    showOverlay(
        "draculaIntro"
    );

    hideOverlay(
        "draculaComplete"
    );

}


$("startDracula")
    .addEventListener(
        "click",
        () => {

            hideOverlay(
                "draculaIntro"
            );

        }
    );


function resetDracula() {

    draculaAnswered = false;

    $("quizFeedback")
        .classList
        .add("hidden");

    $("quizContinue")
        .classList
        .add("hidden");

    $("quizRetry")
        .classList
        .add("hidden");

    document
        .querySelectorAll(
            ".film-card"
        )
        .forEach(card => {

            card.classList.remove(
                "correct",
                "wrong"
            );

            card.disabled = false;

        });

}


document
    .querySelectorAll(
        ".film-card"
    )
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                if (
                    draculaAnswered
                ) {
                    return;
                }

                draculaAnswered = true;

                const answer =
                    card.dataset.answer;

                const correct =
                    answer ===
                    correctDraculaAnswer;

                $("quizFeedback")
                    .classList
                    .remove("hidden");


                if (correct) {

                    card.classList
                        .add("correct");

                    $("quizResult")
                        .textContent =
                        "RISPOSTA ESATTA!";

                    $("quizExplanation")
                        .textContent =
                        "La memoria cinematografica funziona ancora!";

                    $("quizContinue")
                        .classList
                        .remove("hidden");

                } else {

                    card.classList
                        .add("wrong");

                    $("quizResult")
                        .textContent =
                        "NON PROPRIO...";

                    $("quizExplanation")
                        .textContent =
                        "Forse è il caso di riguardare il film insieme.";

                    $("quizRetry")
                        .classList
                        .remove("hidden");

                }


                document
                    .querySelectorAll(
                        ".film-card"
                    )
                    .forEach(item => {

                        item.disabled =
                            true;

                    });

            }
        );

    });


$("quizRetry")
    .addEventListener(
        "click",
        resetDracula
    );


$("quizContinue")
    .addEventListener(
        "click",
        () => {

            showOverlay(
                "draculaComplete"
            );

        }
    );


$("finishDracula")
    .addEventListener(
        "click",
        () => {

            unlockedLevel =
                Math.max(
                    unlockedLevel,
                    4
                );

            showScreen(
                "mapScreen"
            );

            updateMap();

        }
    );


/* =========================================================
   LEVEL 04 — HOME SWEET HOME
   ========================================================= */

let placedRoomObjects =
    new Set();

let roomDrag = null;


/* =========================================================
   APERTURA LEVEL 04
   ========================================================= */

function openRoom() {

    showScreen("roomScreen");

    resetRoom();

    showOverlay("roomIntro");

    hideOverlay(
        "roomComplete"
    );

}


$("startRoom")
    .addEventListener(
        "click",
        () => {

            hideOverlay(
                "roomIntro"
            );

        }
    );


/* =========================================================
   RESET ROOM
   ========================================================= */

function resetRoom() {

    placedRoomObjects.clear();

    roomDrag = null;

    $("roomCounter")
        .textContent =
        "0 / 7";

    $("roomMessage")
        .textContent =
        "RICOSTRUISCI LA STANZA";

    $("roomBoard")
        .classList
        .remove("lights-on");


    document
        .querySelectorAll(
            ".placed-room-object"
        )
        .forEach(element => {

            element.remove();

        });


    document
        .querySelectorAll(
            ".room-target"
        )
        .forEach(target => {

            target.classList.remove(
                "correct",
                "target-ready",
                "target-hover",
                "room-success"
            );

        });


    document
        .querySelectorAll(
            ".room-object"
        )
        .forEach(object => {

            object.classList.remove(
                "placed"
            );

        });

}


/* =========================================================
   START ROOM DRAG
   ========================================================= */

document
    .querySelectorAll(
        ".room-object"
    )
    .forEach(object => {

        object.addEventListener(
            "pointerdown",
            startRoomDrag
        );

    });


function startRoomDrag(event) {

    const source =
        event.currentTarget;

    if (
        source.classList
            .contains("placed")
    ) {
        return;
    }

    event.preventDefault();

    const type =
        source.dataset
            .roomObject;

    const graphic =
        source.firstElementChild
            .cloneNode(true);

    const ghost =
        document.createElement(
            "div"
        );

    ghost.className =
        "room-drag-ghost";

    ghost.appendChild(
        graphic
    );

    document.body
        .appendChild(
            ghost
        );

    roomDrag = {
        type,
        source,
        ghost
    };

    moveRoomGhost(
        event.clientX,
        event.clientY
    );

    const target =
        document.querySelector(
            '[data-target="' +
            type +
            '"]'
        );

    if (target) {

        target.classList.add(
            "target-ready"
        );

    }

}


/* =========================================================
   MOVIMENTO ROOM DRAG
   ========================================================= */

function moveRoomGhost(x, y) {

    if (!roomDrag) return;

    roomDrag.ghost.style.left =
        x + "px";

    roomDrag.ghost.style.top =
        y + "px";

}


function updateRoomTargetHover(
    x,
    y
) {

    document
        .querySelectorAll(
            ".room-target"
        )
        .forEach(target => {

            target.classList.remove(
                "target-hover"
            );

        });

    if (!roomDrag) return;

    const target =
        document.querySelector(
            '[data-target="' +
            roomDrag.type +
            '"]'
        );

    if (!target) return;

    const rect =
        target
            .getBoundingClientRect();

    const tolerance = 45;

    const inside =
        x >=
            rect.left -
            tolerance &&
        x <=
            rect.right +
            tolerance &&
        y >=
            rect.top -
            tolerance &&
        y <=
            rect.bottom +
            tolerance;

    if (inside) {

        target.classList.add(
            "target-hover"
        );

    }

}


/* =========================================================
   GLOBAL POINTERMOVE ROOM
   ========================================================= */

document.addEventListener(
    "pointermove",
    event => {

        if (!roomDrag) {
            return;
        }

        event.preventDefault();

        moveRoomGhost(
            event.clientX,
            event.clientY
        );

        updateRoomTargetHover(
            event.clientX,
            event.clientY
        );

    },
    { passive: false }
);


/* =========================================================
   DROP ROOM
   ========================================================= */

document.addEventListener(
    "pointerup",
    event => {

        if (!roomDrag) {
            return;
        }

        const drag = roomDrag;

        roomDrag = null;

        if (drag.ghost) {
            drag.ghost.remove();
        }

        const target =
            document.querySelector(
                '[data-target="' +
                drag.type +
                '"]'
            );

        document
            .querySelectorAll(
                ".room-target"
            )
            .forEach(element => {

                element.classList.remove(
                    "target-hover",
                    "target-ready"
                );

            });

        if (!target) return;

        const rect =
            target
                .getBoundingClientRect();

        const tolerance = 55;

        const inside =
            event.clientX >=
                rect.left -
                tolerance &&
            event.clientX <=
                rect.right +
                tolerance &&
            event.clientY >=
                rect.top -
                tolerance &&
            event.clientY <=
                rect.bottom +
                tolerance;

        if (inside) {

            placeRoomObject(
                drag.type,
                drag.source,
                target
            );

        } else {

            roomWrongPosition();

        }

    }
);


/* =========================================================
   ROOM WRONG
   ========================================================= */

function roomWrongPosition() {

    $("roomMessage")
        .textContent =
        "NON PROPRIO LÌ...";

    setTimeout(() => {

        if (
            placedRoomObjects
                .size < 7
        ) {

            $("roomMessage")
                .textContent =
                "RIPROVA!";

        }

    }, 650);

}


/* =========================================================
   POSIZIONAMENTO ROOM
   ========================================================= */

function placeRoomObject(
    type,
    source,
    target
) {

    if (
        placedRoomObjects
            .has(type)
    ) {
        return;
    }

    placedRoomObjects
        .add(type);

    source.classList
        .add("placed");

    target.classList
        .add("correct");


    const placed =
        document.createElement(
            "div"
        );

    placed.className =
        "placed-room-object";


    const graphic =
        source
            .firstElementChild
            .cloneNode(true);

    placed.appendChild(
        graphic
    );

    target.appendChild(
        placed
    );


    $("roomCounter")
        .textContent =
        placedRoomObjects.size +
        " / 7";

    $("roomMessage")
        .textContent =
        "PERFETTO!";


    target.classList.add(
        "room-success"
    );

    setTimeout(() => {

        target.classList.remove(
            "room-success"
        );

    }, 350);


    if (
        placedRoomObjects
            .size === 7
    ) {

        completeRoom();

    }

}


/* =========================================================
   COMPLETE ROOM
   ========================================================= */

function completeRoom() {

    $("roomMessage")
        .textContent =
        "ASPETTA...";

    setTimeout(() => {

        $("roomMessage")
            .textContent =
            "ACCENDIAMO LA LUCE...";

    }, 500);


    setTimeout(() => {

        $("roomBoard")
            .classList
            .add("lights-on");

        $("roomMessage")
            .textContent =
            "♥ CASA ♥";

    }, 1200);


    setTimeout(() => {

        showOverlay(
            "roomComplete"
        );

    }, 2500);

}


$("finishRoom")
    .addEventListener(
        "click",
        () => {

            unlockedLevel =
                Math.max(
                    unlockedLevel,
                    5
                );

            showScreen(
                "mapScreen"
            );

            updateMap();

        }
    );


/* =========================================================
   LEVEL 05 — FAMILY FOOD
   ========================================================= */

/*
   Per modificare i piatti devi cambiare
   SOLO questo array.

   target:
   "family" = Stefania, Antonio, Casper e Ludovica
   "francesca" = Francesca
*/

const foods = [

    {
        name: "SPAGHETTI ALLE VONGOLE",
        icon: "🍝",
        target: "family"
    },

    {
        name: "BARBABIETOLE",
        icon: "🍠",
        target: "francesca"
    },

    {
        name: "PIZZA",
        icon: "🍕",
        target: "family"
    },

    {
        name: "PIADINA SOSPETTA",
        icon: "🫓",
        target: "francesca"
    },

    {
        name: "PANUOZZO",
        icon: "🫔",
        target: "family"
    },

    {
        name: "SCATOLETTA DI TONNO",
        icon: "🐟",
        target: "francesca"
    },

    {
        name: "PARMIGIANA",
        icon: "🍲",
        target: "family"
    },

    {
        name: "PASTA AL RADICCHIO",
        icon: "🥣",
        target: "francesca"
    }

];


let currentFood = 0;

let foodDrag = null;

let foodGameActive = false;


/* =========================================================
   APERTURA FAMILY
   ========================================================= */

function openFamily() {

    showScreen(
        "familyScreen"
    );

    resetFamily();

    showOverlay(
        "familyIntro"
    );

    hideOverlay(
        "familyComplete"
    );

}


$("startFamily")
    .addEventListener(
        "click",
        () => {

            hideOverlay(
                "familyIntro"
            );

            foodGameActive = true;

        }
    );


/* =========================================================
   RESET FAMILY
   ========================================================= */

function resetFamily() {

    currentFood = 0;

    foodGameActive = false;

    foodDrag = null;

    document
        .querySelectorAll(
            ".food-target"
        )
        .forEach(target => {

            target.classList.remove(
                "hover",
                "correct-flash",
                "wrong-flash"
            );

        });

    loadFood();

}


/* =========================================================
   MOSTRA PIATTO
   ========================================================= */

function loadFood() {

    if (
        currentFood >=
        foods.length
    ) {

        completeFamily();
        return;
    }

    const food =
        foods[currentFood];

    $("foodIcon")
        .textContent =
        food.icon;

    $("foodName")
        .textContent =
        food.name;

    $("foodProgress")
        .textContent =
        (currentFood + 1) +
        " / " +
        foods.length;

    $("foodFeedback")
        .textContent =
        "TRASCINA IL PIATTO";

    $("foodCard")
        .classList
        .remove(
            "food-correct",
            "food-wrong"
        );

}


/* =========================================================
   FOOD DRAG
   ========================================================= */

$("foodCard")
    .addEventListener(
        "pointerdown",
        event => {

            if (
                !foodGameActive ||
                currentFood >=
                    foods.length
            ) {
                return;
            }

            event.preventDefault();

            const ghost =
                document.createElement(
                    "div"
                );

            ghost.className =
                "food-drag-ghost";

            ghost.textContent =
                foods[currentFood]
                    .icon;

            document.body
                .appendChild(
                    ghost
                );

            foodDrag = {
                ghost
            };

            moveFoodGhost(
                event.clientX,
                event.clientY
            );

        }
    );


function moveFoodGhost(x, y) {

    if (!foodDrag) return;

    foodDrag.ghost.style.left =
        x + "px";

    foodDrag.ghost.style.top =
        y + "px";

}


function getFoodTargetAt(
    x,
    y
) {

    const targets =
        document.querySelectorAll(
            ".food-target"
        );

    let found = null;

    targets.forEach(target => {

        const rect =
            target
                .getBoundingClientRect();

        if (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        ) {

            found = target;

        }

    });

    return found;

}


document.addEventListener(
    "pointermove",
    event => {

        if (!foodDrag) {
            return;
        }

        event.preventDefault();

        moveFoodGhost(
            event.clientX,
            event.clientY
        );

        document
            .querySelectorAll(
                ".food-target"
            )
            .forEach(target => {

                target.classList
                    .remove("hover");

            });

        const target =
            getFoodTargetAt(
                event.clientX,
                event.clientY
            );

        if (target) {

            target.classList
                .add("hover");

        }

    },
    { passive: false }
);


document.addEventListener(
    "pointerup",
    event => {

        if (!foodDrag) {
            return;
        }

        foodDrag.ghost.remove();
        foodDrag = null;

        document
            .querySelectorAll(
                ".food-target"
            )
            .forEach(target => {

                target.classList
                    .remove("hover");

            });

        const target =
            getFoodTargetAt(
                event.clientX,
                event.clientY
            );

        if (!target) {

            $("foodFeedback")
                .textContent =
                "IL PIATTO È ANCORA IN TAVOLA!";

            return;
        }

        checkFoodAnswer(
            target.dataset
                .foodTarget,
            target
        );

    }
);


/* =========================================================
   CONTROLLO PIATTO
   ========================================================= */

function checkFoodAnswer(
    selectedTarget,
    targetElement
) {

    const food =
        foods[currentFood];

    if (
        selectedTarget ===
        food.target
    ) {

        $("foodFeedback")
            .textContent =
            "ESATTO!";

        targetElement
            .classList
            .add(
                "correct-flash"
            );

        setTimeout(() => {

            targetElement
                .classList
                .remove(
                    "correct-flash"
                );

            currentFood++;

            loadFood();

        }, 600);

    } else {

        $("foodFeedback")
            .textContent =
            food.target ===
                "francesca"
                ? "NO NO... QUESTO TOCCA A FRANCESCA."
                : "TROPPO TRISTE PER FRANCESCA!";

        targetElement
            .classList
            .add(
                "wrong-flash"
            );

        setTimeout(() => {

            targetElement
                .classList
                .remove(
                    "wrong-flash"
                );

        }, 450);

    }

}


/* =========================================================
   COMPLETE FAMILY
   ========================================================= */

function completeFamily() {

    foodGameActive = false;

    $("foodProgress")
        .textContent =
        foods.length +
        " / " +
        foods.length;

    $("foodFeedback")
        .textContent =
        "CENA SERVITA!";

    setTimeout(() => {

        showOverlay(
            "familyComplete"
        );

    }, 700);

}


$("finishFamily")
    .addEventListener(
        "click",
        () => {

            unlockedLevel = 6;

            showScreen(
                "finalScreen"
            );

        }
    );


/* =========================================================
   PREVENZIONE DRAG NATIVO
   ========================================================= */

document.addEventListener(
    "dragstart",
    event => {

        if (
            event.target.closest(
                ".room-object, .aid-tool, #foodCard"
            )
        ) {

            event.preventDefault();

        }

    }
);


/* =========================================================
   INIZIALIZZAZIONE
   ========================================================= */

updateMap();