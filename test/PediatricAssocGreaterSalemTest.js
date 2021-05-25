const parser = require("../no-browser-site-scrapers/PediatricAssociatesOfGreaterSalem/parseSearchSlotsJson");

const { expect } = require("chai");
const { assert } = require("console");

describe("PAGS :: test parsing of the 'searchSlots' graphQL query response", () => {
    const searchSlotsJson = loadTestJsonFromFile(
        "PediatricAssocGreaterSalem",
        "slotAvailability.json"
    );
    it("the number of slots from JSON parsing should equal the string matching length of slot property 'start'", () => {
        const matches = JSON.stringify(searchSlotsJson).match(/start/g);
        const expectedSlotCount = matches ? matches.length : 0;

        const slotCount = parser.getSlotCountFromDateAvailability(
            searchSlotsJson
        );

        expect(slotCount).equals(expectedSlotCount);
    });
});

/**
 * Loads the saved SearchSlots JSON response.
 *
 * @param {String} filename The filename only, include its extension
 */
function loadTestJsonFromFile(testFolderName, filename) {
    const fs = require("fs");
    const path = `${process.cwd()}/test/${testFolderName}/${filename}`;
    return JSON.parse(fs.readFileSync(path, "utf8"));
}
