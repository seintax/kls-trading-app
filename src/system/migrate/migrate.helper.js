const migrate = {
    showTables: `
        SHOW TABLES;
    `,
    selectTable: `
        SELECT * FROM @tableName
    `,
    pagedTable: `
        SELECT * FROM @tableName LIMIT @offset, @limit 
    `,
    countTable: `
        SELECT COUNT(*) AS records FROM @tableName
    `,
}

module.exports = {
    migrate
}