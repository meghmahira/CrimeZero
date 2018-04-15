let express = require('express');
let app = express();
let mongodb = require('mongodb');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let database = require('./config/database');
let port = process.env.PORT || 3000;

//mongodb.connect(database.url); // connect to mongoDB database

app.use(express.static(__dirname + '/public')); // set the static files location
app.use(express.static(__dirname + '/public/views')); // set the static views location
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

//routes
require('./app/routes.js')(app);

//Start Node.js Sever and Listen to port
app.listen(port);
console.log("App listening on port : " + port);