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
        console.log(this.value)
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

    static f(obj) {
        return new Field(obj.alias, obj.value)
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

    Exactly(qoute) {
        let base = (this.param === undefined ? "" : this.param.toString())
        if (qoute) return `'${base}'`
        return base
    }

    Contains(qoute) {
        let base = (this.param === undefined ? "" : this.param)
        if (qoute) return `'%${base}%'`
        return `%${base}%`
    }

    StartWith(qoute) {
        let base = (this.param === undefined ? "" : this.param)
        if (qoute) return `'${base}%'`
        return `${base}%`
    }

    EndWith(qoute) {
        let base = (this.param === undefined ? "" : this.param)
        if (qoute) return `'%${base}'`
        return `%${base}`
    }

    EqualTo() {
        let base = (this.param === undefined ? "" : this.param)
        return `'${base}'`
    }

    static p(obj) {
        return new Param(obj.alias, obj.param)
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
        let props_ = {}
        let alias_ = {}
        this.fields = {}
        for (const prop in fields) {
            let field = new Field(prop, fields[prop])
            props_ = {
                ...props_,
                [prop]: fields[prop]
            }
            alias_ = {
                ...alias_,
                [fields[prop]]: prop
            }
            this.fields = {
                ...this.fields,
                [prop]: field
            }
        }
        this.fields = {
            ...this.fields,
            props_: props_,
            alias_: alias_
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
        for (const prop in this.fields.props_) {
            if (request[prop]) {
                parameters.push(request[prop])
                fields.push(this.fields.props_[prop])
                values.push("?")
            }
        }
        return {
            sql: `INSERT INTO ${this.name} (${fields}) VALUES (${values});`,
            arr: parameters
        }
    }

    parameters(request) {
        let params = {}
        for (const prop in request) {
            params = {
                ...params,
                [prop]: new Param(prop, request[prop])
            }
        }
        return params
    }

    update(request) {
        const parameters = []
        const conditions = []
        const fields = []
        var id = undefined
        for (const prop in request) {
            if (this.fields.props_[prop]) {
                if (prop === "id") {
                    id = request[prop]
                    conditions.push(request[prop])
                    continue
                }
                fields.push(`${this.fields.props_[prop]}=?`)
                parameters.push(request[prop])
            }
        }
        if (!this.fields.props_.id) throw new Error("The 'id' property is missing.")
        if (conditions.length === 0) throw new Error("Parameter 'id' is not in request.")
        return {
            id: id,
            sql: `UPDATE ${this.name} SET ${fields} WHERE ${this.fields.props_.id}=?`,
            arr: [...parameters, ...conditions]
        }
    }

    delete(request) {
        if (!this.fields.props_.id) throw new Error("The 'id' property is missing.")
        if (!request.id) throw new Error("Parameter 'id' is not in request.")
        return {
            id: request.id,
            sql: `DELETE FROM ${this.name} WHERE ${this.fields.props_.id}=?`,
            arr: [request.id]
        }
    }

    pseudonym() {
        const names = []
        for (const prop in this.fields.props_) {
            names.push(`${this.fields.props_[prop]} AS ${prop}`)
        }
        return names.join(", ")
    }

    findone(request) {
        // let sought = this.pseudonym()
        const parameters = []
        const fields = []
        for (const prop in request) {
            if (this.fields.props_[prop]) {
                fields.push(`${this.fields.props_[prop]}=?`)
                parameters.push(request[prop])
            }
        }
        return {
            sql: `SELECT * FROM ${this.name} WHERE ${fields.join(" AND ")}`,
            arr: parameters,
            aka: this.fields.alias_,
            fnc: this.maskone
        }
    }

    records(orderarray, limitcount) {
        let order = orderarray && orderarray.length ? ` ORDER BY ${orderarray.join(", ")}` : ""
        let limit = limitcount ? ` LIMIT ${limitcount}` : ""
        return {
            sql: `SELECT * FROM ${this.name} ${order}${limit}`,
            aka: this.fields.alias_,
            fnc: this.maskall
        }
    }

    inquiry(clausearray, paramarray, orderarray, limitcount) {
        let clause = clausearray?.filter(f => f !== undefined).join(" AND ")
        let order = orderarray && orderarray.length ? ` ORDER BY ${orderarray.join(", ")}` : ""
        let limit = limitcount ? ` LIMIT ${limitcount}` : ""
        return {
            sql: `SELECT * FROM ${this.name} WHERE ${clause}${order}${limit}`,
            arr: paramarray,
            aka: this.fields.alias_,
            fnc: this.maskall
        }
    }

    #Collective(contains) {
        let itemcollective = ""
        if (Array.isArray(contains)) {
            let collective = contains?.map(item => {
                for (const prop in item) {
                    itemcollective = Field.f(this.fields[prop]).Like(new Param(prop, item[prop]).Contains(true))
                }
                return itemcollective
            })
            return collective?.join(" AND ")
        }
        for (const prop in contains) {
            itemcollective = Field.f(this.fields[prop]).Like(new Param(prop, contains[prop]).Contains(true))
        }
        return itemcollective
    }

    #Distinctive(distinct) {
        for (const prop in distinct) {
            return Field.f(this.fields[prop]).IsEqual(new Param(prop, distinct[prop]).Exactly())
        }
    }

    #Exclusive(enjoined) {
        for (const prop in enjoined) {
            return Field.f(this.fields[prop]).Between(enjoined[prop][0], enjoined[prop][1])
        }
    }

    #Selective(optional) {
        return `(${optional?.map(prop => {
            if (prop.hasOwnProperty("distinct")) {
                return this.#Distinctive(prop.distinct)
            }
            if (prop.hasOwnProperty("contains")) {
                return this.#Collective(prop.contains)
            }
            if (prop.hasOwnProperty("enjoined")) {
                return this.#Exclusive(prop.enjoined)
            }
        }).join(" OR ")})`
    }

    specific(request) {
        let filter = JSON.parse(request.filter)
        let specs = filter?.map(prop => {
            if (prop.hasOwnProperty("distinct")) {
                return this.#Distinctive(prop.distinct)
            }
            if (prop.hasOwnProperty("contains")) {
                return this.#Collective(prop.contains)
            }
            if (prop.hasOwnProperty("enjoined")) {
                return this.#Exclusive(prop.enjoined)
            }
            if (prop.hasOwnProperty("optional")) {
                return this.#Selective(prop.optional)
            }
        })
        return {
            sql: `SELECT * FROM ${this.name} WHERE ${specs.join(" AND ")}`,
            arr: [],
            aka: this.fields.alias_,
            fnc: this.maskall
        }
    }

    maskone(masked, result) {
        if (result.length === 1) {
            let data = result[0]
            for (const prop in data) {
                if (masked[prop]) {
                    data[masked[prop]] = data[prop]
                    delete data[prop]
                }
            }
            return data
        }
        return {}
    }

    maskall(masked, results) {
        if (results.length > 0) {
            return results?.map(result => {
                let data = result
                let alter = {}
                for (const prop in data) {
                    if (masked[prop]) {
                        alter = {
                            ...alter,
                            [masked[prop]]: data[prop]
                        }
                        continue
                    }
                    alter = {
                        ...alter,
                        prop: data[prop]
                    }
                }
                return alter
            })
        }
        return results
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