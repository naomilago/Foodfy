const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: { 
        user: "124860ee19e69d", 
        pass: "08c43a8f5f2718" 
    }
});