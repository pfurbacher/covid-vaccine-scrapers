/**
 * Ideas on getting site specific time slot counts. A good deal of work which
 * might not be worth it a this late date.
 * -- PF
 */

const { site } = require("./config");
const {
    getSearchAvailableDatesBody,
    getSearchSlotsBodyJson,
} = require("./queries");
const { getSlotCountFromDateAvailability } = require("./parseSearchSlotsJson");

const fetch = require("node-fetch");
const moment = require("moment");

// Set to true to see responses in the console.
const DEBUG = false;

// Total days to search in the schedule.
const DAYSTOSEARCH = 7;

module.exports = async function GetAvailableAppointments() {
    console.log("Pediatric Associates of Greater Salem starting.");
    try {
        return {
            parentLocationName:
                "Pediatric Associates of Greater Salem and Beverly",
            timestamp: moment().format(),
            individualLocationData: await DoGetAvailableAppointments(),
        };
    } finally {
        console.log("Pediatric Associates of Greater Salem and Beverly done.");
    }
};

async function DoGetAvailableAppointments() {
    const {
        name,
        bearerTokenUrl,
        schedulingTokenUrl,
        graphQLUrl,
        locations,
        ...restSalem
    } = site;

    const webData = await QuerySchedule(
        DAYSTOSEARCH,
        bearerTokenUrl,
        schedulingTokenUrl,
        graphQLUrl
    );
    // We do not have separate availability information for each site.
    // Distribute webData to all locations.
    return locations.map((location) => {
        return {
            name: `${name} (${location.city})`,
            ...location,
            ...webData,
            signUpLink: "https://bit.ly/2MyMFAJ",
        };
    });
}

async function QuerySchedule(
    days,
    bearerTokenUrl,
    schedulingTokenUrl,
    graphQLUrl
) {
    // Get a bearer token
    const bearerToken = await getToken(bearerTokenUrl);
    // Debug("bearerTokens equal? ", bearerToken == bearerToken2);

    // Get a JWT
    const schedulingToken = await getToken(schedulingTokenUrl);

    // Debug("schedulingToken", schedulingToken);

    // Issue the SearchAvailabilityDates GraphQL query
    const responseData = await searchAvailabilityDates(
        days,
        graphQLUrl,
        bearerToken,
        schedulingToken
    );
    Debug("responseData", responseData);

    const results = {
        availability: {},
        hasAvailability: false,
    };

    const dates = getDates(responseData);

    // TODO: needs actual data to test.
    for (const date of dates) {
        const dateAvailability = await fetchDateAvailability(
            bearerToken,
            schedulingToken,
            date
        );
        if (dateAvailability.error) {
            console.error(
                `PAGS :: slotSearch failed: ${dateAvailability.error}. Reporting "hasAvailability" only.`
            );
            results.hasAvailability = true;
        } else {
            const slots = getSlotCountFromDateAvailability(dateAvailability);
            results.availability[reformatDate(date)] = {
                numberAvailableAppointments: slots,
                hasAvailability: true,
            };
        }
    }

    return results;
}

/**
 *
 * @param {JSON} responseData
 * @returns Array of dates ('YYYY-MM-DD'). Empty array ([]) if none. Guaranteed not null.
 */
function getDates(responseData) {
    const searchAvailabilityDates = responseData?.data?.searchAvailabilityDates;

    const dates = searchAvailabilityDates
        ? searchAvailabilityDates
              .filter((d) => d.availability)
              .map((d) => d.date)
        : [];
    return dates;
}

function Debug(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

async function getToken(url) {
    const response = await fetch(url)
        .then((res) => res.json())
        .then((json) => {
            return json;
        })
        .catch((error) => console.error(`error fetching token: ${error}`));

    return response.token;
}

async function searchAvailabilityDates(
    days,
    url,
    bearerToken,
    schedulingToken
) {
    const postBody = getSearchAvailableDatesBody(days);

    const response = await fetch(url, {
        method: "post",
        body: postBody,
        headers: {
            authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
            // "Content-Length": postBody.length,
            "x-scheduling-jwt": schedulingToken,
        },
    })
        .then((res) => res.json())
        .then((json) => {
            return json;
        })
        .catch((error) =>
            console.error(`error fetching availabity dates: ${error}`)
        );

    return response;
}

async function fetchDateAvailability(bearerToken, schedulingToken, dateStr) {
    const searchSlotsBodyJson = getSearchSlotsBodyJson(dateStr);

    // console.log(JSON.stringify(availableDatesJson));
    // const test = JSON.parse(availableDatesJson);

    const response = await fetch(
        "https://framework-backend.scheduling.athena.io/v1/graphql",
        {
            headers: {
                authorization: `Bearer ${bearerToken}`,
                "Content-Type": "application/json",
                "context-id": "2804",
                "request-context":
                    "appId=cid-v1:be15676c-faee-42aa-ba50-dd49aed067e1",
                "x-scheduling-jwt": schedulingToken,
            },
            body: searchSlotsBodyJson,
            method: "POST",
        }
    )
        .then((res) => res.json())
        .then((json) => {
            return json;
        })
        .catch((error) =>
            console.error(`error fetching slot counts data: ${error}`)
        );

    return response;
}

function reformatDate(dateStr) {
    return moment(`${dateStr}T00:00:00`).format("M/D/YYYY");
}
