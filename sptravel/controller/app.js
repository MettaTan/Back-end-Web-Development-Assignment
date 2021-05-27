const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const app = express();
const user = require("../model/user.js");
const travel = require("../model/travel.js");
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const verifyToken = require('../auth/verifyToken.js');
app.use(bodyParser.json()).use(urlencodedParser);
// app.use(fileUpload());
app.use(cors());


// FRONT-END
app.use(express.static('./images/'));
//app.use(express.static(__dirname + '/sptravel'));
app.use(express.static(__dirname + '/sptravel'));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });
app.post('/upload', upload.single('file'), (req, res, next) => {
    try {
        var filename = req.file.filename;
        console.log(filename)
        res.redirect('back');
        // return false;
        // res.send(filename);


    } catch (error) {
        console.error(error); 
    }
});

app.get("/users/", (req, res) => { // Part 1
    user.getUsers((err, result) => {
        if (!err) {
            res.status(200).send(result);
            console.log("Sent Response to client at " + req.connection.remoteAddress);
        } else {
            console.log("Error Trying to Respond to Client!: " + result);
            res.status(500).send("Unknown Error!");
        }
    });
}).post('/users/', verifyToken, function (req, res) { // Part 2 // 
    var username = req.body.username;
    var email = req.body.email;
    var role = req.body.role;
    var password = req.body.password;
    var profile_pic_url = req.body.profile_pic_url;


    user.insertUser(username, email, role, password, profile_pic_url, function (err, result) {
        res.type('json');
        if (err) {
            res.status(500);
            res.send(`{"message":"Error Occurred"}`);
        } else if (result.insertId == null) {
            res.status(201);
            res.send(result);
        } else {
            res.status(201);
            res.send(`{"userid":"${result.insertId}"}`);
        }
    });
}).get('/users/:id/', function (req, res) { // Part 3
    var userid = req.params.id;
    user.getUser(userid, function (err, result) {
        res.type('json');
        if (err) {
            res.status(500);
            res.send(`{"message":"Error Occurred"}`);
        } else {
            res.status(200);
            res.send(result);
        }
    });

}).put('/users/:id/', function (req, res) { // Part 4
    var username = req.body.username;
    var email = req.body.email;
    var role = req.body.role;
    var password = req.body.password;
    var profile_pic_url = req.body.profile_pic_url;

    var userid = req.params.id;

    user.updateUser(username, email, role, password, profile_pic_url, userid, function (err, result) {
        res.type('json');
        if (!err) {
            res.status(204).send(result);
            console.log("Sent Response to client at " + req.connection.remoteAddress);
        } else {
            console.log("Error Trying to Respond to Client!: " + result);
            res.status(500).send("Unknown Error!");
        }
    });

}).delete('/users/:id/', (req, res) => { // EXTRA feature
    var userid = req.params.id;
    user.deleteUser(userid, (err, result) => {
        res.type('json');
        if (!err) {
            res.status(204).send(result + " record deleted");
        } else {
            console.log(err);
            res.status(500).send("Unknown Error!");
        }
    });

}).get("/travel/", (req, res) => { // Part 5
    travel.getListing((err, result) => {
        res.type('json');
        if (!err) {
            res.status(200).send(result);
            console.log("Sent Response to client at " + req.connection.remoteAddress);
        } else {
            console.log("Error Trying to Respond to Client!: " + result);
            res.status(500).send("Unknown Error!");
        }
    });

}).post('/travel/', (req, res) => { // Part 6
    var title = req.body.title;
    var description = req.body.description;
    var price = req.body.price;
    var country = req.body.country;
    var period = req.body.travelPeriod;
    var picUrl = req.body.picUrl;
    console.log(title, description, price, country, period, picUrl);

    travel.addListing(title, description, price, country, period, picUrl, (err, result) => {
        res.type('json');
        if (!err) {
            var travelId = { "travelid": result.insertId };
            console.log(travelId);

            res.status(201).send(travelId);
            console.log("Sent Response to client at " + req.connection.remoteAddress);
        } else {
            console.log("Error Trying to Respond to Client!: " + result);
            res.status(500).send("Unknown Error!");
        }
    });

}).delete('/travel/:id/', (req, res) => { // Part 7
    var travelId = req.params.id;
    travel.deleteListing(travelId, (err, result) => {
        res.type('json');
        if (!err) {
            res.status(204).send(result + " record deleted");
        } else {
            console.log(err);
            res.status(500).send("Unknown Error!");
        }
    });
}).put('/travel/:id/', function (req, res) { // Part 8
    var title = req.body.title;
    var description = req.body.description;
    var price = req.body.price;
    var country = req.body.country;
    var travelPeriod = req.body.travelPeriod;
    var travelid = req.params.id;

    travel.updateTravel(title, description, price, country, travelPeriod, travelid, function (err, result) {
        res.type('json');
        if (err) {
            res.status(500);
            res.send(`{"message":"internal server error"}`);
        } else {
            res.status(204).send(result.message);
        }
    });
}).get("/travel/:id/itinerary", (req, res) => { // Part 9
    var id = req.params.id;
    travel.getItinerary(id, (err, result) => {
        res.type('json');
        if (!err) {
            res.status(200).send(result);
            console.log("Sent Response to client at " + req.connection.remoteAddress);
        } else {
            console.log("Error Trying to Respond to Client!: " + result);
            res.status(500).send("Unknown Error!");
        }
    });
}).post('/travel/:id/itinerary/', (req, res) => { // Part 10
    var id = req.params.id;
    var activity = req.body.activity;
    var day = req.body.day;

    travel.insertItinerary(day, activity, id, (err, result) => {
        res.type('json');
        if (!err) {
            var itineraryId = { "itineraryid": result.insertId };
            res.status(201).send(itineraryId);
            console.log("Sent Response to client at " + req.connection.remoteAddress);
        } else {
            console.log("Error Trying to Respond to Client!: " + result);
            res.status(500).send("Unknown Error!");
        }
    });

}).put('/travel/:id/itinerary/', (req, res) => { // EXTRA feature
    var id = req.params.id;
    var activity = req.body.activity;
    var day = req.body.day;

    travel.updateItinerary(day, activity, id, (err, result) => {
        res.type('json');
        if (!err) {
            var itineraryId = { "itineraryid": result.insertId };
            res.status(204).send(result.message);
            console.log("Sent Response to client at " + req.connection.remoteAddress);
        } else {
            console.log("Error Trying to Respond to Client!: " + result);
            res.status(500).send("Unknown Error!");
        }
    });

}).delete('/itinerary/:id/', (req, res) => { // EXTRA feature
    var itineraryid = req.params.id;
    travel.deleteItinerary(itineraryid, (err, result) => {
        res.type('json');
        if (!err) {
            res.status(204).send(result + " record deleted");
        } else {
            console.log(err);
            res.status(500).send("Unknown Error!");
        }
    });

}).post('/user/:uid/travel/:tid/review/', (req, res) => { // Part 11
    var uid = req.params.uid;
    var tid = req.params.tid;
    var content = req.body.content;
    var rating = req.body.rating;

    travel.addReview(content, rating, uid, tid, (err, result) => {
        res.type('json');
        if (!err) {
            res.status(201).send({ "reviewid": result.insertId });
            console.log("Sent Response to client at " + req.connection.remoteAddress);
        } else {
            console.log("Error Trying to Respond to Client!: " + result);
            res.status(500).send("Unknown Error!");
        }
    });

}).get("/travel/:id/review", (req, res) => { // Part 12
    var id = req.params.id;
    travel.getReviews(id, (err, result) => {
        res.type('json');
        if (!err) {
            res.status(200).send(result);
            console.log("Sent Response to client at " + req.connection.remoteAddress);
        } else {
            console.log("Error Trying to Respond to Client!: " + result);
            res.status(500).send("Unknown Error!");
        }
    });

}).get('/upload', function (req, res) { // EXTRA: For HTML requests to upload files
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<form action="upload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="file"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.end();
}).get("/promotions/", (req, res) => { // GET request for Promotions
    travel.getPromotions((err, result) => {
        res.type('json');
        if (!err) {
            res.status(200).send(result);
            console.log("Sent Response to client at " + req.connection.remoteAddress);
        } else {
            console.log("Error Trying to Respond to Client!: " + result);
            res.status(500).send("Unknown Error!");
        }
    });

}).post('/promotions/:tid/', function (req, res) { // POST request for Promotions
    var startDate = req.body.startdate;
    var endDate = req.body.enddate;
    var discount = req.body.discount;
    var tid = req.params.tid;

    travel.addPromotion(startDate, endDate, discount, tid, function (err, result) {
        res.type('json');
        if (err) {
            res.status(500);
            res.send(`{"message":"Error Occurred"}`);
        } else if (result.insertId == null) {
            res.status(201);
            res.send(result);
        } else {
            res.status(201);
            res.send(`{"promotionid":"${result.insertId}"}`);
        }
    });
}).delete('/promotions/:tid/', (req, res) => { // DELETE request for Promotions
    var promoId = req.params.tid;
    travel.deletepromotion(promoId, (err, result) => {
        res.type('json');
        if (!err) {
            console.log(result.affectedRows + " Promotion record deleted");
            res.status(204).send(result.affectedRows + " Promotion record deleted");
        } else {
            console.log(err);
            res.status(500).send("Unknown Error!");
        }
    });
}).get("/promotions/active/", (req, res) => { // EXTRA: GET request for currently ACTIVE Promotions
    travel.getActivePromotions((err, result) => {
        res.type('json');
        if (!err) {
            res.status(200).send(result);
            console.log("Sent Response to client at " + req.connection.remoteAddress);
        } else {
            console.log("Error Trying to Respond to Client!: " + result);
            res.status(500).send("Unknown Error!");
        }
    });

})



