const { scraperName, sites } = require("./config");
const helper = require("./zocdocBase");
const { sendSlackMsg } = require("../../lib/slack");
const s3 = require("../../lib/s3");
const fetch = require("node-fetch");
const moment = require("moment");

module.exports = async function GetAvailableAppointments(
    _ignored,
    fetchService = liveFetchService()
) {
    console.log(`${scraperName} starting.`);
    const webData = await ScrapeWebsiteData(fetchService);
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

async function ScrapeWebsiteData(fetchService) {
    // Initialize results to no availability
    const results = [];

    const fetchedAvailability = await fetchService.fetchAvailability();
    const allAvailability = helper.parseAvailability(fetchedAvailability);

    Object.entries(allAvailability).forEach((value) => {
        const site = sites[value[0]];
        const hasAvailability = Object.keys(value[1].availability).length > 0;

        results.push({
            ...site,
            ...value[1],
            hasAvailability: hasAvailability,
            timestamp: moment().format(),
        });

        /*
            We need to discover the URL for at least the Holtzman edu staff signup if it has availabilities.
            It's not clear from the Holtzman Medical Group website whether it will be different from the campus
            registration page.
        */
        if (site.name.includes("Educational") /* && hasAvailability */) {
            console.log(site.name);
            saveWebpage();
        }
    });

    return results;
}

async function saveWebpage() {
    const response = await fetch(
        "https://www.zocdoc.com/vaccine/search/MA?flavor=state-search"
    );
    const body = await response.text();
    s3.saveHTMLContent("ZocDoc mass-Holtzman-edu-availability", body);
    sendSlackMsg(
        "bot",
        "Holtzman educational site has availability. Grab signup URL from web page."
    );
}
