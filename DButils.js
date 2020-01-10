var mysql = require('mysql');
var Promise = require("bluebird");

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var pool = mysql.createPool({
    host: 'remotemysql.com',
    port: '3306',
    user: 'u2MdDE1hNJ',
    password: 'xr8wPpHroo',
    database: 'u2MdDE1hNJ'
});

function getSqlConnection() {
    return pool.getConnectionAsync().disposer(function (connection) {
        console.log("Releasing connection back to pool")
        connection.release();
    });
}

function querySql (query, params) {
    return Promise.using(getSqlConnection(), function (connection) {
        console.log("Got connection from pool");
        if (typeof params !== 'undefined'){
            return connection.queryAsync(query, params);
        } else {
            return connection.queryAsync(query);
        }
    });
};

module.exports = {
    getSqlConnection : getSqlConnection,
    execQuery : querySql
};
