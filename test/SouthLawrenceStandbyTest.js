const scraper = require("../no-browser-site-scrapers/SouthLawrence");

const { expect } = require("chai");
const moment = require("moment");
const file = require("../lib/file");

/** Generator to feed filenames sequentially to the "with availability" test. */
function* filenames() {
    yield "samplePage1.html";
    yield "samplePage2.html";
    yield "samplePage3.html";
    yield "samplePage4.html";
}

describe("South Lawrence Standby availability test using scraper and saved HTML", function () {
    const filenameGenerator = filenames();

    const testFetchService = {
        async fetchAvailability(/*site*/) {
            return loadTestHtmlFromFile(
                "SouthLawrenceStandby",
                filenameGenerator.next().value
            );
        },
    };
    const beforeTime = moment();

    it("should provide availability for one site, and the results objects structure should conform", async function () {
        const results = await scraper(false, testFetchService);

        const expected = [true];
        const hasAvailability = Object.values(
            results.individualLocationData
        ).map((result) => result.hasAvailability);
        const afterTime = moment();

        expect(hasAvailability).is.deep.equal(expected);

        const expectedSlotCounts = [7];
        const slotCounts = Object.values(results.individualLocationData).map(
            (result) =>
                Object.values(result.availability)
                    .map((value) => value.numberAvailableAppointments)
                    .reduce(function (total, number) {
                        return total + number;
                    }, 0)
        );

        expect(expectedSlotCounts).is.deep.equal(slotCounts);
        /*
        Structure conformance expectations:

        - All the timestamps are expected to be between before
            and after when the scraper was executed
        - Each site's results object must have a property named "hasAvailability"
         */
        results.individualLocationData.forEach((result) => {
            expect(moment(result.timestamp).isBetween(beforeTime, afterTime));
            expect(result.hasAvailability).is.not.undefined;
        });

        if (process.env.DEVELOPMENT) {
            file.write(
                `${process.cwd()}/out_no_browser.json`,
                `${JSON.stringify(results, null, "   ")}`
            );
        }
    });
});

/* utilities */

/**
 * Loads the saved HTML of the website.
 *
 * @param {String} filename The filename only, include its extension
 */
function loadTestHtmlFromFile(testFolderName, filename) {
    const fs = require("fs");
    const path = `${process.cwd()}/test/${testFolderName}/${filename}`;
    return fs.readFileSync(path, "utf8");
}
