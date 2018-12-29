"use strict";

const chai = require("chai");
const expect = require("chai").expect;
const { findRegexes } = require("../src/parser");

chai.should();

describe("Parser", function() {
    describe("#findRegexes", function() {
        it("should find regex", function() {
            const filename = "test/data/parser/file1.js";

            const regexList = findRegexes(filename);

            regexList[0].should.eql({ regex: "/bar/", column: 12, line: 1 });
        });

        it("should find regex with flags", function() {
            const filename = "test/data/parser/file2.js";

            const regexList = findRegexes(filename);

            regexList[0].should.eql({ regex: "/bar/g", column: 12, line: 1 });
        });

        it("should throws when it failed to parse the file", function() {
            const filename = "test/data/parser/file3.js";

            expect(() => {
                findRegexes(filename);
            }).to.throw();
        });
        it("should throws if the file does not exists", function() {
            const filename = "/path/to/some/imaginary/file";

            expect(() => {
                findRegexes(filename);
            }).to.throw();
        });
    });
});