// assignment 2

app.post('/users/login',function(req, res){
    var email=req.body.email;
    var password = req.body.password;

    user.loginUser(email, password, function(err, token, result){
        if(!err){
            res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              delete result[0]['password'];//clear the password in json data, do not send back to client
              console.log(result);
            res.json({success: true, UserData: JSON.stringify(result), token:token, status: 'You are successfully logged in!'}); 
            res.send();
        }else{
            res.status(500);
            res.send(err.statusCode);
        }
    }); 

}).post('/user/logout', function(req,res){
	console.log("..logging out.");
	res.clearCookie('session-id'); //clears the cookie in the response
	res.setHeader('Content-Type', 'application/json');
  	res.json({success: true, status: 'Log out successful!'});

})
// .get("/travel/period/:period", (req, res) => { //
//     var period = req.params.period;
    
//     travel.periodListingSearch(period, (err, result) => {
//         if (!err) {
//             res.status(200).send(result);
//             console.log("Sent Response to client at " + req.connection.remoteAddress);
//         } else {
//             console.log("Error Trying to Respond to Client!: " + result);
//             res.status(500).send("Unknown Error!");
//         }
//     });

// })
.get("/travel/search/:search/:period/:price", (req, res) => { //
    var search = `%${req.params.search}%`; // %'s added to fit MySQL syntax for LIKE in SELECT statement
    var period = `%${req.params.period}%`;
    var price = req.params.price;
    
    travel.dynamicListingSearch(search, period, price, (err, result) => {
        if (!err) {
            res.status(200).send(result);
            console.log("Sent Response to client at " + req.connection.remoteAddress);
        } else {
            console.log("Error Trying to Respond to Client!: " + result);
            res.status(500).send("Unknown Error!");
        }
    });

})
// .get("/travel/search/:search", (req, res) => { //
    // var search = `%${req.params.search}%`; // %'s added to fit MySQL syntax for LIKE in SELECT statement
    // var period = 0;
    
    // travel.dynamicListingSearch(search, period, (err, result) => {
    //     if (!err) {
    //         res.status(200).send(result);
    //         console.log("Sent Response to client at " + req.connection.remoteAddress);
    //     } else {
    //         console.log("Error Trying to Respond to Client!: " + result);
    //         res.status(500).send("Unknown Error!");
    //     }
