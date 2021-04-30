const entityName = "South Lawrence East School Standyby";

const site = {
    public: {
        name: "South Lawrence East School Standby",
        signUpLink: "https://lawrencegeneralcovidvaccine.as.me/schedule.php",
        street: "165 Crawford Street",
        city: "Lawrence",
        state: "MA",
        zip: "01843",
    },

    private: {
        scrapeUrl:
            "https://lawrencegeneralcovidvaccine.as.me/schedule.php?action=showCalendar&fulldate=1&owner=21579739&template=weekly",
        calendar: "5148162",
        type: "19593247",
    },
};

module.exports = {
    entityName,
    site,
};
