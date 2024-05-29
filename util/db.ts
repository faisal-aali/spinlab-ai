const mysql = require('mysql');

const pool  = mysql.createPool({
    host            : "localhost",
    user            : "root",
    password        : "MyNewPass",
    port            : 3306,
    database: "nextauth",
});

export default pool;