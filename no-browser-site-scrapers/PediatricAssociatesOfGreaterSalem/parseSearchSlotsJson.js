/*
    Parsing functionality separated into its own file to facilitate unit testing.
*/

/**
 *
 * @param {JSON object} searchSlotsJson
 * @returns
 */
function getSlotCountFromDateAvailability(searchSlotsJson) {
    const availability =
        searchSlotsJson.data.searchSlots[0]?.practitionerAvailability[0]
            ?.availability;

    const slotCount = availability ? availability.length : 0;

    return slotCount;
}

module.exports = {
    getSlotCountFromDateAvailability,
};
