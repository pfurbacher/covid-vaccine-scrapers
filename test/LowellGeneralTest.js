const { site } = require("../site-scrapers/LowellGeneral/config");
const utils = require("../site-scrapers/LowellGeneral/utils");
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
        slotsMap.forEach((value) => (total += value));

        expect(total).equals(expectedTotal);

        const expectedDates = [...new Set(json.availableDays)];
        const actualDates = [];
        slotsMap.forEach((_, key) => {
            const date = key.match(/\d{1,2}\/(\d{1,2})\/\d{2}/)[1];
            actualDates.push(parseInt(date));
        });
        console.log(`        ${actualDates}\n        ${expectedDates}`);
        expect(actualDates).deep.equals(expectedDates);
    });

    it("should have slots aplenty", function () {
        const json = loadTestJsonDataFromFile(
            "LowellGeneral",
            "416-slots.json"
        );
        const slotsMap = utils.getSlotsForMonth(json);

        const expectedTotal = 416;
        let total = 0;
        slotsMap.forEach((value) => (total += value));

        expect(total).equals(expectedTotal);

        const expectedDates = [...new Set(json.availableDays)];
        const actualDates = [];
        slotsMap.forEach((value, key) => {
            const date = key.split("/")[1];
            actualDates.push(parseInt(date));
        });
        console.log(`        ${actualDates}\n        ${expectedDates}`);
        expect(actualDates).deep.equals(expectedDates);
    });
});

describe("LowellGeneral :: test the month generation", function () {
    it("the getFetchMonths() should return 3 months", () => {
        const monthsAsMoments = utils.getFetchMonths(3);
        monthsAsMoments.forEach((month) =>
            console.log(`        ${month.month() + 1}/${month.year()}`)
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
