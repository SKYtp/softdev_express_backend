const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'softdev02',
});

pool.getConnection((err, conn) => {
    if(err) console.log(err)
    console.log("Connected successfully")
})

module.exports = pool.promise()