/**
 * Created by wyao on 2016-11-27.
 */
var buttons;
var associations;
var associationArray = []; //keep an array for each button's association
var associationMap = new Map(); //maps each button to its associationArray
var state = []; //true = on, false = off
var moves = 0;
var inGame = false;

function startGame() {
    buttons = document.getElementById("num-buttons").value;
    associations = document.getElementById("num-associations").value;

    if (!ErrCheck()) {
        return false;
    }

    createButtons();
    createGame();
}

function createGame() {
    inGame = true;
    //Show game buttons, this is important when num of buttons is odd
    for (i = 0; i < buttons; i++) {
        document.getElementById(i).style.display = "block";
        state[i] = true;
    }

    //Creates an array for each button's associations, then maps the button to that array
    for (x = 0; x < buttons; x++) {
        associationArray = associateButton(x);
        associationMap.set(x, associationArray);
    }
    
    //Change scenes: hide start menu and reveal game
    document.querySelector(".game-wrapper").style.display = "block";
    document.querySelector(".start").style.display = "none";
    document.getElementById("moves-made").innerHTML = "Moves made: " + moves;
}

//Check if number of buttons and association is valid
function ErrCheck() {
    if (isNaN(buttons) || isNaN(associations) || buttons % 1 != 0 || associations % 1 != 0) {
        document.getElementById("error-message").innerHTML = "Please enter integers for the fields below!";
        return false;
    } else if (buttons <= 0 || buttons == null ) {
        document.getElementById("error-message").innerHTML = "Please enter a positive integer of buttons!";
        return false;
    } else if (buttons >= 100) {
        document.getElementById("error-message").innerHTML = "C'mon now, you weren't seriously planning to do a puzzle with more than 100 buttons!";
        return false;
    } else if (buttons <= associations) {
        document.getElementById("error-message").innerHTML = "Number of association must be smaller than number of buttons!";
        return false;
    } else {
        return true;
    }
}

function createButtons() {
    for (i = 0; i < buttons; i += 2) {
        var div = document.createElement("div");
        div.className = "play-button-wrapper";
        
        var playButton = document.createElement("button");
        playButton.className = "on";
        playButton.setAttribute("id", i);
        playButton.setAttribute("onclick", "handlePress(" + i + ")");
        div.appendChild(playButton);
        
        var playButton2 = document.createElement("button"); //unfortunately, javascript is pass-by-object so i have to create another button
        playButton2.className = "on";
        playButton2.setAttribute("id", i+1);
        playButton2.setAttribute("onclick", "handlePress(" + (i+1) + ")");
        div.appendChild(playButton2);
        
        document.getElementById("wrapper").appendChild(div);
    }
}

//Randomly associate a button with others, makes sure it's not associated with itself
function associateButton(button) {
    var tempArray = [];
    function generateAssociate() {
        var link = Math.floor(Math.random() * buttons);

        if (link == button || tempArray.includes(link)) { //makes sure associations are unique
            return generateAssociate(button);
        } else {
            return link;
        }
    }
    for (i = 0; i < associations; i++) {
        tempArray[i] = generateAssociate();
    }
    return tempArray;
}

function handlePress(pressedId) {
    if (!inGame) {
        return false;
    } else if (moves > 35) {
        impossibleGame();
    }

    moves++;
    document.getElementById("moves-made").innerHTML = "Moves made: " + moves;
    
    state[pressedId] = !state[pressedId];
    handleCss(pressedId);
    
    for (i = 0; i < associations; i++) {
        state[associationMap.get(pressedId)[i]] = !state[associationMap.get(pressedId)[i]];
        handleCss(associationMap.get(pressedId)[i]);
    }
    
    if (checkState()) {
        finishGame();
    } 
}

function handleCss(id) {
    state[id]? document.getElementById(id).className = "on"
        : document.getElementById(id).className = "off";
}

function checkState() {
    var won = true;
    for (x = 0; x < buttons; x++) {
        if (state[x] == true) {
            won = false;
        }
    }
    return won;
}

function finishGame() {
    document.getElementById("moves").innerHTML = moves;
    document.querySelector(".end").style.display = "block";
    inGame = false;
}

function impossibleGame() {
    document.getElementById("impossible-moves").innerHTML = moves;
    document.querySelector(".impossible").style.display = "block";
}

function restartGame() {
    //Reset Button State
    var myButtons = document.querySelectorAll(".off");
    for (var i = 0; i < myButtons.length; i++) {
        myButtons[i].className = "on";
    }

    //Reset States
    for (i = 0; i < buttons; i++) {
        state[i] = true;
    }

    moves = 0;

    document.querySelector(".end").style.display = "none";
    document.querySelector(".impossible").style.display = "none";

    createGame();
}

//Allows user to change number of buttons and associations
function settings() {
    document.querySelector(".game-wrapper").style.display = "none";
    document.querySelector(".start").style.display = "block";
    document.querySelector(".end").style.display = "none";
    document.querySelector(".impossible").style.display = "none";
    document.getElementById("error-message").innerHTML = "";
    
    //Destroy current buttons
    var toDelete = document.querySelectorAll(".play-button-wrapper");
    for (var i = 0; i < toDelete.length; i++) {
        toDelete[i].parentNode.removeChild(toDelete[i]);
    }
    moves = 0;
}
