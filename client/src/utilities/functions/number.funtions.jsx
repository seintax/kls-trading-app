export const currencyFormat = new Intl.NumberFormat('en-PH', {
    style: 'decimal',
    currency: 'PHP',
    minimumFractionDigits: 2,
})

export const amount = (value) => {
    return Number(Number(value?.toString()?.replaceAll(",", ""))?.toFixed(2) || 0)
}