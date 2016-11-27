/**
 * Created by wyao on 2016-11-27.
 */
var association = new Map();
var state = [true, true, true, true]; //true = on, false = off
var moves = 0;
var inGame = false;

function startGame() {
    inGame = true;
    console.log("startedGame");
    for (i = 0; i < 4; i++) {
        association.set(i, associateButton(i));
    }
    document.querySelector(".game-wrapper").style.display = "block";
    document.querySelector(".start").style.display = "none";
    document.getElementById("moves-made").innerHTML = "Moves made: " + moves;
    console.log("youMayBegin");
}

//Randomly associate a button with another, makes sure it's not associated with itself
function associateButton(button) {
    var link = Math.floor(Math.random() * 4);

    if (link == button) {
        return associateButton(button);
    } else {
        return link;
    }
}

function handlePress(pressedId) {
    if (!inGame) {
        return false;
    }

    moves++;
    document.getElementById("moves-made").innerHTML = "Moves made: " + moves;
    console.log("handlingPress");
    state[pressedId] = !state[pressedId];
    handleCss(pressedId);
    state[association.get(pressedId)] = !state[association.get(pressedId)];
    handleCss(association.get(pressedId));
    console.log("checkingIfWon");
    if (checkState()) {
        finishGame();
    } else {
        console.log("notWon");
    }
}

function handleCss(id) {
    console.log("handling css of " + id);
    state[id]? document.getElementById(id).className = "on"
        : document.getElementById(id).className = "off";
}

function checkState() {
    console.log("inCheckState");
    var won = true;
    for (x = 0; x < 4; x++) {
        if (state[x] == true) {
            won = false;
        }
        console.log(state[x]);
    }
    console.log(won);
    return won;
}

function finishGame() {
    console.log("won");
    document.getElementById("moves").innerHTML = moves;
    document.querySelector(".end").style.display = "block";
    inGame = false;
}

function restartGame() {
    //Reset Button State
    var myButtons = document.querySelectorAll(".off");
    for (var i = 0; i < myButtons.length; i++) {
        myButtons[i].className = "on";
    }
    for (i = 0; i < 4; i++) {
        state[i] = true;
    }

    moves = 0;

    document.querySelector(".end").style.display = "none";

    startGame();
}
