const my = require('../../res/data/mysql')

class Field {
    constructor(alias, value) {
        this.alias = alias
        this.value = value
    }

    key() {
        return this.alias
    }

    parameter() {
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

    CompareEQ(field) {
        return `${this.value} = ${field}`
    }

    CompareGT(field) {
        return `${this.value} > ${field}`
    }

    CompareGTE(field) {
        return `${this.value} >= ${field}`
    }

    CompareLT(field) {
        return `${this.value} < ${field}`
    }

    CompareLTE(field) {
        return `${this.value} <= ${field}`
    }

    CompareNE(field) {
        return `${this.value} <> ${field}`
    }

    Either(arr) {
        let option = arr?.map(opt => {
            return `${this.value} = ${opt ? `'${opt}'` : "?"}`
        })
        return `(${option.join(" OR ")})`
    }

    CanBeNull(val = undefined) {
        return this.value ? `${this.value} ${val ? `= '${val}'` : "IS NULL"}` : ""
    }

    IsEqual(val = undefined) {
        return this.value ? `${this.value} = ${val ? `'${val}'` : "?"}` : ""
    }

    IsField(val) {
        return this.value ? `${this.value} = ${val}` : ""
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

    PSTTimeStamp() {
        return new Field(this.alias, `(${this.value} + INTERVAL 8 HOUR)`)
    }

    PSTDate() {
        return new Field(this.alias, `DATE(${this.value} + INTERVAL 8 HOUR)`)
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

    statement() {
        return this.query
    }

    aliased(alias) {
        return this.alias === alias
    }

    inject(request) {
        var sqlstmt = this.query
        for (const prop in request) {
            sqlstmt = sqlstmt?.replaceAll(`@${prop}`, request[prop])
        }
        return sqlstmt
    }

    static q(obj) {
        return new Query(obj.alias, obj.query)
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

    parameter() {
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
    constructor(name, fields, foreign) {
        this.name = name
        this.associated = {
            items: {},
            assoc: {}
        }
        this.foreign = foreign
        this.statements = {}
        let props_ = {}
        let alias_ = {}
        this.fields = {}
        this.included = {}
        this.queries = []
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
        if (foreign?.length) {
            foreign?.map(ref => {
                for (const prop in ref?.include) {
                    let include = new Field(prop, ref?.include[prop])
                    alias_ = {
                        ...alias_,
                        [ref?.include[prop]]: prop
                    }
                    this.included = {
                        ...this.included,
                        [prop]: include
                    }
                }
            })
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
            statements: this.statements,
            queries: this.queries
        }
    }

    /**
     * Retrieves a query object that corresponds to a property name as parameter.
     * @param {string} alias sought property name
     * @returns if property exist, returns a Query object of property, or else a Query object of a 'none' property
     */
    statement(alias) {
        let found = this.queries.filter(f => f.aliased(alias))
        if (found.length) return found[0]
        return new Query("none", undefined)
    }

    /**
     * Appends a query with an assigned property name to a list of queries.
     * @param {string} name assigned property name
     * @param {string} query an sql statement that describes the assigned property name
     */
    register(name, query) {
        let obj = new Query(name, query)
        this.queries.push(obj)
    }

    conjoin(clause = undefined, type = undefined) {
        let strindex = "bcdefghijklmnopqrstuvwxyz".split("")
        let table = this.name
        let parameters = []
        if (this.foreign?.length) {
            table = `${table} a`
            if (type === "JOIN") {
                return `${table} WHERE `
            }
            this.foreign?.map((item, i) => {
                table = `${table}, ${item.reference.table} ${strindex[i]}`
                parameters.push(`a.${item.key} = ${strindex[i]}.${item.reference.key}`)
            })
            return `${table} WHERE ${parameters.join(" AND ")}${clause ? ` AND ${clause}` : ""}`
        }
        return clause
            ? `${table} WHERE ${clause}`
            : `${table} `
    }

    leftjoin(sibling, clausearray, paramarray, orderarray, limitcount, grouparray = undefined) {
        let clause = clausearray?.filter(f => f !== undefined).join(" AND ")
        let order = orderarray && orderarray.length ? ` ORDER BY ${orderarray.join(", ")}` : ""
        let limit = limitcount ? ` LIMIT ${limitcount}` : ""
        let group = grouparray && grouparray.length ? ` GROUP BY ${grouparray.join(", ")}` : ""
        let strindex = "bcdefghijklmnopqrstuvwxyz".split("")
        let table = `${this.name} a`
        if (sibling?.length) {
            sibling?.map((item, i) => {
                table = `${table} LEFT JOIN ${item.reference.table} ${strindex[i]} ON ${strindex[i]}.${item.reference.key} = a.${item.key}`
            })
        }
        let enjoin = `${table} a WHERE ${clause ? ` AND ${clause}` : ""}`
        return {
            sql: `SELECT * FROM ${enjoin}${group}${order}${limit}`,
            arr: paramarray,
            aka: this.fields.alias_,
            fnc: this.maskall
        }
    }

    insert(request) {
        const parameters = []
        const fields = []
        const values = []
        for (const prop in this.fields.props_) {
            if (request[prop] !== null) {
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
                if (request[prop] !== null) {
                    fields.push(`${this.fields.props_[prop]}=?`)
                    parameters.push(request[prop])
                }
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

    /**
     * Creates a delete sql object that receives an 'id' object as a condition.
     * @param {object} request an object containing field properties
     * @returns an sql object with working sql statement and its corresponding parameters.
     */
    delete(request) {
        if (!this.fields.props_.id) throw new Error("The 'id' property is missing.")
        if (!request.id) throw new Error("Parameter 'id' is not in request.")
        return {
            id: request.id,
            sql: `DELETE FROM ${this.name} WHERE ${this.fields.props_.id}=?`,
            arr: [request.id]
        }
    }

    /**
     * Creates a delete sql object that receives an object parameter with user-specific conditions.
     * @param {object} request an object containing field properties
     * @returns an sql object with a working sql statement and its corresponding parameters.
     */
    remove(request) {
        const parameters = []
        const fields = []
        for (const prop in request) {
            if (this.fields.props_[prop]) {
                fields.push(`${this.fields.props_[prop]}=?`)
                parameters.push(request[prop])
            }
        }
        return {
            sql: `DELETE FROM ${this.name} WHERE ${fields.join(" AND ")}`,
            arr: parameters,
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
            sql: `SELECT * FROM ${this.conjoin()}${order}${limit}`,
            aka: this.fields.alias_,
            fnc: this.maskall
        }
    }

    inquiry(clausearray, paramarray, orderarray, limitcount, grouparray = undefined) {
        let clause = clausearray?.filter(f => f !== undefined).join(" AND ")
        let order = orderarray && orderarray.length ? ` ORDER BY ${orderarray.join(", ")}` : ""
        let limit = limitcount ? ` LIMIT ${limitcount}` : ""
        let group = grouparray && grouparray.length ? ` GROUP BY ${grouparray.join(", ")}` : ""
        return {
            sql: `SELECT * FROM ${this.conjoin(clause)}${group}${order}${limit}`,
            arr: paramarray,
            aka: this.fields.alias_,
            fnc: this.maskall
        }
    }

    format(sql) {
        // use with Query.statement().inject()
        return {
            sql: sql,
            aka: this.fields.alias_,
            fnc: this.maskall
        }
    }

    max(field, clausearray, paramarray) {
        let clause = clausearray?.filter(f => f !== undefined).join(" AND ")
        return {
            sql: `SELECT MAX(${field}) AS maxval FROM ${this.name} WHERE ${clause}`,
            arr: paramarray,
            aka: { maxval: 'max' },
            fnc: this.maskone
        }
    }

    count(clausearray, paramarray) {
        let clause = clausearray?.filter(f => f !== undefined).join(" AND ")
        return {
            sql: `SELECT COUNT(*) AS countval FROM ${this.name} WHERE ${clause}`,
            arr: paramarray,
            aka: { countval: 'count' },
            fnc: this.maskone
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
        let filter = JSON.parse(request.array)
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
                    alter = { ...alter, [prop]: data[prop] }
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