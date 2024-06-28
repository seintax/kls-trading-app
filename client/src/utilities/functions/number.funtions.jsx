const decimalFormat = new Intl.NumberFormat('en-PH', {
    style: 'decimal',
    currency: 'PHP',
    minimumFractionDigits: 2,
})

const monetizeFormat = new Intl.NumberFormat('en-PH', {
    style: 'decimal',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})

const currencyFormat = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
})

const floatFormat = new Intl.NumberFormat('en-PH', {
    style: 'decimal',
    currency: 'PHP',
    minimumFractionDigits: 8
})

const randomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const ordinal = (num) => {
    if (num % 10 == 1 && num % 100 != 11) {
        return `${num}st`
    }
    if (num % 10 == 2 && num % 100 != 12) {
        return `${num}nd`
    }
    if (num % 10 == 3 && num % 100 != 13) {
        return `${num}rd`
    }
    return `${num}th`
}

export const amount = (value) => {
    // return Number(Number(value?.toString()?.replaceAll(",", ""))?.toFixed(2) || 0)
    return parseFloat(value || 0)
}

export const currency = (value) => {
    return currencyFormat.format(amount(value) || 0).replace("₱", "")
}

export const float = (value) => {
    return floatFormat.format(amount(value) || 0).replace("₱", "")
}

const percent = (value) => {
    return `${decimalFormat.format(amount(value || 0) * 100)}%`
}

const acctgNumber = (value) => {
    return value ? value : "-"
}

const acctgAmount = (value) => {
    // return value ? Number(Number(value?.toString()?.replaceAll(",", ""))?.toFixed(2) || 0) : "-"
    return value ? parseFloat(value || 0) : "-"
}

const acctgCurrency = (value) => {
    return value ? decimalFormat.format(amount(value) || 0) : "-"
}

const acctgMonetize = (value) => {
    return value ? monetizeFormat.format(amount(value) || 0) : "-"
}

const acctgFloat = (value) => {
    return value ? floatFormat.format(amount(value) || 0) : "-"
}

const acctgPercent = (value) => {
    return value ? `${Number(decimalFormat.format(amount(value || 0) * 100))?.toFixed(2)}%` : "-"
}

const Utils = {
    amount,
    currency,
    float,
    percent,
    ordinal,
    randomInRange,
    acctg: {
        amount: acctgAmount,
        currency: acctgCurrency,
        monetize: acctgMonetize,
        float: acctgFloat,
        percent: acctgPercent,
        number: acctgNumber,
    }
}

export const NumFn = Utils