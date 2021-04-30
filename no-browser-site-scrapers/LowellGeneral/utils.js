const moment = require("moment");

/**
 * Creeates a clone of the initializer, so that the
 * values returned by iterating are not mutated by
 * the passed in parameter.
 *
 * Remember that momentJS month values are zero-based.
 * Add one when getting the month from the generated value
 * for things like request query parameter values.
 *
 * @param {moment.Moment} aMoment
 */
function* monthGenerator(aMoment) {
    const momentClone = aMoment.clone();
    momentClone.date(15);
    momentClone.subtract(2, "months");

    let month = momentClone.month();

    while (true) {
        yield momentClone.month(month++);
    }
}

const monthGen = monthGenerator(); // "Generator { }"

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

//fetch("https://lowellgeneralvaccine.myhealthdirect.com/DataAccess/Appointment/CalendarAppointments/32122?Month=5&Year=2021&AppointmentTypeId=0", {
/*
fetch("https://lowellgeneralvaccine.myhealthdirect.com/DataAccess/PageData/ProviderInfo/32122?Month=4&Year=2021&AppointmentTypeId=0&appointmentStartDateString=&autoAdvance=true&days=30", {
  "headers": {
    "accept": "application/json, text/plain, * / *",
    "accept-language": "en-US,en;q=0.9",
    "request-id": "|b7243db0c1634b2a97ffc6c0512d2008.1fa4518b8c0c4f17",
    "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-b7243db0c1634b2a97ffc6c0512d2008-1fa4518b8c0c4f17-01",
    "x-requested-with": "XMLHttpRequest",
    "cookie": "ASP.NET_SessionId=taioq5vrmbchw5bhiv15kdqc; ARRAffinity=6c5458dd548284d7396cd2cba264e633b6118968d745d1e82e3c3f7fc14794d7; ARRAffinitySameSite=6c5458dd548284d7396cd2cba264e633b6118968d745d1e82e3c3f7fc14794d7; ai_user=l9zNs4hVO02fxFXzJ9vSK0|2021-04-15T15:50:05.382Z; MhdSessionUrlLaunch=jU1L5ST+zA3gLhihPlLn2tFCSgWz+Lt1UNkpP6F0aI7oMk/8cpCm5/5WjSKYZgT2pf2849YKRjoQhxU5t9pSdK6lOt5fq9qZbjhyu6Ipy4fAQa/Qqnd2En1S3yXKO3l5ndn2jQ==; .ASPXAUTH=73C95724C35CB6E428A89044EDA08F208D0D291A71DFB02BD976655BB1A68B9EA33EAFC942CA791A0356DD51EEDE451AC8DB80755C02E21010217F39D59B41E3763A084975D419F46DEABA857E03ECF93D9051EACA2227CDEDBB0B426DCCCA2E5AA8C27EBF2B28A689554A021B202E5D6292782B; ai_session=XdGi+1bI/uYBLWvxH58nAL|1618608744688|1618608790446"
  },
  "referrer": "https://lowellgeneralvaccine.myhealthdirect.com/provider/info/32122-False--True",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors"
});
*/
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
    getSlotsForMonth,
    monthGenerator,
    getFetchMonths,
    getCalendarFetchUrl,
};
