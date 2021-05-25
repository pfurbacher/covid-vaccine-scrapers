const moment = require("moment");

const DAYS_TO_SEARCH = 7;

const searchAvailabilityDatesQuery = `query SearchAvailabilityDates($locationIds: [String!], $practitionerIds: [String!], $specialty: String, $serviceTypeTokens: [String!]!, $startAfter: String!, $startBefore: String!, $visitType: VisitType) {
    searchAvailabilityDates(locationIds: $locationIds, practitionerIds: $practitionerIds, specialty: $specialty, serviceTypeTokens: $serviceTypeTokens, startAfter: $startAfter, startBefore: $startBefore, visitType: $visitType) {
        date
        availability
        __typename
    }}`;

const searchSlotsQuery = `query SearchSlots($locationIds: [String!], $practitionerIds: [String!], $specialty: String, $serviceTypeTokens: [String!]!, $startAfter: String!, $startBefore: String!, $visitType: VisitType) {\\n  searchSlots(locationIds: $locationIds, practitionerIds: $practitionerIds, specialty: $specialty, serviceTypeTokens: $serviceTypeTokens, startAfter: $startAfter, startBefore: $startBefore, visitType: $visitType) {\\n    location {\\n      reference\\n      resource {\\n        ... on Location {\\n          id\\n          name\\n          address {\\n            line\\n            city\\n            state\\n            postalCode\\n            __typename\\n          }\\n          telecom {\\n            system\\n            value\\n            __typename\\n          }\\n          timezone\\n          managingOrganization {\\n            reference\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    practitionerAvailability {\\n      isTelehealth\\n      practitioner {\\n        reference\\n        resource {\\n          ... on Practitioner {\\n            id\\n            name {\\n              text\\n              __typename\\n            }\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      availability {\\n        id\\n        start\\n        end\\n        status\\n        serviceType {\\n          text\\n          coding {\\n            code\\n            system\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}`;

function getSearchAvailableDatesBody(numberOfDaysInSearch) {
    return JSON.stringify({
        operationName: "SearchAvailabilityDates",
        variables: {
            locationIds: ["2804-102"],
            practitionerIds: ["2804-51"],
            specialty: "Unknown Provider",
            serviceTypeTokens: [
                // TODO: Not sure what this GUID signifies. It doesn't seem to vary.
                "codesystem.scheduling.athena.io/servicetype.canonical|49b8e757-0345-4923-9889-a3b57f05aed2",
            ],
            startAfter: getStartDate(),
            startBefore: getEndDate(numberOfDaysInSearch),
        },
        query: searchAvailabilityDatesQuery,
    });
}

/**
 *
 * @param {String} dateStr with format 'YYYY-MM-DD'
 * @returns
 */
function getSearchSlotsBodyJson(dateStr) {
    // "startAfter":"2021-05-22T00:00:00-04:00",
    // "startBefore":"2021-05-22T23:59:59-04:00"

    // const dateStr = date.format("YYYY-MM-DD");

    const startAfterStr = `${dateStr}T00:00:00-04:00`;
    const startBeforeStr = `${dateStr}T23:59:59-04:00`;

    const body = {
        operationName: "SearchSlots",
        variables: {
            locationIds: ["2804-102"],
            practitionerIds: [],
            serviceTypeTokens: [
                "codesystem.scheduling.athena.io/servicetype.canonical|49b8e757-0345-4923-9889-a3b57f05aed2",
            ],
            specialty: "Unknown Provider",
            startAfter: startAfterStr,
            startBefore: startBeforeStr,
            query: searchSlotsQuery,
        },
    };
    return body;
}

function getStartDate() {
    return moment().startOf("day").format();
}

function getEndDate(numberOfDaysInSearch) {
    return moment()
        .add(numberOfDaysInSearch - 1, "days")
        .endOf("day")
        .format();
}

module.exports = {
    getSearchAvailableDatesBody,
    getSearchSlotsBodyJson,
};
