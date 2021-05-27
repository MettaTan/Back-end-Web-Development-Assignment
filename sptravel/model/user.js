var db = require('./databaseConfig.js');
var config=require('../config.js'); 
var jwt=require('jsonwebtoken');

var userDB = {
    getUsers: function (callback) { // Part 1
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log("\n\nThere was an error connecting to the Database!: " + err);
                console.log(err);
            } else {
                console.log("Successfully Connected to MySQL Server!");
                var sql = "SELECT * FROM users";
                conn.query(sql, [], (err, result) => {
                    conn.end();
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    },

    insertUser: function (username, email, role, password, profile_pic_url, callback) {  // Part 2
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log("There was an error connecting to the Database!: " + err);
                return callback(err, null);
            } else {
                var sql = "insert ignore into users (username,email,role,password,profile_pic_url) Values(?,?,?,?,?)"; // Only inserts if no duplicate found
                dbConn.query(sql, [username, email, role, password, profile_pic_url], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else if (result.warningCount == 0) { // Checks for any warnings e.g. Duplicate entry exists
                        return callback(null, result);
                    } else {
                        return callback(null, "User with the Same Username or Email already Exists ");
                    }
                });
            }
        });
    },
    getUser: function (userid, callback) {  // Part 3
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log("There was an error connecting to the Database!: " + err);
                return callback(err, null);
            } else {
                var sql = "select * from users where userid=?";
                dbConn.query(sql, [userid], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });

            }

        });
    },

    updateUser: function (username, email, role, password, profile_pic_url, userid, callback) {  // Part 4
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log("There was an error connecting to the Database!: " + err);
                return callback(err, null);
            } else {
                var sql = "update users set username=?, email=?, role=?, password=?, profile_pic_url=? where userid=?";
                dbConn.query(sql, [username, email, role, password, profile_pic_url, userid], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }

                });
            }
        });
    },

    deleteUser: function (userid, callback) {  // EXTRA feature
        var dbConn = db.getConnection();

        dbConn.connect(function (err) {

            if (err) {

                console.log("There was an error connecting to the Database!: " + err);
                return callback(err, null);

            } else {
                var sql = "delete from users where userid=?"; //delete user from table according to id

                dbConn.query(sql, [userid], function (err, result) {
                    dbConn.end();

                    return callback(err, result);
                });

            }

        });
    },

    loginUser: function (email, password, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");
                var sql = 'select * from users where email=? and password=?';
                conn.query(sql, [email, password], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log("Err: " + err);
                        return callback(err, null, null);
                    } else {
                        var token = "";
                        var i;
                        if (result.length == 1) {

                            token = jwt.sign({ id: result[0].userid, role: result[0].role }, config.key, {
                                expiresIn: 86400 //expires in 24 hrs
                            });
                            console.log("@@token " + token);
                            return callback(null, token, result);


                        } else {
                            var err2 = new Error("UserID/Password does not match.");
                            err2.statusCode = 500;
                            return callback(err2, null, null);
                        }
                    }  //else
                });
            }
        });
    }
    
    
}

module.exports = userDB;