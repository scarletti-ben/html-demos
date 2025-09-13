/**
 * Wrapper for interacting with `https://members-api.parliament.uk/api`
 * 
 * @module parliament-api-wrapper
 * @author Ben Scarletti
 * @since 2025-09-11
 * @see {@link https://github.com/scarletti-ben}
 * @license MIT
 */

// < ======================================================
// < Imports
// < ======================================================

import * as tools from "./site-tools.js";

// < ======================================================
// < Declarations: Types
// < ======================================================

/**
 * @typedef {Object} Party
 * @property {number} id
 * @property {string} name
 * @property {string} abbreviation
 * @property {string} backgroundColour
 * @property {string} foregroundColour
 * @property {boolean} isLordsMainParty
 * @property {boolean} isLordsSpiritualParty
 * @property {number|null} governmentType
 * @property {boolean} isIndependentParty
 */

/**
 * @typedef {Object} MembershipStatus
 * @property {boolean} statusIsActive
 * @property {string} statusDescription
 * @property {string|null} statusNotes
 * @property {number} statusId
 * @property {number} status
 * @property {string} statusStartDate
 */

/**
 * @typedef {Object} HouseMembership
 * @property {string} membershipFrom
 * @property {number} membershipFromId
 * @property {number} house
 * @property {string} membershipStartDate
 * @property {string|null} membershipEndDate
 * @property {string|null} membershipEndReason
 * @property {string|null} membershipEndReasonNotes
 * @property {number|null} membershipEndReasonId
 * @property {MembershipStatus} membershipStatus
 */

/**
 * @typedef {Object} Link
 * @property {string} rel
 * @property {string} href
 * @property {string} method
 */

/**
 * @typedef {Object} Member
 * @property {number} id
 * @property {string} nameListAs
 * @property {string} nameDisplayAs
 * @property {string} nameFullTitle
 * @property {string|null} nameAddressAs
 * @property {Party} latestParty
 * @property {string} gender
 * @property {HouseMembership} latestHouseMembership
 * @property {string} thumbnailUrl
 */

/**
 * @typedef {Object} MemberItem
 * @property {Member} value
 * @property {Link[]} links
 */

/**
 * @typedef {"London"|"Yorkshire and The Humber"|"South West"|"West Midlands"|
 * "East Midlands"|"East of England"|"North West"|"South East"|"North East"|
 * "Scotland"|"Wales"|"Northern Ireland"} Region
 */

// < ======================================================
// < Declarations: Internal
// < ======================================================

let _initialised = false;
let _regionLookup;
let _memberArray;

// < ======================================================
// < Declarations: General
// < ======================================================

const paths = {
    memberArray: `./assets/json/member-array.json`,
    regionLookup: `./assets/json/region-lookup.json`,
}

// < ======================================================
// < Functions
// < ======================================================

/**
 * Load array of member items
 * 
 * @returns {Promise<MemberItem[]>} Promise of the array of `MemberItem` objects
 */
async function loadMemberArray() {
    return await tools.fetchJSON(paths.memberArray);
}

/**
 * Load the region lookup 
 * 
 * @returns {Promise<Record<string, string>>} Promise of the region lookup
 */
async function loadRegionLookup() {
    return await tools.fetchJSON(paths.regionLookup);
}

/**
 * Load array of raw `Member` objects
 * 
 * @returns {Promise<Member[]>} Promise of the array of `Member` objects
 */
async function loadMembersRaw() {
    const memberItems = await loadMemberArray();
    return memberItems.map(item => item.value);
}

/**
 * 
 * @param {string} constituency
 * @returns {Region}
 */
function getRegion(constituency) {
    for (const [region, constituencies] of Object.entries(_regionLookup)) {
        if (constituencies.includes(constituency)) {
            return region;
        }
    }
    console.warn(`Did not find a region for ${constituency}`);
}

/**
 * Clean version of a `Member` object
 */
class CleanMember {

    /** @type {Region} */
    region;

    /**
     * Create a `CleanMember` instance
     * 
     * @param {Member} member - The raw `Member` object to clean
     */
    constructor(member) {
        if (!_initialised) {
            throw new Error('parliament-api-wrapper needs to be initialised');
        }
        this.id = member.id;
        this.fullname = member.nameDisplayAs;
        this.surname = member.nameListAs.split(',')[0];
        this.party = member.latestParty.name;
        this.colour = `#` + member.latestParty.backgroundColour;
        this.thumbnail = member.thumbnailUrl;
        this.constituency = member.latestHouseMembership.membershipFrom;
        this.region = getRegion(this.constituency);
        this.page = `https://members.parliament.uk/member/${this.id}`;
    }

    /** 
     * View the web page for this member on `members.parliament.uk`
     */
    viewPage() {
        tools.viewLink(`https://members.parliament.uk/member/${this.id}`);
    }

    /**
     * Get a formatted string representation of the `CleanMember` instance
     * 
     * @returns {string} Formatted string representation of the `CleanMember` instance
     */
    toString() {
        return `Name: ${this.fullname}\nParty: ${this.party}\nConstituency: ${this.constituency}\nID: ${this.id}\nRegion: ${this.region}`;
    }

}

/**
 * Load array of `CleanMember` objects
 * 
 * @returns {Promise<CleanMember[]>} Promise of the array of `CleanMember` objects
 */
async function loadMembersClean() {
    const memberItems = await loadMemberArray();
    return memberItems.map(item => new CleanMember(item.value));
}

async function init() {
    _regionLookup = await loadRegionLookup();
    _memberArray = await loadMemberArray();
    _initialised = true;
    const regions = []
    for (const region of Object.keys(_regionLookup)) {
        regions.push(region)
    }
    console.log(regions)
    const members = _memberArray.map(item => new CleanMember(item.value));
    return members;
}

// > ======================================================
// > Exports
// > ======================================================

export {
    init,
    CleanMember
}