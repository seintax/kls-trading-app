import moment from "moment"

export function createInstance() {
    return parseInt(moment(new Date()).format("MMDDYYYYHHmmss"))
}

export const timeDurationInHours = (beg, end) => {
    var diff = (end - beg) / 1000
    diff /= (60 * 60)
    return Math.abs(Math.round(diff))
}

export function dateFormat(datevalue = undefined, format = "YYYY-MM-DD") {
    if (datevalue === "0000-00-00 00:00:00") return moment(new Date()).format(format)
    if (datevalue) return moment(datevalue).format(format)
    return moment(new Date()).format(format)
}

export function dateRangedFormat(datevalue, action = "add", range = 7, format = "YYYY-MM-DD") {
    if (datevalue === "0000-00-00 00:00:00") return ""
    if (datevalue) {
        if (action.toLowerCase() === "add") return moment(datevalue).add(range, 'days').format(format)
        if (action.toLowerCase() === "subtract") return moment(datevalue).subtract(range, 'days').format(format)
        return ""
    }
}

export function sqlDate(datevalue = undefined) {
    if (datevalue === "0000-00-00 00:00:00") return ""
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

export function shortDate12TimePst(datevalue) {
    if (datevalue) return moment(datevalue).add(8, 'hours').format("MM-DD-YYYY hh:mm A")
}

export function longDateTime(datevalue) {
    if (datevalue) return moment(datevalue).format("MMMM DD, YYYY hh:mm:ss A")
}

export function firstDayOfWeekByDate(datevalue, format = "YYYY-MM-DD") {
    let index = moment(datevalue).day()
    return moment(datevalue).subtract(index, 'days').format(format)
}

export function lastDayOfWeekByDate(datevalue, format = "") {
    let index = 6 - moment(datevalue).day()
    return moment(datevalue).add(index, 'days').format(format)
}

export const momentPST = (value, format = "YYYY-MM-DD HH:mm:ss") => {
    // production timezone adjustment is based on the 
    // default timezone of hostinger.com
    const timeZone = import.meta.env.MODE === "development" ? 900 : 420
    return moment(value).utcOffset(timeZone).format(format)
}

export const momentPSTShort12 = (value, format = "hh:mm:ss A") => {
    // production timezone adjustment is based on the 
    // default timezone of hostinger.com
    const timeZone = import.meta.env.MODE === "development" ? 900 : 420
    return moment(value).utcOffset(timeZone).format(format)
}

export const momentOffset = (value, offset, format = "YYYY-MM-DD HH:mm:ss") => {
    // production timezone adjustment is based on the 
    // default timezone of hostinger.com
    const timeZone = import.meta.env.MODE === "development" ? 900 : 420
    return moment(value).utcOffset(offset).format(format)
}