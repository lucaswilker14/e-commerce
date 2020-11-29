// packages
const compression = require("compression");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

// start
const app = express();


// enviroment
const isProd = process.env.NODE_ENV === "production";
const PORT = process.en.PORT || 3000;


//  static files
app.use("/api/public", express.static(__dirname + "/api/public"));
app.use("/api/public/images", express.static(__dirname + "/api/public/images"));


// db setup
const db = require("./api/config/database");
const dbURI = isProd ? db.dbProd : db.dbDev;
mongoose.connect(dbURI, {userNewUrlParser: true});


// setup ejs
app.set("view engine", "ejs");


// others configs
if(!isProd) app.use(morgan("dev"));
app.use(cors());
app.disable('x-powered-by');
app.use(compression());


// setup body-parser
app.use(bodyParser.urlencoded({extends: false, limit: 1.5*1024*1024}));
app.use(bodyParser.json({limit: 1.5*1024*1024}));


// loading routes
app.use("/", require("/api/routes"))


// 404 - route
app.use((req, res, next) => {
   const err = new Error("Not Found");
   err.status = 404
    next(err);
});


// other errs routes
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    if(err.status !== 404) console.warn("Error:", err.message, new Date());
    res.json({message: err.message, status: err.status})
});

// listener
app.listen(PORT, (err) => {
    if(err) throw err;
    console.log(`Run in http://localhost:${PORT}`);
});