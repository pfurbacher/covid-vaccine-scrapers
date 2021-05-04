/**
 * Tests only cover functions in LowellGeneral/utils.js
 * The scraper's fetches are not tested.
 */

const utils = require("../site-scrapers/LowellGeneral/utils");
const { expect } = require("chai");

// Logging message indent
const indent = "        ";

describe("LowellGeneral :: test getting slots from saved JSON response", function () {
    it("should have slots aplenty", function () {
        const json = loadTestJsonDataFromFile(
            "LowellGeneral",
            "responseWithSlots.json"
        );
        const slotsMap = utils.getSlotsForMonth(json);

        const expectedTotal = 24;
        let total = 0;
        slotsMap.forEach((value) => (total += value));

        expect(total).equals(expectedTotal);

        // "availableDays" is a list of the day numbers, one for each slot.
        // That means there are many duplicates.
        // Get a unique list of days by passing the array through a Set.
        const expectedDays = [...new Set(json.availableDays)];
        const actualDays = [];
        slotsMap.forEach((_, key) => {
            // Get the day value by splitting and taking the second item.
            const date = key.split("/")[1];
            actualDays.push(parseInt(date));
        });
        console.log(`${indent}${actualDays}\n${indent}${expectedDays}`);
        expect(actualDays).deep.equals(expectedDays);
    });

    it("should have 416 slots and day numbers should match", function () {
        const json = loadTestJsonDataFromFile(
            "LowellGeneral",
            "416-slots.json"
        );
        const slotsMap = utils.getSlotsForMonth(json);

        const expectedTotal = 416;
        let total = 0;
        slotsMap.forEach((value) => (total += value));

        expect(total).equals(expectedTotal);

        // "availableDays" is a list of the day numbers, one for each slot.
        // That means there are many duplicates.
        // Get a unique list by passing the array through a Set.
        const expectedDays = [...new Set(json.availableDays)];
        const actualDays = [];
        slotsMap.forEach((_, key) => {
            // Get the day value by splitting and taking the second item.
            const date = key.split("/")[1];
            actualDays.push(parseInt(date));
        });

        console.log(`${indent}${actualDays}\n${indent}${expectedDays}`);
        expect(actualDays).deep.equals(expectedDays);
    });
});

describe("LowellGeneral :: test the month generation", function () {
    it("the getFetchMonths() should return 3 months", () => {
        const monthsAsMoments = utils.getFetchMonths(3);
        monthsAsMoments.forEach((month) =>
            console.log(`${indent}${month.month() + 1}/${month.year()}`)
        );
        expect(monthsAsMoments.length).equals(3);
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
