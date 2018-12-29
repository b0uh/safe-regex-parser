"use strict";

const fs = require("fs");

const program = require("commander");

const { display_result } = require("./output");
const { getJsFiles } = require("./finder");
const { analyzeFile } = require("./parser");
const { isSafe } = require("./tester");

const config = {};

function setConfig(program) {
    config["args"] = program.args;
    config["outputFormat"] = program.outputFormat;
    config["includeNodeModules"] = program.includeNodeModules ? true : false;
    config["includeSafeRegex"] = program.all ? true : false;
}

function main(program) {
    const files = getJsFiles(config["args"], config["includeNodeModules"]);

    const results = {};

    for (const filename of files) {
        results[filename] = {
            safeRegex: [],
            unsafeRegex: [],
            errors: [],
        };

        try {
            const regexList = analyzeFile(filename);

            for (const regexObject of regexList) {
                if (isSafe(regexObject["regex"])) {
                    results[filename]["safeRegex"].push(regexObject);
                } else {
                    results[filename]["unsafeRegex"].push(regexObject);
                }
            }
        } catch (error) {
            results[filename]["errors"].push(error);
        }
    }

    display_result(results, config["outputFormat"], config["includeSafeRegex"]);
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
        .option("-v, --version", "output version information")
        .parse(process.argv);

    setConfig(program);

    if (program.hasOwnProperty("version")) {
        const packageFile = JSON.parse(fs.readFileSync("package.json", "utf8"));
        console.log(`Version: ${packageFile.version}`);
    } else if (program.args.length == 0) {
        program.help();
    } else {
        main(program);
    }
}
