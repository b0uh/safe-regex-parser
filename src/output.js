"use strict";

exports.display_result = function(
    results,
    format = "text",
    includeSafeRegex = false,
) {
    if (format === "text") {
        console.log(Object.keys(results).length + " files has been parsed.\n");

        for (let filename in results) {
            if (
                results[filename].unsafeRegex.length > 0 ||
                (results[filename].safeRegex.length > 0 && includeSafeRegex) ||
                results[filename].errors.length > 0
            ) {
                console.log(filename);

                if (results[filename].unsafeRegex.length > 0) {
                    console.log("\tUnsafe regex:");
                    for (let data of results[filename].unsafeRegex) {
                        console.log(
                            "\t\t- " +
                                data.regex +
                                " (line: " +
                                data.line +
                                ", column: " +
                                data.column +
                                ")",
                        );
                    }
                }

                if (
                    results[filename].safeRegex.length > 0 &&
                    includeSafeRegex
                ) {
                    console.log("\tSafe regex:");
                    for (let data of results[filename].safeRegex) {
                        console.log(
                            "\t\t- " +
                                data.regex +
                                " (line: " +
                                data.line +
                                ", column: " +
                                data.column +
                                ")",
                        );
                    }
                }

                if (results[filename].errors.length > 0) {
                    console.log("\tErrors:");
                    for (let data of results[filename].errors) {
                        console.log("\t\t- " + data);
                    }
                }
            }
        }
    } else if (format === "json") {
        console.log(JSON.stringify(results, null, 4));
    }
};
