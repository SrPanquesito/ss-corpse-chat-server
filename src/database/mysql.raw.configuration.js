const mysql = require('mysql2/promise')

const user = process.env.MYSQL_USERNAME || 'root'
const password = process.env.MYSQL_PASSWORD || ''
const database = process.env.MYSQL_DBNAME || 'default'
const host = process.env.MYSQL_HOST || 'localhost'
const port = process.env.MYSQL_PORT || 3306

const pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
})

module.exports = pool
