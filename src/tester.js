"use strict";

const safe = require("safe-regex");

function isSafe(regex) {
    return safe(regex);
}

exports.isSafe = isSafe;
