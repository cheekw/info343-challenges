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
}

//start a new game when the page loads
newGame();
