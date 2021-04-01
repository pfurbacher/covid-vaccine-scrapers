const assert = require("assert");
const nock = require("nock");
const mock = require("mock-require");
const chai = require("chai");
const expect = chai.expect;

describe("GetAvailabilities", () => {
    it("should return availabilities when there are availabilities", async () => {
        const {
            buildTimeSlotsUrl,
            parseAvailability,
            groupAppointmentsByDate,
        } = require("../site-scrapers/LowellGeneral/functions.js");

        const apiResponse = `HealthPost.server_response_for_update({"html_container_id":"healthpost_appointments18","doctor_id":23431,"practice_location_id":14110,"profile":{"name":"COVID-19 Vaccination Station 16","image_url":"https://healthpost.com/images/anonymous-user-gravatar.png","message_about_scheduling":"People in Massachusetts’ current eligible groups can now get the COVID-19 vaccine at our clinic. Appointments and ID are required. Vaccine supply is limited."},"time_slots_div":"\u003cdiv class=\"time-slots-div\"\u003e\u003cdiv class=\"availability_locations\"\u003eLowell General Hospital - MVP - Mass Vaccine Program\u003cbr/\u003e \u003cspan class=\"location-address\"\u003eCross River Center - East 1001 Pawtucket Blvd  Lowell, MA 01854\u003c/span\u003e\u003ca href=\"tel:000-000-0000\" class=\"location-phone\"\u003e000-000-0000\u003c/a\u003e\u003cbr/\u003e \u003cp id=\"location_description\"\u003ePlease Do Not Call to make Appointment Updates. Use Cancel and or reschedule my appointment link below\u003c/p\u003e\u003c/div\u003e\u003cdiv class=\"scheduling-message\"\u003e\u003cstrong\u003eNOTE: \u003c/strong\u003ePeople in Massachusetts’ current eligible groups can now get the COVID-19 vaccine at our clinic. Appointments and ID are required. Vaccine supply is limited.\u003c/div\u003e\u003c/div\u003e\u003ca onclick=\"HealthPost.navigation_button_clicked(this); return false;\" class=\"current_link hide\" style=\"display: none;\" rel=\"nofollow\" href=\"https://lowell-general-hospital---covid---19-vaccination.healthpost.com/doctors/23431-covid-19-vaccination-station-16/time_slots?appointment_action=new\u0026amp;embed=1\u0026amp;hp_medium=widget_provider\u0026amp;hp_source=lowell-general-hospital---covid---19-vaccination\u0026amp;html_container_id=healthpost_appointments18\u0026amp;practice_location_id=14110\u0026amp;start_at=2021-02-19+00%3A00%3A00\"\u003ecurrent\u003c/a\u003e\u003cdiv class=\"time-slots-nav\"\u003e\u003cdiv class=\"slot_designation_legend\"\u003e\u003clabel title=\"slots with the green background are only for new patients (i.e. patient has not seen that provider within the last three years.). Slots with no designation means any patient (new or existing) can book there.\"\u003e\u003cspan class=\"new\"\u003e\u0026nbsp;\u003c/span\u003eNew patients\u003c/label\u003e\u003clabel title=\"slots with the blue background are only for existing patients (i.e. patient has seen that provider within the last three years.). Slots with no designation means any patient (new or existing) can book there.\"\u003e\u003cspan class=\"existing\"\u003e\u0026nbsp;\u003c/span\u003eEstablished patients\u003c/label\u003e\u003clabel class=\"caption\"\u003e(Timeslots with no colored bar at top can be booked by any patient type; new or established)\u003c/label\u003e\u003c/div\u003e\u003cdiv class=\"time_slots_navigation\"\u003e\u003ca onclick=\"return false;\" class=\"dummy_link\" disabled=\"disabled\" rel=\"nofollow\" href=\"javascript:;\"\u003ePrev 45 days\u003c/a\u003e\u003cdiv class=\"hp-date-picker\"\u003e\u003cbutton type=\"button\" class=\"datepicker\" name=\"selected_date\" title=\"Use the arrow keys to pick a date\" /\u003e\u003c/div\u003e\u003ca onclick=\"HealthPost.navigation_button_clicked(this); return false;\" class=\"next_link\" title=\"Appointments for next 45 days\" rel=\"nofollow\" href=\"https://lowell-general-hospital---covid---19-vaccination.healthpost.com/doctors/23431-covid-19-vaccination-station-16/time_slots?appointment_action=new\u0026amp;embed=1\u0026amp;end_at=2021-05-20+00%3A00%3A00\u0026amp;hp_medium=widget_provider\u0026amp;hp_source=lowell-general-hospital---covid---19-vaccination\u0026amp;html_container_id=healthpost_appointments18\u0026amp;practice_location_id=14110\u0026amp;start_at=2021-04-05+00%3A00%3A00\"\u003eNext 45 days\u003c/a\u003e\u003c/div\u003e\u003c/div\u003e\u003cdiv class='time-slot-table-container'\u003e\u003ctable\u003e\u003ccaption class='screen-reader-text'\u003eAvailable Time Slots for COVID-19 Vaccination Station 16 at Cross River Center - East \u003cbr /\u003e 1001 Pawtucket Blvd  Lowell, MA 01854\u003c/caption\u003e\u003ctr\u003e\u003cth class=\"even\"\u003eFri \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eFeb 19\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eSat \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eFeb 20\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eSun \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eFeb 21\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eMon \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eFeb 22\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eTue \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eFeb 23\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eWed \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eFeb 24\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eThu \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eFeb 25\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eFri \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eFeb 26\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eSat \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eFeb 27\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eSun \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eFeb 28\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eMon \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar  1\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eTue \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar  2\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eWed \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar  3\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eThu \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar  4\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eFri \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar  5\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eSat \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar  6\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eSun \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar  7\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eMon \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar  8\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eTue \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar  9\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eWed \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 10\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eThu \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 11\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eFri \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 12\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eSat \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 13\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eSun \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 14\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eMon \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 15\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eTue \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 16\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eWed \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 17\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eThu \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 18\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eFri \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 19\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eSat \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 20\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eSun \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 21\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eMon \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 22\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eTue \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 23\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eWed \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 24\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eThu \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 25\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eFri \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 26\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eSat \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 27\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eSun \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 28\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eMon \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 29\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eTue \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 30\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eWed \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eMar 31\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eThu \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eApr  1\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eFri \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eApr  2\u003c/span\u003e \u003c/th\u003e\u003cth class=\"odd\"\u003eSat \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eApr  3\u003c/span\u003e \u003c/th\u003e\u003cth class=\"even\"\u003eSun \u003cbr /\u003e \u003cspan class=\"day-date\"\u003eApr  4\u003c/span\u003e \u003c/th\u003e\u003c/tr\u003e\u003ctr\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003cli class=\"tippy slot any\"\u003e\u003ca target=\"_blank\" data-ignore=\"push\" title=\"click to make appointment at 10:10 am\" rel=\"nofollow\" style=\"white-space:nowrap;\" href=\"https://healthpost.com/appointments/new?hp_clientId=hp_2761663651.4090231793\u0026amp;hp_medium=widget_provider\u0026amp;hp_source=lowell-general-hospital---covid---19-vaccination\u0026amp;id=230707565\"\u003e10:10 am\u003c/a\u003e\u003cdiv class=\"slot_tooltip_content\" id=\"slot_tooltip_content_230707565\" style=\"display: none\"\u003e\u003cstrong\u003eANY\u003c/strong\u003e patient can book for one of the following: \u003cul class=\"list_of_reason_for_visits\"\u003e\u003cli\u003eFirst Dose Covid-19 Vaccine\u003c/li\u003e\n\u003cli\u003eSecond Dose Covid-19 Moderna Vaccine\u003c/li\u003e\n\u003cli\u003eSecond Dose Covid-19 Pfizer Vaccine\u003c/li\u003e\u003c/ul\u003e\u003c/div\u003e\u003c/li\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"odd slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003ctd class=\"even slots\"\u003e\n\u003cul\u003e\u003c/ul\u003e\u003c/td\u003e\n\u003c/tr\u003e\n\u003c/table\u003e\u003c/div\u003e\u003cdiv class=\"time-slots-nav-bottom\"\u003e\u003cdiv class=\"slot_designation_legend\"\u003e\u003clabel title=\"slots with the green background are only for new patients (i.e. patient has not seen that provider within the last three years.). Slots with no designation means any patient (new or existing) can book there.\"\u003e\u003cspan class=\"new\"\u003e\u0026nbsp;\u003c/span\u003eNew patients\u003c/label\u003e\u003clabel title=\"slots with the blue background are only for existing patients (i.e. patient has seen that provider within the last three years.). Slots with no designation means any patient (new or existing) can book there.\"\u003e\u003cspan class=\"existing\"\u003e\u0026nbsp;\u003c/span\u003eEstablished patients\u003c/label\u003e\u003clabel class=\"caption\"\u003e(Timeslots with no colored bar at top can be booked by any patient type; new or established)\u003c/label\u003e\u003c/div\u003e\u003cdiv class=\"time_slots_navigation\"\u003e\u003ca onclick=\"return false;\" class=\"dummy_link\" disabled=\"disabled\" rel=\"nofollow\" href=\"javascript:;\"\u003ePrev 45 days\u003c/a\u003e\u003cdiv class=\"hp-date-picker\"\u003e\u003cbutton type=\"button\" class=\"datepicker\" name=\"selected_date\" title=\"Use the arrow keys to pick a date\" /\u003e\u003c/div\u003e\u003ca onclick=\"HealthPost.navigation_button_clicked(this); return false;\" class=\"next_link\" title=\"Appointments for next 45 days\" rel=\"nofollow\" href=\"https://lowell-general-hospital---covid---19-vaccination.healthpost.com/doctors/23431-covid-19-vaccination-station-16/time_slots?appointment_action=new\u0026amp;embed=1\u0026amp;end_at=2021-05-20+00%3A00%3A00\u0026amp;hp_medium=widget_provider\u0026amp;hp_source=lowell-general-hospital---covid---19-vaccination\u0026amp;html_container_id=healthpost_appointments18\u0026amp;practice_location_id=14110\u0026amp;start_at=2021-04-05+00%3A00%3A00\"\u003eNext 45 days\u003c/a\u003e\u003c/div\u003e\u003c/div\u003e"});`;

        const resultingAvailability = {
            hasAvailability: true,
            availability: {
                "03/21/2022": {
                    hasAvailability: true,
                    numberAvailableAppointments: 2,
                },
            },
        };

        const stationIds = [
            "healthpost_appointments10_time_slots_for_doctor_23425_14110",
            "healthpost_appointments10_time_slots_for_doctor_23425_14110",
        ];

        // run the test and assert that the result contains availability:
        let hasAvailability = false;
        let availability = {};
        for (const i in stationIds) {
            const url = buildTimeSlotsUrl(stationIds[i]);
            expect(url).to.match(/45/);
            const parsedData = parseAvailability(apiResponse);
            if (!hasAvailability) {
                hasAvailability = parsedData.hasAvailability;
            }
            availability = groupAppointmentsByDate(
                availability,
                parsedData.availability
            );
        }

        const result = { hasAvailability, availability };
        return expect(result).to.deep.include(resultingAvailability);
    });
});
