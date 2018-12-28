"use strict";

const fs = require("fs");
const path = require("path");

const acorn = require("acorn");
const walk = require("acorn/dist/walk");
const safe = require("safe-regex");
const program = require("commander");

const { display_result } = require("./output");

const config = {};

function get_js_files(args, includeNodeModules = false) {
    let js_files = [];

    for (const item of args) {
        if (fs.existsSync(item)) {
            const stats = fs.lstatSync(item);

            if (stats.isFile()) {
                const file = item;
                const file_ext = file.split(".").pop();

                if (file_ext === "js") {
                    js_files.push(file);
                }
            } else if (stats.isDirectory()) {
                const directory = item;

                let directory_files = fs.readdirSync(directory);
                if (!includeNodeModules) {
                    directory_files = directory_files.filter(
                        (filename) => !filename.includes("node_modules"),
                    );
                }
                const directory_files_path = directory_files.map((el) =>
                    path.join(directory, el),
                );

                js_files = js_files.concat(get_js_files(directory_files_path));
            }
        }
    }

    return js_files;
}

function analyze_file(filename) {
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

function setConfig(program) {
    config["args"] = program.args;
    config["outputFormat"] = program.outputFormat;
    config["includeNodeModules"] = program.includeNodeModules ? true : false;
    config["includeSafeRegex"] = program.all ? true : false;
}

function main(program) {
    const files = get_js_files(config["args"], config["includeNodeModules"]);

    const results = {};

    for (const filename of files) {
        const file_result = analyze_file(filename);
        results[filename] = file_result;
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

/*
TODO
    Use a file to configure acorn options
        (sane default)

*/
