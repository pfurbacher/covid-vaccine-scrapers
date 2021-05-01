const { site } = require("./config");
const utils = require("./utils");

const fetch = require("node-fetch");
const htmlParser = require("node-html-parser");
const moment = require("moment");
const { dropWhile } = require("lodash");

let service = null;
module.exports = async function GetAvailableAppointments(
    browser,
    fetchService = liveFetchService()
) {
    console.log(`${site.public.name} starting.`);

    service = fetchService;

    const websiteData = await ScrapeWebsiteData(browser, site, fetchService);

    const results = {
        parentLocationName: `${site.public.name}`,
        timestamp: moment().format(),
        individualLocationData: [websiteData],
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
        async fetchCalendarJson(aMoment) {
            return await fetchCalendarJson(aMoment);
        },
    };
}

async function ScrapeWebsiteData(browser, site, fetchService) {
    const page = await browser.newPage();
    const questionnaireResults = await answerQuestions(page, site);

    const availabilityContainer = await getData(page);

    const results = {
        ...site.public,
        ...availabilityContainer,
        hasAvailability: Object.keys(availabilityContainer).length > 0,
    };
    return results;
}

async function answerQuestions(page, site) {
    /* */
    await page.goto(site.private.startUrl);
    await page.waitForSelector("button#next-btn");
    await page.waitForTimeout(900);
    // Select "Dose 1"
    await page.evaluate(() => {
        const x = document.querySelector(".ap-question.inputfield ");
        x.value = "14d46b30-fa7a-455b-bc2e-2f481beca122";
    });
    await page.waitForTimeout(700);
    // Check the "Yes" for "I hereby attest under penalty of...."
    await page.evaluate(() => {
        document.querySelector(
            "input[value='c708da0f-05c7-4f18-9e3f-61bb0cf0a94a']"
        ).checked = true;
    });
    await page.waitForTimeout(800);

    // Press "Next" button
    await page.click("#next-btn");
    await page.waitForNavigation();

    await page.evaluate(() => {
        const dropDowns = document.querySelectorAll(".ap-question.inputfield");
        // Patient’s Relationship to Guarantor: Self
        dropDowns[0].value = "ff8f0703-56b4-452c-9c0f-81c702412cab";
        // Insurance type: medicare
        dropDowns[1].value = "c34b0d40-e319-491d-9bab-b6c36d8b3dca";
        // Subscriber I.D:  n/a
        dropDowns[2].value = "n/a";
        //  Member I.D:  n/a
        dropDowns[3].value = "n/a";
    });
    await page.waitForTimeout(800);

    // Do you have secondary insurance?
    await page.evaluate(() => {
        document.querySelectorAll("input[type=radio]")[1].checked = true;
    });
    await page.waitForTimeout(500);

    await page.evaluate(() => {
        document.querySelector("#next-btn").click();
    });
    await page.waitForNavigation();
    /* */
}

async function getData(page) {
    const availabilityContainer = {
        availability: {},
        hasAvailability: false,
    };
    // const fakeData = require("../../test/LowellGeneral/responseWithSlots.json");
    // const data = null;
    /* */
    const fetchMonths = utils.getFetchMonths(3);

    for (const month of fetchMonths) {
        const calendarPageJson = await fetchCalendarJson(page, month);

        const monthAvailabilityMap = utils.getSlotsForMonth(calendarPageJson);

        // Add all day objects to results.availability
        monthAvailabilityMap.forEach((value, key) => {
            availabilityContainer.availability[key] = {
                numberAvailableAppointments: value,
                hasAvailability: !!value,
            };
        });
    }

    return availabilityContainer;
}

async function fetchCalendarJson(page, aMoment) {
    const response = await page.evaluate(() => {
        fetch(utils.getCalendarFetchUrl(aMoment))
            .then((res) => res.json())
            .then((json) => {
                return json;
            })
            .catch((error) =>
                console.log(
                    `${site.public.name} :: error fetching sign up links on front page: ${error}`
                )
            );
    });

    return response;
}
