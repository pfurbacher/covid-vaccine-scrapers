const { scraperName, sites } = require("./config");
const helper = require("./zocdocBase");

module.exports = async function GetAvailableAppointments(
    browser,
    fetchService = liveFetchService()
) {
    console.log(`${scraperName} starting.`);
    const webData = await ScrapeWebsiteData(browser, fetchService);
    console.log(`${scraperName} done.`);
    return webData;
};

function liveFetchService() {
    return {
        async fetchAvailability() {
            return await helper.fetchAvailability();
        },
    };
}

async function ScrapeWebsiteData(browser, fetchService) {
    // Initialize results to no availability
    const results = [];

    const fetchedAvailability = await fetchService.fetchAvailability();
    const allAvailability = helper.parseAvailability(fetchedAvailability);

    Object.entries(allAvailability).forEach((value) => {
        results.push({
            ...sites[value[0]],
            ...value[1],
            hasAvailability: Object.keys(value[1].availability).length > 0,
        });
    });

    return results;
}
