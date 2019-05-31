"use strict";

/**
 * Shuffles an array in-place.
 * Source: https://bost.ocks.org/mike/shuffle/
 * @param {[]} array 
 * @returns {[]} the shuffled input array
 */
function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

/**
 * Returns a shallow copy of the object by
 * copying all of its properties to a new object.
 * @param {Object} obj - an object to copy
 * @returns {Object} a shallow clone of the object
 */
function cloneObject(obj) {
    return Object.assign({}, obj);
}

function newGame() {
    //TODO: add code to implement the game
    let matches = 0;
    let missed = 0;
    let remaining = 8;
    let seconds = 0;
    let minutes = 0;
    let clicks = 0;
    let time = minutes + " m " + seconds + " s ";
    updateStats(matches, missed, remaining);
    document.getElementById("time").textContent = time;    
    let timer = setInterval(() => {
        if (clicks > 0) {        
            seconds++;
            time = minutes + " m " + seconds + " s";  
            document.getElementById("time").textContent = time;  
        }
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
    }, 1000);
    let tiles = document.getElementById("tiles");
    let gameTiles = shuffle(TILES).slice(0, 8);
    
    gameTiles = shuffle(gameTiles.concat(gameTiles));
    let tilesClicked = [];
    for (let i = 0; i < gameTiles.length; i++) {
        let tileButton = document.createElement("button");
        let tileImage = tileButton.appendChild(document.createElement("img"));
        tileButton.id = i;
        tileButton.setAttribute("aria-label", "tile " + i);
        flip(TILEBACK, TILEBACKALT, tileImage);
        tiles.appendChild(tileButton);

        // adds a click event for each button
        tileButton.addEventListener("click", () => {
            flip(gameTiles[i].url, gameTiles[i].alt, tileImage);
            tilesClicked.push(i);
            tileButton.disabled = true;
            let audio = new Audio("http://www.freesfx.co.uk/rx2/mp3s/6/18295_1464621831.mp3") ;           
            clicks++;

            // ends the turn after a tile pair has been chosen
            if (tilesClicked.length === 2) {
                if (gameTiles[tilesClicked[0]] === gameTiles[tilesClicked[1]]) {
                    matches++;
                    remaining--;
                    audio = new Audio("http://www.freesfx.co.uk/rx2/mp3s/6/18277_1464617403.mp3");
                } else {
                    missed++;
                    let previousTile = document.getElementById(tilesClicked[0]);
                    setTimeout(() => {
                        flip(TILEBACK, TILEBACKALT, previousTile.firstChild);
                        flip(TILEBACK, TILEBACKALT, tileImage);
                        previousTile.disabled = false;
                        tileButton.disabled = false;
                       }, 500);
                }
                tilesClicked = [];
                updateStats(matches, missed, remaining);
            }

            // checks if the user beat the game
            if (remaining === 0) {
                clearInterval(timer);                
                setTimeout(() => { 
                    alert("Congratulations you beat the game in " + time + "!");
                    if (window.confirm("Do you want to start a new game?") === true) {
                        location.reload();
                    }
                }, 500);
            }
            audio.play();
        });
    }
}

function updateStats(matches, missed, remaining) {
    document.getElementById("matches").textContent = matches;
    document.getElementById("missedMatches").textContent = missed;
    document.getElementById("remaining").textContent = remaining;
}

function flip(imageSrc, imageAlt, tileImage) {
    tileImage.src = imageSrc;
    tileImage.alt = imageAlt;
}
//start a new game when the page loads
newGame();
