import moment from "moment"

export function createInstance() {
    return parseInt(moment(new Date()).format("MMDDYYYYHHmmss"))
}

export function sqlDate(datevalue = undefined) {
    if (datevalue) return moment(datevalue).format("YYYY-MM-DD")
    return moment(new Date()).format("YYYY-MM-DD")
}

export function sqlTimestamp(datevalue = undefined) {
    if (datevalue) return moment(datevalue).format("YYYY-MM-DD HH:mm:ss")
    return moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
}

export function shortDate(datevalue) {
    if (datevalue) return moment(datevalue).format("MM-DD-YYYY")
}

export function longDate(datevalue) {
    if (datevalue) return moment(datevalue).format("MMMM DD, YYYY")
    return moment(new Date()).format("MMMM DD, YYYY")
}

export function short12Time(datevalue) {
    if (datevalue) return moment(datevalue).format("hh:mm:ss A")
    return moment(new Date()).format("hh:mm:ss A")
}

export function shortDate24Time(datevalue) {
    if (datevalue) return moment(datevalue).format("MM-DD-YYYY HH:mm:ss")
}

export function shortDate12Time(datevalue) {
    if (datevalue) return moment(datevalue).format("MM-DD-YYYY hh:mm:ss A")
}

export function longDateTime(datevalue) {
    if (datevalue) return moment(datevalue).format("MMMM DD, YYYY hh:mm:ss A")
}