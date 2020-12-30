// packages
import compression from 'compression';
import express from 'express';
import body_parser from 'body-parser';
import ejs from 'ejs';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path'


// start application
const app = express();


// enviroment
const isProd = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;


//  static files
app.use(express.static(path.join(__dirname, '/api/public')));
app.use("/api/public/images", express.static(__dirname + "../api/public/images"));


// db setup
const db = require("../e-commerce/api/config/database.json");
const dbURI = isProd ? db.dbProd : db.dbDev;
mongoose.connect(dbURI, {useNewUrlParser: true, useCreateIndex: true,
                                useUnifiedTopology: true, useFindAndModify: false});

// Set 'views' directory for any views
// being rendered res.render()
app.set('views', path.join(__dirname, '/api/components/user/views'));

// Set view engine as EJS
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');


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
require("../e-commerce/api/components/store/model")
require("../e-commerce/api/components/client/model")
require("../e-commerce/api/components/category/model")
require("../e-commerce/api/components/products/model")


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
    if (err.status === 401) return res.status(err.status).send({message: err});
    res.status(422).json(err);
});


// listener
app.listen(PORT, (err) => {
    if(err) throw err;
    console.log(`Run in http://localhost:${PORT}`);
});