/**
 * util.js -- functions which don't involve fetching have been placed here
 * so that they can be tested with mock data.
 */

const moment = require("moment");

function getCalendarFetchUrl(aMoment) {
    const url = [
        "https://lowellgeneralvaccine.myhealthdirect.com/",
        "DataAccess/Appointment/CalendarAppointments/32122?",
        `Month=${aMoment.month() + 1}`,
        `&Year=${aMoment.year()}`,
        "&AppointmentTypeId=0",
    ].join("");
    return url;
}

/**
 * Generates an array of successive moment.js objects, starting with the current month
 * @param {Int} numberOfMonths
 * @returns an array of moment.js objects for the given number of months
 */
function getFetchMonths(numberOfMonths) {
    const aMoment = moment().date(15);
    const months = [aMoment.clone()];
    let count = 1;
    do {
        months.push(aMoment.clone().add(count, "month"));
        count += 1;
    } while (count < numberOfMonths);

    return months;
}

function getSlotsForMonth(monthJson) {
    const appointments = monthJson.appointments;
    const slotForMonthMap = Object.values(appointments).reduce((acc, appt) => {
        const date = moment(appt.slotDateTime).format("M/D/YYYY");
        acc.set(date, (acc.get(date) || 0) + 1);
        return acc;
    }, new Map());
    return slotForMonthMap;
}

module.exports = {
    getCalendarFetchUrl,
    getFetchMonths,
    getSlotsForMonth,
};
