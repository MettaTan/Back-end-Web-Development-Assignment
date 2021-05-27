var db = require('./databaseConfig.js');
var successMsg = "Successfully Connected to MySQL Server!";
var travelDB = {
    getListing: function (callback) {  // Part 5
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log("\n\nThere was an error connecting to the Database!: " + err);
                console.log(err);
            } else {
                console.log(successMsg);
                var sql = "SELECT * FROM travel";
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
        })
    },
    addListing: (title, description, price, country, period, picUrl, callback) => {  // Part 6
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log(successMsg);
                var sql = "insert into travel (title, description, price, country, travelPeriod, picUrl) values (?,?,?,?,?,?)";
                conn.query(sql, [title, description, price, country, period, picUrl], (err, result) => {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, result)
                    }
                });
            }
        });
    },
    deleteListing: function (traveId, callback) {  // Part 7
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log(successMsg);
                var sql = "delete from travel where travelid = ?";
                conn.query(sql, [traveId], (err, result) => {
                    conn.end();
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, result.affectedRows);
                    }
                });
            }
        });
    },
    updateTravel: function (title, description, price, country, travelPeriod, travelid, callback) {  // Part 8
        var dbConn = db.getConnection();

        dbConn.connect(function (err) {
            if (err) {
                console.log("There was an error connecting to the Database!: " + err);
                return callback(err, null);
            } else {
                var sql = "update travel set title=?,description=?,price=?,country=?,travelPeriod=? where travelid=?";
                dbConn.query(sql, [title, description, price, country, travelPeriod, travelid], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, result);
                    }
                });
            }
        });
    },
    getItinerary: (itineraryId, callback) => { // Part 9
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log("\n\nThere was an error connecting to the Database!: " + err);
                console.log(err);
            } else {
                console.log(successMsg);
                // var sql = "SELECT * FROM itinerary, travel WHERE travelid = ?"; (Old query used in assignment 1)
                var sql = "SELECT itinerary.itineraryid, itinerary.day, itinerary.activity, itinerary.created_at, itinerary.travelid, travel.description FROM itinerary, travel WHERE itinerary.travelid = ? and itinerary.travelid = travel.travelid"
                // Query retrieves all fields from itinerary table and description from travel table

                conn.query(sql, [itineraryId], (err, result) => {
                    conn.end();
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, result);
                    }
                });
            }
        });
    },
    insertItinerary: (day, activity, travelid, callback) => { // Part 10
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log("\n\nThere was an error connecting to the Database!: " + err);
                console.log(err);
            } else {
                console.log(successMsg);
                var sql = "insert into itinerary (day, activity, travelid) Values (?, ?, ?)";
                conn.query(sql, [day, activity, travelid], (err, result) => {
                    conn.end();
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, result);
                    }
                });
            }
        });
    },

    updateItinerary: function (day, activity, travelid, callback) { // EXTRA feature
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log("There was an error connecting to the Database!: " + err);
                return callback(err, null);
            } else {
                var sql = "update itinerary set day=?, activity=?, travelid=? where itineraryid=?";
                conn.query(sql, [day, activity, travelid, itineraryid], function (err, result) {
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

    deleteItinerary: function (itineraryid, callback) { // EXTRA feature
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log(successMsg);
                var sql = "delete from itinerary where itineraryid = ?";
                conn.query(sql, [itineraryid], (err, result) => {
                    conn.end();
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, result.affectedRows);
                    }
                });
            }
        });
    },

    addReview: (content, rating, uid, tid, callback) => {// Part 11
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log("There was an error connecting to the Database!: " + err);
                return callback(err, null);
            } else {
                var sql = "insert ignore into reviews (content, rating, userid, travelid) Values(?,?,?,?)"; // Only inserts if no duplicate found
                dbConn.query(sql, [content, rating, uid, tid], function (err, result) {
                    dbConn.end();
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else if (result.warningCount == 0) { // Checks for any warnings e.g. Duplicate entry exists
                        return callback(null, result);
                    } else {
                        return callback(null, "Review containing exact content exists!"); // Prevents reviews that are copy-pasted from being inserted
                    }
                });
            }
        });
    },
    getReviews: (travelid, callback) => { // Part 12
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log("\n\nThere was an error connecting to the Database!: " + err);
                console.log(err);
            } else {
                console.log(successMsg);
                var sql = "SELECT reviews.travelid, reviews.content, reviews.rating, users.username, reviews.created_at FROM reviews, users WHERE travelid = ? AND reviews.userid = users.userid;";
                conn.query(sql, [travelid], (err, result) => {
                    conn.end();
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else {
                        console.log(result);
                        return callback(null, result);
                    }
                });
            }
        });
    },
    getPromotions: function (callback) {  // EXTRA feature: Get all promotions
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log("\n\nThere was an error connecting to the Database!: " + err);
                console.log(err);
            } else {
                console.log(successMsg);
                var sql = "SELECT * FROM promotions, travel WHERE travel.travelid = promotions.travelid"; //  Gets all promotions together with the travel details associated with the travel listing that the promotion is applied to
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
        })
    },

    addPromotion: (startDate, endDate, discount, tid, callback) => { // EXTRA feature: Insert Promotion
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log("There was an error connecting to the Database!: " + err);
                return callback(err, null);
            } else {
                var sql = "select price from travel where travelid=?";
                dbConn.query(sql, [tid], function (err, result) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        var price = parseInt(result[0].price);
                        var disprice = price * (100 - parseInt(discount)) / 100; //calculate discounted price
                        var sql = "insert  into promotions (startdate, enddate, discount, disprice, travelid) Values(?,?,?,?,?)";
                        dbConn.query(sql, [startDate, endDate, discount, disprice, tid], function (err, result) {
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
            }
        });
    },
    deletepromotion: function (promoId, callback) { // EXTRA feature: Delete promotions
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log(successMsg);
                var sql = "delete from promotions where promotionid = ?";
                conn.query(sql, [promoId], (err, result) => {
                    conn.end();
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else {
                        // console.log(result);
                        return callback(null, result);
                    }
                });
            }
        });
    },
    getActivePromotions: function (callback) { // EXTRA: Gets Promotion that is currently active
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log("\n\nThere was an error connecting to the Database!: " + err);
                console.log(err);
            } else {
                console.log(successMsg);
                var sql = "SELECT startdate, enddate FROM sptravel.promotions;"; //  Gets all dates from promo table
                conn.query(sql, [], (err, result) => {
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else {
                        var currentDate = new Date(); // Gets current date
                        for (var i = 0; i < result.length; i++) { // iterates through all dates from promo table
                            if (result[i].startdate < currentDate && currentDate < result[i].enddate) { // Checks if cuttent date is in the range of promotion period
                                var sql = "SELECT * FROM promotions, travel WHERE travel.travelid = promotions.travelid AND promotions.startdate = ? AND promotions.enddate = ?"; //  Gets promotion listings and travel listings details with active promotion
                                conn.query(sql, [result[i].startdate, result[i].enddate], (err, result) => {
                                    conn.end();
                                    if (err) {
                                        console.log("\n\nThere was an error retrieving data!: " + err);
                                        return callback(err, null);
                                    } else {
                                        return callback(null, result);
                                    }
                                });
                            }
                        }
                    }
                });
            }
        })
    },
    // Assignment 2
    dynamicListingSearch: (search, period, price, callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log("\n\nThere was an error connecting to the Database!: " + err);
                console.log(err);
            } else {
                console.log(successMsg);
                var sql = `SELECT * FROM travel`;
                var queryArray = [];


                // If Search bar input is NOT left empty
                if (search != "%null%") {
                    sql += ` WHERE title LIKE ? OR country LIKE ?`;
                    for (var i = 0; i < 2; i++) { // Loops twice to fit the query string ?'s
                        queryArray.push(search); // Appends user's search input to the Query array
                    }
                }
                // END Preferred Period is NOT left empty


                // If Preferred Period is NOT left empty
                if (period != "%null%") {
                    if (search != "%null%") { // adjusts syntax of SQL query
                        sql += ' AND'
                    } else {
                        sql += ' WHERE'
                    }
                    sql += ` travelPeriod LIKE ?`; // Appends a check for travelPeriod to the query string
                    queryArray.push(period); // Appends period to the Query array to fit the query string ?'s
                }
                // END Preferred Period is NOT left empty


                // If price is NOT left empty
                if (price != "null") {
                    if (search != "%null%" || period != "%null%") { // adjusts syntax of SQL query
                        sql += ' AND'
                    } else {
                        sql += ' WHERE'
                    }
                    sql += ` price <= ?`; // Appends a check for price to the query string

                    queryArray.push(parseInt(price)); // Appends price integer to the Query array to fit the query string ?'s
                }
                // END price is NOT left empty

                conn.query(sql, queryArray, (err, result) => {
                    conn.end();
                    if (err) {
                        console.log("\n\nThere was an error retrieving data!: " + err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        })
    }

}

module.exports = travelDB;