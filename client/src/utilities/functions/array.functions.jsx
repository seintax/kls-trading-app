export function SelectObjectsWithEmptyLabel(stringArray, emptyLabel) {
    return [{ value: "", key: emptyLabel }, ...stringArray]
}

export function SelectOptionsWithEmptyLabel(stringArray, emptyLabel) {
    let options = stringArray.map(opt => {
        return { value: opt, key: opt }
    })
    return [{ value: "", key: emptyLabel }, ...options]
}

export function FormatOptionsWithNewOption(dataArray, newOptions) {
    let options = newOptions?.map(arr => {
        return { value: arr.value, key: arr.key, data: arr?.data || {} }
    })
    return [...dataArray, ...options]
}

export function FormatOptionsWithEmptyLabel(dataArray, valueProp, nameProp, firstOption, firstValue = "", firstData = {}) {
    let options = dataArray?.map(arr => {
        return { value: arr[valueProp], key: arr[nameProp], data: arr }
    })
    return [{ value: firstValue, key: firstOption, data: firstData }, ...options]
}

export function FormatOptionsNoLabel(dataArray, valueProp, nameProp) {
    let options = dataArray?.map(arr => {
        return { value: arr[valueProp], key: arr[nameProp], data: arr }
    })
    return options
}

export const provideValueFromLibrary = (arrayData, valueSought) => {
    if (valueSought && arrayData.length) {
        let array = arrayData?.filter(arr => arr.value === valueSought)
        let value = array?.length ? array[0] : undefined
        return value
    }
    return undefined
}

export const getFirstElementFromArray = (arr) => {
    return arr?.length ? arr[0] : undefined
}

export function AttribDestruct(dataArray) {
    return dataArray?.map(arr => {
        if ("attributes" in arr) {
            return {
                ...arr,
                ...arr.attributes
            }
        }
        return arr
    })
}

export const getOneObject = (arr) => {
    if (arr.length === 1) return arr[0]
    return undefined
}

export const sortBy = (function () {
    var toString = Object.prototype.toString,
        parse = function (value) { return value },
        getItem = function (value) {
            var isObject = value != null && typeof value === "object"
            var isProp = isObject && this.prop in value
            return this.parser(isProp ? value[this.prop] : value)
        },
        checkNaN = function (value) { return Number.isNaN(value) ? 0 : value }
    /**
     * Sorts an array of elements.
     *
     * @param  {Array} array: the collection to sort
     * @param  {Object} config: the configuration options
     * @property {String}   config.prop: property name (if it is an Array of objects)
     * @property {Boolean}  config.desc: determines whether the sort is descending
     * @property {Function} config.parser: function to parse the items to expected type
     * @return {Array}
     */
    return function sortby(array, config) {
        if (!(array instanceof Array && array.length)) return []
        if (toString.call(config) !== "[object Object]") config = {}
        let defaultParser = (t) => t?.toUpperCase()
        if (typeof config.parser !== "function") config.parser = parse || defaultParser
        config.desc = !!config.desc ? -1 : 1
        let source = AttribDestruct(array)
        return source.sort(function (a, b) {
            a = getItem.call(config, checkNaN(a))
            b = getItem.call(config, checkNaN(b))
            return config.desc * (a < b ? -1 : +(a > b))
        })
    }

}())