"use strict";

const chai = require("chai");
const expect = require("chai").expect;
const { getJsFiles } = require("../src/finder");

chai.should();

describe("Finder", function() {
    describe("#getJsFiles", function() {
        it("should return only one file when passed directly", function() {
            const entryPoints = ["test/data/fakeProject1/index.js"];

            const files = getJsFiles(entryPoints);

            files.should.have.members(["test/data/fakeProject1/index.js"]);
        });

        it("should return the directory files when a directory is passed", function() {
            const entryPoints = ["test/data/fakeProject1"];

            const files = getJsFiles(entryPoints);

            files.should.have.members([
                "test/data/fakeProject1/index.js",
                "test/data/fakeProject1/file.js",
            ]);
        });

        it("should be able to have multiple entry points has parameter", function() {
            const entryPoints = [
                "test/data/fakeProject1",
                "test/data/fakeProject2",
            ];

            const files = getJsFiles(entryPoints);

            files.should.have.members([
                "test/data/fakeProject1/index.js",
                "test/data/fakeProject1/file.js",
                "test/data/fakeProject2/index.js",
            ]);
        });

        it("should ignore non-js files", function() {
            const entryPoints = ["test/data/fakeProject3"];

            const files = getJsFiles(entryPoints);

            files.should.eql([]);
        });

        it("should raise an error is the entry does not exists", function() {
            const entryPoints = ["test/data/unknownProject"];

            expect(() => {
                getJsFiles(entryPoints);
            }).to.throw();
        });

        it("should not return the node_modules files by default", function() {
            const entryPoints = ["test/data/fakeProject4"];

            const files = getJsFiles(entryPoints);

            files.should.have.members(["test/data/fakeProject4/index.js"]);
        });

        it("should include node_modules' files when the option is activated", function() {
            const entryPoints = ["test/data/fakeProject4"];

            const files = getJsFiles(entryPoints, true);

            files.should.have.members([
                "test/data/fakeProject4/index.js",
                "test/data/fakeProject4/node_modules/module.js",
            ]);
        });

        it("should explore sub-directories", function() {
            const entryPoints = ["test/data/fakeProject5"];

            const files = getJsFiles(entryPoints);

            files.should.have.members([
                "test/data/fakeProject5/foo/bar/index.js",
            ]);
        });
    });
});