//     });

// })



.get("/travel/search2/:search2", (req, res) => { 
    //var search = `%${req.params.search}%`; // %'s added to fit MySQL syntax for LIKE in SELECT statement
    var search2 = req.params.search2;
    travel.dynamicListingSearch2(search2, (err, result) => {
        if (!err) {
            res.status(200).send(result);
            console.log("Sent Response to client at " + req.connection.remoteAddress);
        } else {
            console.log("Error Trying to Respond to Client!: " + result);
            res.status(500).send("Unknown Error!");
        }
    });
})

module.exports = app;

// .post('/upload', function (req, res) { // EXTRA: For JPEG image uploading
//     if (!req.files || Object.keys(req.files).length === 0) { // If nothing is submitted
//         res.status(400).send('No files were uploaded.');
//     } else if (req.files.file.mimetype != 'image/jpeg') { // Checks if file uploaded is a JPEG file
//         res.status(400).send('Only JPEG images can be uploaded!')
//     } else if (req.files.file.size > 1000000) { // Checks if JPEG is over 1000 & stops upload if it is
//         res.status(400).send('JPEG images are limited to 1 MB!')
//     } else {
//         var file = req.files.file;
//         var path = './Images/' + req.files.file.name;
//         console.log(file);
//         file.mv(path, function (err) { // Moves uploaded file to specified directory path
//             if (err) {
//                 res.status(500).send(err);
//             } else {
//                 res.write({"url":`http://localhost:8081/${req.files.file.name}`})
//                 res.write('File uploaded: ' + path);
//                 res.write('\nFile type: ' + req.files.file.mimetype);
//                 res.write('\nFile size: ' + req.files.file.size + ' bytes');
//                 res.end();
//             }
//         });
//     }
// })