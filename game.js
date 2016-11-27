/**
 * Created by wyao on 2016-11-27.
 */
var buttons;
var associations;
var associationMap = new Map();
var state = []; //true = on, false = off
var moves = 0;
var inGame = false;

function startGame() {
    console.log("startedGame");
    buttons = document.getElementById("num-buttons").value;
    associations = document.getElementById("num-associations").value;
    if (!ErrCheck()) {
        return false;
    }

    createButtons();

    console.log("loadedGame");

    inGame = true;
    for (y = 0; y < buttons; y++) {
        document.getElementById(y).style.display = "inline-block";
        state[y] = true;
    }

    for (i = 0; i < buttons; i++) {
        associationMap.set(i, associateButton(i));
    }
    document.querySelector(".game-wrapper").style.display = "block";
    document.querySelector(".start").style.display = "none";
    document.getElementById("moves-made").innerHTML = "Moves made: " + moves;
    console.log("youMayBegin");
}

//Check if number of buttons and association is valid
function ErrCheck() {
    if (buttons % 2 != 0 || buttons <= 0 || buttons == null) {
        document.getElementById("error-message").innerHTML = "Please enter a positive even number of buttons!";
        return false;
    } else {
        return true;
    }
}

function createButtons() {
    console.log("creating buttons");
    for (i = 0; i < buttons; i += 2) {
        var div = document.createElement("div");
        var playButton = document.createElement("button");
        var playButton2 = document.createElement("button");
        playButton.className = "on";
        playButton.setAttribute("id", i);
        playButton.setAttribute("onclick", "handlePress(" + i + ")");
        div.appendChild(playButton);
        playButton2.className = "on"; //unfortunately, javascript is pass by object so i have to create another button
        playButton2.setAttribute("id", i+1);
        playButton2.setAttribute("onclick", "handlePress(" + (i+1) + ")");
        div.appendChild(playButton2);
        console.log("creating buttons");
        document.getElementById("wrapper").appendChild(div);
    }
    // for (i = 0; i < buttons; i ++) {
    //     var div = document.createElement("div");
    //     var playButton = document.createElement("button");
    //     playButton.className = "on";
    //     playButton.setAttribute("id", i);
    //     playButton.setAttribute("onclick", "handlePress(" + i + ")");
    //     div.appendChild(playButton);
    //     document.getElementById("wrapper").appendChild(div);
    // }

}

//Randomly associate a button with another, makes sure it's not associated with itself
function associateButton(button) {
    var link = Math.floor(Math.random() * buttons);

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
    state[associationMap.get(pressedId)] = !state[associationMap.get(pressedId)];
    handleCss(associationMap.get(pressedId));
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
    for (x = 0; x < buttons; x++) {
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
    for (i = 0; i < buttons; i++) {
        state[i] = true;
    }

    moves = 0;

    document.querySelector(".end").style.display = "none";

    startGame();
}
