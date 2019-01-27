#!/usr/bin/env node

"use strict";

const fs = require("fs");

const program = require("commander");

const { display_result } = require("./output");
const { getJsFiles } = require("./finder");
const { findRegexes } = require("./parser");
const { isSafe } = require("./tester");


function setConfig(program) {
    const config = {};

    config["pathes"] = program.args ? program.args : program.pathes;
    config["outputFormat"] = program.outputFormat;
    config["includeNodeModules"] = program.includeNodeModules ? true : false;
    config["includeSafeRegex"] = program.all ? true : false;
    config["engine"] = program.engine;

    return config;
}

function srp(config) {
    const files = getJsFiles(config["pathes"], config["includeNodeModules"]);
    const results = {};

    for (const filename of files) {
        results[filename] = {
            safeRegex: [],
            unsafeRegex: [],
            errors: [],
        };

        try {
            const regexList = findRegexes(filename);

            for (const regexObject of regexList) {
                if (isSafe(regexObject["regex"], config["engine"])) {
                    results[filename]["safeRegex"].push(regexObject);
                } else {
                    results[filename]["unsafeRegex"].push(regexObject);
                }
            }
        } catch (error) {
            results[filename]["errors"].push(error);
        }
    }

    if(config["outputFormat"]){
        display_result(results, config["outputFormat"], config["includeSafeRegex"]);
    }else{
        return results;
    }
}

if (require.main === module) {
    program
        .option(
            "-n, --include-node-modules",
            "include `node_modules` directory (default: false)",
        )
        .option(
            "-o, --output-format <format>",
            "output format (text|json)",
            "text",
        )
        .option(
            "-a, --all",
            "include safe and unsafe regex in the output, by default only the unsafe regex are included",
        )
        .option(
            "-e, --engine <engine-name>",
            "engine used to detect if a regex is safe or not (safe-regex|re2)",
            "safe-regex"
        )
        .option("-v, --version", "output version information")
        .parse(process.argv);

    const config = setConfig(program);

    if (program.hasOwnProperty("version")) {
        const packageFile = JSON.parse(fs.readFileSync("package.json", "utf8"));
        console.log(`Version: ${packageFile.version}`);
    } else if (program.args.length == 0) {
        program.help();
    } else {
        srp(config);
    }
}

module.exports.srp = srp;
