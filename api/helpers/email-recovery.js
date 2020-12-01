const email = require('../config/email');
const transporter = require('nodemailer').createTransport(email);
const { api: link } = require("../config/config");

