var mysql = require('mysql');
var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "3.132.36.162",
            user: "Ben",
            password: "!QWER4321",
            database: "sptravel",
            multipleStatements: true
        });     
        return conn;
    }
};
module.exports = dbconnect
