"use strict";

const fs = require("fs");

const acorn = require("acorn");
const safe = require("safe-regex");
const walk = require("acorn/dist/walk");

function analyzeFile(filename) {
    const contents = fs.readFileSync(filename, "utf8");
    const options = {
        ecmaVersion: 9,
        allowHashBang: true,
        allowImportExportEverywhere: true,
        locations: true,
    };
    const result = {
        errors: [],
        safeRegex: [],
        unsafeRegex: [],
    };

    try {
        const ast = acorn.parse(contents, options);

        walk.simple(ast, {
            Literal: function(node) {
                if (node.hasOwnProperty("regex")) {
                    const regex =
                        "/" + node.regex.pattern + "/" + node.regex.flags;
                    const stats = {
                        regex: regex,
                        line: node.loc.start.line,
                        column: node.loc.start.column,
                    };

                    if (safe(regex)) {
                        result.safeRegex.push(stats);
                    } else {
                        result.unsafeRegex.push(stats);
                    }
                }
            },
        });
    } catch (err) {
        result.errors.push(err);
    }

    return result;
}

exports.analyzeFile = analyzeFile;
