let configs = require('./configs');
let mailer = require('nodemailer');

function sendEmail(subject, text) {
    let transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: configs.sender.email,
            pass: configs.sender.password
        }
    });

    let mailOptions = {
        from: configs.sender.email,
        to: configs.destinations.join(', '),
        subject,
        text
    };
    transporter.sendMail(mailOptions);
}

module.exports = sendEmail;