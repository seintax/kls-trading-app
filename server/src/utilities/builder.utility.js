const my = require('../../res/data/mysql')

class Field {
    constructor(alias, value) {
        this.alias = alias
        this.value = value
    }

    key() {
        return this.alias
    }

    value() {
        return this.value
    }

    prop() {
        return { [this.alias]: this.value }
    }

    Asc() {
        return this.value ? `${this.value} ASC` : ""
    }

    Desc() {
        return this.value ? `${this.value} DESC` : ""
    }

    IsEqual(val = undefined) {
        return this.value ? `${this.value} = ${val ? `'${val}'` : "?"}` : ""
    }

    NotEqual(val = undefined) {
        return this.value ? `${this.value} <> ${val ? `'${val}'` : "?"}` : ""
    }

    Like(val = undefined) {
        return this.value ? `${this.value} LIKE ${val ? val : "?"}` : ""
    }

    NotLike(val = undefined) {
        return this.value ? `${this.value} NOT LIKE ${val ? val : "?"}` : ""
    }

    Between(fr = undefined, to = undefined) {
        return this.value ? `(${this.value} BETWEEN ${fr ? `'${fr}'` : "?"} AND ${to ? `'${to}'` : "?"})` : ""
    }

    Greater(val = undefined) {
        return this.value ? `${this.value} > ${val ? val : "?"}` : ""
    }

    Lesser(val = undefined) {
        return this.value ? `${this.value} < ${val ? val : "?"}` : ""
    }

    IsNull() {
        return (this.value ? `${this.value} IS NULL` : "")
    }

    IsNotNull() {
        return (this.value ? `${this.value} IS NOT NULL` : "")
    }
}

class Query {
    constructor(alias, query) {
        this.alias = alias
        this.query = query
    }

    key() {
        return this.alias
    }

    query() {
        return this.query
    }

    inject(request) {
        var runquery = this.query
        for (const prop in request) {
            runquery = runquery.replaceAll(`@${prop}`, request[prop])
        }
        return runquery
    }
}

class Param {
    constructor(alias, param) {
        this.alias = alias
        this.param = param
    }

    key() {
        return this.alias
    }

    param() {
        return this.param
    }

    Possibility(paramarray) {
        return `(${paramarray?.filter(f => f !== undefined)?.join(" OR ")})`
    }

    Exactly() {
        let base = (this.param === undefined ? "" : this.param.toString())
        return base
    }

    Contains() {
        let base = (this.param === undefined ? "" : this.param)
        return `%${base}%`
    }

    StartWith() {
        let base = (this.param === undefined ? "" : this.param)
        return `${base}%`
    }

    EndWith() {
        let base = (this.param === undefined ? "" : this.param)
        return `%${base}`
    }

    EqualTo() {
        let base = (this.param === undefined ? "" : this.param)
        return `'${base}'`
    }
}

class Table {
    constructor(name, fields) {
        this.name = name
        this.associated = {
            items: {},
            assoc: {}
        }
        this.statements = {}
        let raw = {}
        this.fields = {}
        for (const prop in fields) {
            let field = new Field(prop, fields[prop])
            raw = {
                ...raw,
                [prop]: fields[prop]
            }
            this.fields = {
                ...this.fields,
                [prop]: field
            }
        }
        this.fields = {
            ...this.fields,
            raw: raw
        }
    }

    struct() {
        return {
            name: this.name,
            fields: this.fields,
            associated: this.associated,
            statements: this.statements
        }
    }

    insert(request) {
        const parameters = []
        const fields = []
        const values = []
        for (const prop in this.fields.raw) {
            console.log(prop)
            if (request[prop]) {
                parameters.push(request[prop])
                fields.push(this.fields.raw[prop])
                values.push("?")
            }
        }
        return {
            sql: `INSERT INTO ${this.name} (${fields}) VALUES (${values});`,
            arr: parameters
        }
    }

    update(request) {
        const parameters = []
        const conditions = []
        const fields = []
        for (const prop in request) {
            if (this.fields.raw[prop]) {
                if (prop === "id") {
                    conditions.push(request[prop])
                    continue
                }
                fields.push(`${this.fields.raw[prop]}=?`)
                parameters.push(request[prop])
            }
        }
        if (!this.fields.raw.id) throw new Error("The 'id' property is missing.")
        if (conditions.length === 0) throw new Error("Parameter 'id' is not in request.")
        return {
            sql: `UPDATE ${this.name} SET ${fields} WHERE ${this.fields.raw.id}=?`,
            arr: [...parameters, ...conditions]
        }
    }

    delete(request) {
        if (!this.fields.raw.id) throw new Error("The 'id' property is missing.")
        if (!request.id) throw new Error("Parameter 'id' is not in request.")
        return {
            sql: `DELETE FROM ${this.name} WHERE ${this.fields.raw.id}=?`,
            arr: [request.id]
        }
    }

    alias() {
        const names = []
        for (const prop in this.fields.raw) {
            names.push(`${this.fields.raw[prop]} AS ${prop}`)
        }
        return names.join(", ")
    }

    findone(request) {
        let sought = this.alias()
        const parameters = []
        const fields = []
        for (const prop in request) {
            if (this.fields.raw[prop]) {
                fields.push(`${this.fields.raw[prop]}=?`)
                parameters.push(request[prop])
            }
        }
        return {
            sql: `SELECT ${sought} FROM ${this.name} WHERE ${fields.join(" AND ")}`,
            arr: parameters
        }
    }

    inquiry(clausearray, paramarray, orderarray, limitcount) {
        let sought = this.alias()
        let clause = clausearray?.filter(f => f !== undefined)?.join(" AND ")
        let order = orderarray && orderarray.length ? ` ORDER BY ${orderarray.join(", ")}` : ""
        let limit = limitcount ? ` LIMIT ${limitcount}` : ""
        return {
            sql: `SELECT ${sought} FROM ${this.name} WHERE ${clause}${order}${limit}`,
            arr: paramarray
        }
    }

    formattedparams(request) {
        let parameters = {}
        for (const prop in request) {
            parameters = {
                ...parameters,
                [prop]: new Param(prop, request[prop])
            }
        }
        return parameters
    }

    enumerate(states, assocs) {
        for (const prop in states) {
            let enums = new Query(prop, states[prop])
            this.statements = {
                ...this.statements,
                [prop]: enums
            }
        }
        for (const prop in assocs) {
            let assoc = new Field(prop, assocs[prop])
            this.associated = {
                items: {
                    ...this.associated.items,
                    [prop]: assocs[prop]
                },
                assoc: {
                    ...this.associated.assoc,
                    [prop]: assoc
                }
            }
        }
    }

    associate(clausearray, paramarray, orderarray) {
        return {
            name: this.name,
            fields: this.associated.items,
            options: {
                parameters: paramarray,
                clauses: clausearray,
                order: orderarray
            }
        }
    }

    union(assocarray, orderarray, limitcount) {
        const parameters = []
        const base = this.associated.items
        let sql = assocarray?.map(assoc => {
            assoc?.options?.parameters?.map(param => {
                parameters.push(param)
            })
            return `SELECT ${compare(base, assoc?.fields)} FROM ${assoc?.name} WHERE ${assoc?.options?.clauses.join(" AND ")}`
        })
        let order = orderarray ? ` ORDER BY ${orderarray.join(", ")}` : ""
        let limit = limitcount ? ` LIMIT ${limitcount}` : ""
        return {
            sql: `${sql.join(" UNION ")}${order}${limit}`,
            arr: parameters
        }
    }
}

module.exports = { Field, Query, Param, Table }