"use strict";

const fs = require("fs");
const path = require("path");

function getJsFiles(args, includeNodeModules = false) {
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

                js_files = js_files.concat(getJsFiles(directory_files_path));
            }
        } else {
            throw Error(`Unknown path: ${item}`);
        }
    }

    return js_files;
}

exports.getJsFiles = getJsFiles;
