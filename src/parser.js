"use strict";

const fs = require("fs");

const acorn = require("acorn");
const safe = require("safe-regex");
const walk = require("acorn/dist/walk");

function findRegexes(filename) {
    const contents = fs.readFileSync(filename, "utf8");
    const options = {
        ecmaVersion: 9,
        allowHashBang: true,
        allowImportExportEverywhere: true,
        locations: true,
    };
    const regexList = [];

    const ast = acorn.parse(contents, options);

    walk.simple(ast, {
        Literal: function(node) {
            if (node.hasOwnProperty("regex")) {
                const regex = "/" + node.regex.pattern + "/" + node.regex.flags;

                regexList.push({
                    regex: regex,
                    line: node.loc.start.line,
                    column: node.loc.start.column,
                });
            }
        },
    });

    return regexList;
}

exports.findRegexes = findRegexes;
