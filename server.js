// packages
const compression = require("compression");
const express = require("express");
const body_parser = require('body-parser')
const ejs = require("ejs");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

// start
const app = express();


// enviroment
const isProd = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;


//  static files
app.use("/api/public", express.static(__dirname + "/api/public"));
app.use("/api/public/images", express.static(__dirname + "/api/public/images"));


// db setup
const db = require("../e-commerce/api/config/database.json");
const dbURI = isProd ? db.dbProd : db.dbDev;
mongoose.connect(dbURI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});


// setup ejs
app.set("view engine", "ejs");


// others configs
if(!isProd) app.use(morgan("dev"));
app.use(cors());
app.disable('x-powered-by');
app.use(compression());


// setup body-parser
app.use(body_parser.json({limit: 1.5*1024*1024}));
app.use(body_parser.urlencoded({extends: true, limit: 1.5*1024*1024}));

// models
require("../e-commerce/api/components/user/model");


// loading routes
const routes = require('../e-commerce/api/routes');
app.use("/", routes)


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