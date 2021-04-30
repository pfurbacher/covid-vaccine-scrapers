const { site, fetchOptions } = require("./config");
const utils = require("./utils");

const fetch = require("node-fetch");
const htmlParser = require("node-html-parser");
const moment = require("moment");

let service = null;
module.exports = async function GetAvailableAppointments(
    _ignored,
    fetchService = liveFetchService()
) {
    console.log(`${site.name} starting.`);

    service = fetchService;

    const websiteData = await ScrapeWebsiteData(site, fetchService);

    const results = {
        parentLocationName: `${site.name}`,
        timestamp: moment().format(),
        individualLocationData: [websiteData],
    };

    console.log(`${site.name} done.`);

    return results;
};

/**
 * Dependency injection: in live scraping, the fetchAvailability() in this module is used.
 * In testing, a mock fetchAvailability() is injected.
 */
function liveFetchService() {
    return {
        async fetchCalendarPage(aMoment) {
            return await fetchCalendarPage(aMoment);
        },
    };
}

async function ScrapeWebsiteData(site, fetchService) {
    const availabilityContainer = await getData();

    const results = {
        ...site,
        ...availabilityContainer,
        hasAvailability: Object.keys(availabilityContainer).length > 0,
    };
    return results;
}

async function getData() {
    const availabilityContainer = {
        availability: {},
        hasAvailability: false,
    };
    // const fakeData = require("../../test/LowellGeneral/responseWithSlots.json");
    // const data = null;
    /* */
    const fetchMonths = utils.getFetchMonths(3);

    fetchMonths.map(async (aMonth) => {
        const calendarPageJson = await fetchCalendarPage(aMonth);

        const monthAvailabilityMap = utils.getSlotsForMonth(calendarPageJson);

        // Add all day objects to results.availability
        monthAvailabilityMap.forEach((value, key) => {
            availabilityContainer.availability[key] = {
                numberAvailableAppointments: value,
                hasAvailability: !!value,
            };
        });
    });

    return availabilityContainer;
}

async function fetchCalendarPage(aMoment) {
    const response = await fetch(
        utils.getCalendarFetchUrl(aMoment) /*,
        fetchOptions*/
    )
        .then((res) => res.text)
        .then((html) => {
            return html;
        })
        .catch((error) =>
            console.log(
                `${site.name} :: error fetching sign up links on front page: ${error}`
            )
        );

    return response;
}
