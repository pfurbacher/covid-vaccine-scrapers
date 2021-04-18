const { site } = require("../no-browser-site-scrapers/LowellGeneral/config");
const utils = require("../no-browser-site-scrapers/LowellGeneral/utils");
const moment = require("moment");
const { expect } = require("chai");

describe("LowellGeneral :: test getting slots from JSON response", function () {
    it("should have slots aplenty", function () {
        const json = loadTestJsonDataFromFile(
            "LowellGeneral",
            "responseWithSlots.json"
        );
        const slotsMap = utils.getSlotsForMonth(json);

        const expectedTotal = 5 + 7 + 12;
        let total = 0;
        slotsMap.forEach((value, key) => (total += value));

        expect(total).equals(expectedTotal);
    });
});

describe("LowellGeneral :: test the month generator", function () {
    it("should give a succession of months starting with the current one", function () {
        const momentNow = moment();
        const monthGen = utils.monthGenerator(momentNow);
        const months = [1, 2, 3].map((n) => monthGen.next().value.month() + 1);
        console.log(`months: ${months}`);
        const thisMonth = momentNow.month(); // months are zero based; text months are 1-based
        const expectedMonths = [thisMonth + 1, thisMonth + 2, thisMonth + 3];
        expect(months).deep.equals(expectedMonths);
    });
});

/**
 * Loads the saved HTML or JSON
 *
 * @param {String} filename The filename only, include its extension
 */
function loadTestJsonDataFromFile(testFolderName, filename) {
    const fs = require("fs");
    const path = `${process.cwd()}/test/${testFolderName}/${filename}`;
    return JSON.parse(fs.readFileSync(path, "utf8"));
}
