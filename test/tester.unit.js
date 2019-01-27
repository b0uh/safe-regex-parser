"use strict";

const chai = require("chai");
const { isSafe } = require("../src/tester");

chai.should();

describe("Tester", function() {
    let testerEngine;

    describe("#isSafeSafeRegex", function() {
        beforeEach(function() {
            testerEngine = "safe-regex";
        });

        it("should return false for unsafe regex", function() {
            const result = isSafe("(a+)+", testerEngine);

            result.should.eql(false);
        });

        it("should return true for safe regex", function() {
            const result = isSafe("foo", testerEngine);

            result.should.eql(true);
        });
    });

    describe("#isSafeRe2", function() {
        beforeEach(function() {
            testerEngine = "re2";
        });

        it("should return false for unsafe regex", function() {
            const result = isSafe("(foo)\\1", testerEngine);

            result.should.eql(false);
        });

        it("should return true for safe regex", function() {
            const result = isSafe("foo", testerEngine);

            result.should.eql(true);
        });
    });
});
