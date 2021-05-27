
const express=require('express');
const bodyParser= require('body-parser')
const multer = require('multer');
const path = require('path');
// const serveStatic = require('serve-static');

var app = require('./controller/app.js');
//var app = express();
var port = 8081;
var server = app.listen(port, function(){
    console.log('Web App Hosted at http://localhost:%s',port);
    
});




