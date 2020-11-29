const email = require('/api/config/email');
const transporter = require('nodemailer').createTransport(email);
const { root: link } = require("/api/config");

