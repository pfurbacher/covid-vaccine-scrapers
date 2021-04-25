const scraper = require("../site-scrapers/Walmart/index");
const { someAvailability } = require("./Walmart/someAvailability");
const { noAvailability } = require("./Walmart/noAvailability");
const { expect } = require("chai");
const file = require("../lib/file");

describe("WalmartTest :: testing JSON response", function () {
    function* jsonGenerator() {
        yield someAvailability;
        yield noAvailability;
    }
    const jsonSource = jsonGenerator();

    const testFetchService = {
        /** Limit the number of stores, one with availability, the other without.
         * Allows inspection of either type of availability record in output.
         */
        getStores() {
            return {
                5278: {
                    street: "591 Memorial Dr",
                    city: "Chicopee",
                    zip: "01020",
                },
                5448: { street: "160 Broadway", city: "Raynham", zip: "02767" },
            };
        },
        /** Testing uses mock data, so no need to log-in but need to provide a page.  */
        async login() {
            return browser.newPage();
        },
        /**
         * Mock data, with and without availability, is provided by
         * the generator which serves up the appropriate data from files.
         */
        async fetchStoreAvailability() {
            const json = jsonSource.next().value;
            return json ? json : noAvailability;
        },
    };

    it("should show availability in one store, and none in the other", async () => {
        const results = await scraper(browser, testFetchService);

        expect(
            results.individualLocationData[0].availability["04/27/2021"]
                .numberAvailableAppointments
        ).equals(22);

        if (process.env.DEVELOPMENT) {
            file.write(
                `${process.cwd()}/out.json`,
                `${JSON.stringify(results, null, "   ")}`
            );
        }
    });
});
