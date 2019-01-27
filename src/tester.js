"use strict";

const safe = require("safe-regex");
const RE2 = require("re2");

function isSafeSafeRegex(regex) {
    return safe(regex);
}

function isSafeRe2(regex) {
    try {
        new RE2(regex);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Eval a regex. Return `true` if the regex is safe, `false` is the regex is
 * not safe.
 */

function isSafe(regex, testerEngine = "safe-regex") {
    console.log(testerEngine);
    console.log(testerEngine);
    switch (testerEngine) {
        case "safe-regex":
            return isSafeSafeRegex(regex);
            break;
        case "re2":
            return isSafeRe2(regex);
            break;
        default:
            console.log(`Error: unknown tester engine. (${testerEngine})`);
    }
}

exports.isSafe = isSafe;
