const nodeMailer = require('nodemailer');
const {
    MAIL_HOST, MAIL_PORT, USER_EMAIL, USER_PASSWORD, ADMIN_EMAIL
} = require('@config/email');

const sendMail = async (subject, htmlContent) => {
    const transporter = nodeMailer.createTransport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        secure: false, // if port 465 (smtps) => true
        auth: {
            user: USER_EMAIL,
            pass: USER_PASSWORD
        }
    })

    const options = {
        from: USER_EMAIL,
        to: ADMIN_EMAIL,
        subject: subject,
        html: htmlContent
    }

    return transporter.sendMail(options)
}

module.exports = { sendMail };