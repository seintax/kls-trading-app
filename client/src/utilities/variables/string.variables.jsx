export const specifyfilter = {
    array: [
        { contains: [{ name: 'SE' }, { name: 'IN' }] },
        { contains: { id: 2 } },
        { distinct: { id: 1 } },
        { enjoined: { user: ['DE', 'VE'] } },
        { optional: [{ contains: { id: 1 } }, { contains: { id: 2 } }] }
    ]
} // request JSON body
export const authHeader = { 'Authorization': 'Bearer my-token' }