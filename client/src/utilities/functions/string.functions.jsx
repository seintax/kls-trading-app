const ENC_VAL = import.meta.env.VITE_ENC_VAL
const ENC_KEY = import.meta.env.VITE_ENC_KEY

export const isEmpty = (value) => {
    return value === undefined || value === "" || value === null || value === 0
}

const formatWithZeros = (str, maxcount) => {
    if (str) {
        let maxlen = Number(maxcount) - str?.toString().length
        return `${Array(maxlen + 1).join("0")}${str}`
    }
    return str
}

const formatWithChar = (str, char, maxcount) => {
    if (str) {
        let maxlen = Number(maxcount) - str?.toString().length
        if (maxlen > 0)
            return `${Array(maxlen).join(char)}${str}`
        else
            return str
    }
    return str
}

const properCase = (str) => {
    if (str) return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
    return str
}

const appendString = (str, separator = ",") => {
    if (isEmpty(str)) return str
    return `${this}${separator}${str}`
}

const Utils = {
    isEmpty,
    formatWithZeros,
    formatWithChar,
    properCase,
    appendString
}

export const StrFn = Utils

export const encryptToken = (token) => {
    var t = token
    var r = 5
    var a = t.split("")
    for (var x = 0; x < r; x++) {
        var v = ENC_VAL.split("")
        var e = ENC_KEY.split("")
        var n = a.length

        for (var i = 0; i < n; i++) {
            if (e[v.indexOf(a[i])] >= 0) {
                a[i] = e[v.indexOf(a[i])]
            }
        }
        t = a.join("")
    }
    return t
}