const { site } = require("./config");
const fetch = require("node-fetch");
const htmlParser = require("node-html-parser");
const moment = require("moment");

// debug
/**
 * enum used for determining whether to continue advancing through the calendar
 */
const STATUS = {
    FINISHED: 0,
    CONTINUE: 1,
};

module.exports = async function GetAvailableAppointments(
    _ignored,
    fetchService = liveFetchService()
) {
    console.log(`${site.public.name} starting.`);

    const results = {
        parentLocationName: site.public.name,
        timestamp: moment().format(),
        individualLocationData: [await ScrapeWebsiteData(site, fetchService)],
    };

    console.log(`${site.public.name} done.`);
    return results;
};

/**
 * Dependency injection: in live scraping, the fetchAvailability() in this module is used.
 * In testing, a mock fetchAvailability() is injected.
 */
function liveFetchService() {
    return {
        async fetchAvailability(site, pageVisitCount) {
            return await fetchAvailability(site, pageVisitCount);
        },
    };
}

async function ScrapeWebsiteData(site, fetchService) {
    const results = {
        availability: {},
        hasAvailability: false,
    };

    let monthAvailabilityMap = new Map();
    let pageVisitCount = 0;

    // Advance the calendar of each site until no availability is found.
    do {
        const calendarHtml = await fetchService.fetchAvailability(
            site,
            pageVisitCount
        );

        const root = htmlParser.parse(calendarHtml);

        if (hasNoAvailabilityMessage(root)) {
            status = STATUS.FINISHED;
        } else {
            monthAvailabilityMap = getDailyAvailabilityCountsInCalendar(
                root,
                pageVisitCount
            );

            // Add all day objects to results.availability
            monthAvailabilityMap.forEach((value, key) => {
                let availabilityEntry = results.availability[key];

                const currentValue = availabilityEntry
                    ? results.availability[key].numberAvailableAppointments
                    : 0;

                results.availability[key] = {
                    numberAvailableAppointments: currentValue + value,
                    hasAvailability: !!value,
                };
            });
            pageVisitCount += 1;

            status = hasMorePages(root) ? STATUS.CONTINUE : STATUS.FINISHED;
        }
    } while (status == STATUS.CONTINUE);

    // console.log(`pageVisitCount: ${pageVisitCount}`);

    return {
        ...site.public,
        ...results,
        hasAvailability: Object.keys(results.availability).length > 0,
        timestamp: moment().format(),
    };
}

async function fetchAvailability(site, pageVisitCount) {
    const bodyString = bodyParamString(pageVisitCount);

    const response = await fetch(site.private.fetchRequestUrl, {
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: bodyString,
        method: "POST",
    })
        .then((res) => res.text())
        .then((html) => {
            return html;
        })
        .catch((error) => console.log(`error fetching availability: ${error}`));

    return response;
}

/**
 * Gets the bodyParam string for the fetch. Initially, it has no startDate, or nextprev, but
 * does when stepping the calendar forward in time.
 * @param {Int} pageVisitCount (specific to location)
 * @returns
 */
function bodyParamString(pageVisitCount) {
    /*
    Body when first hitting site (i.e., pageVisitCount == 0):
    "type=&calendar=&skip=true&options%5Bqty%5D=1&options%5BnumDays%5D=3&ignoreAppointment=&appointmentType=&calendarID="

    Body when pressing "More Times" button (i.e., pageVisitCount > 0):
    "type=&calendar=&month=&skip=true&options%5Boffset%5D=15&options%5BnumDays%5D=5&ignoreAppointment=&appointmentType=&calendarID="
    */

    const paramsList =
        pageVisitCount == 0
            ? [
                  "type=",
                  "calendar=",
                  "skip=true",
                  "options%5Bqty%5D=1",
                  "options%5BnumDays%5D=3",
                  "ignoreAppointment=",
                  "appointmentType=",
                  "calendarID=",
              ]
            : [
                  "type=",
                  "calendar=",
                  "month=",
                  "skip=true",
                  `options%5Boffset%5D=${15 * pageVisitCount}`,
                  "options%5BnumDays%5D=5",
                  "ignoreAppointment=",
                  "appointmentType=",
                  "calendarID=",
              ];

    return paramsList.join("&");
}

/**
 * Gets the availability in a calendar.
 * @param {HTMLElement} root
 * @returns
 */
function getDailyAvailabilityCountsInCalendar(root, pageVisitCount) {
    function reformatDate(dateStr) {
        return moment(`${dateStr}`).format("M/D/YYYY");
    }

    let dailySlotCountsMap; // keyed by date, value accumulates slot counts per date.

    try {
        const containers = root
            .querySelectorAll("td.class-signup-container")
            .filter(
                (container) =>
                    !container.getAttribute("class").includes("hidden-xs")
            );

        const filteredContainers = containers.filter((container) =>
            container.querySelector(".btn-class-signup")
        );

        dailySlotCountsMap = filteredContainers
            .map((container) => {
                const date = container
                    .querySelector(".btn-class-signup")
                    .getAttribute("data-time");
                const count = parseInt(
                    container.querySelector("div.class-spots span.babel-ignore")
                        .innerText
                );
                return [reformatDate(date), count];
            })
            .reduce((acc, [date, count]) => {
                acc.set(date, (acc.get(date) || 0) + count);
                return acc;
            }, new Map());
    } catch (error) {
        console.error(`error trying to get day numbers: ${error}`);
    }

    return dailySlotCountsMap ? dailySlotCountsMap : new Map();
}

/**
 * If there's no availability, Acuity indicates it in a number of ways. Check
 * for them.
 * @param {HTMLElement} root
 * @returns true if one of the Acuity no availability indicators is found
 */
function hasNoAvailabilityMessage(root) {
    const noTimesAvailable = root.querySelector("#no-times-available-message");
    const alertDanger = root.querySelector(
        ".alert.alert-danger:not([.hidden])"
    );

    return noTimesAvailable || alertDanger;
}

/**
 *
 * @param {HTMLElement} root
 * @returns false if there is no
 */
function hasMorePages(root) {
    const isMoreTimesButtonPresent = root.querySelector(".calendar-next");
    return isMoreTimesButtonPresent;
}